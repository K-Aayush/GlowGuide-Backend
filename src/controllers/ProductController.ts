import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { SkinType, SkinConcern } from "@prisma/client";

interface AuthRequest extends Request {
  user?: any;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { skinType, concerns, page = 1, limit = 12 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (skinType) {
      where.suitableFor = {
        has: skinType as SkinType,
      };
    }

    if (concerns) {
      where.targetConcerns = {
        hasSome: Array.isArray(concerns)
          ? (concerns as SkinConcern[])
          : [concerns as SkinConcern],
      };
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.product.count({ where }),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRecommendedProducts = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized, Login Again!" });
      return;
    }

    // Get user's skin profile
    const skinProfile = await db.skinProfile.findUnique({
      where: { userId },
      include: {
        SkinType: true,
        Concerns: true,
      },
    });

    if (!skinProfile) {
      res.status(404).json({
        success: false,
        message: "Skin profile not found",
      });
      return;
    }

    // Extract values from relation models
    const skinTypes = skinProfile.SkinType.map((s) => s.type);
    const concerns = skinProfile.Concerns.map((c) => c.concern);

    // Find products matching user's skin type and concerns
    const products = await db.product.findMany({
      where: {
        suitableSkinTypes: {
          some: { type: { in: skinTypes } },
        },
        targetConcerns: {
          some: { concern: { in: concerns } },
        },
      },
      take: 6,
      orderBy: {
        sustainabilityScore: "desc",
      },
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get recommended products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
