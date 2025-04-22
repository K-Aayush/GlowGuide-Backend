import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { SkinConcern, SkinType } from "@prisma/client";

export const getSkinProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const profile = await db.skinProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Skin profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get skin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createSkinProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { skinType, concerns, allergies, goals } = req.body;

    if (!skinType || !concerns) {
      res.status(400).json({
        success: false,
        message: "Skin type and concerns are required",
      });
      return;
    }

    // Check if profile already exists
    const existingProfile = await db.skinProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      res.status(400).json({
        success: false,
        message: "Skin profile already exists",
      });
      return;
    }

    const profile = await db.skinProfile.create({
      data: {
        userId,
        SkinType: {
          create: skinType.map((type: string) => ({ type })),
        },
        Concerns: {
          create: concerns.map((concern: string) => ({ concern })),
        },
        allergies,
        goals,
      },
    });

    res.status(201).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Create skin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateSkinProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { skinType, concerns, allergies, goals } = req.body;

    const profile = await db.skinProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Skin profile not found",
      });
      return;
    }

    const updatedProfile = await db.skinProfile.update({
      where: { userId },
      data: {
        SkinType: {
          create: skinType.map((type: string) => ({ type })),
        },
        Concerns: {
          create: concerns.map((concern: string) => ({ concern })),
        },
        allergies,
        goals,
        lastAssessment: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update skin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
