import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { SkinConcern } from "@prisma/client";

export const getLogs = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const logs = await db.progressLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Get logs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createLog = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { imageUrl, notes, concerns, rating } = req.body;

    if (!concerns || !rating) {
      res.status(400).json({
        success: false,
        message: "Concerns and rating are required",
      });
      return;
    }

    const log = await db.progressLog.create({
      data: {
        userId,
        imageUrl,
        notes,
        concerns: concerns as SkinConcern,
        rating: Number(rating),
      },
    });

    res.status(201).json({
      success: true,
      log,
    });
  } catch (error) {
    console.error("Create log error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const log = await db.progressLog.findUnique({
      where: { id },
    });

    if (!log) {
      res.status(404).json({
        success: false,
        message: "Log not found",
      });
      return;
    }

    if (log.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this log",
      });
      return;
    }

    await db.progressLog.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Log deleted successfully",
    });
  } catch (error) {
    console.error("Delete log error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getComparison = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      res.status(400).json({
        success: false,
        message: "From and to dates are required",
      });
      return;
    }

    const [beforeLog, afterLog] = await Promise.all([
      db.progressLog.findFirst({
        where: {
          userId,
          createdAt: {
            gte: new Date(fromDate as string),
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      db.progressLog.findFirst({
        where: {
          userId,
          createdAt: {
            lte: new Date(toDate as string),
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (!beforeLog || !afterLog) {
      res.status(404).json({
        success: false,
        message: "Not enough data for comparison",
      });
      return;
    }

    const improvementPercentage =
      ((afterLog.rating - beforeLog.rating) / beforeLog.rating) * 100;

    res.status(200).json({
      success: true,
      comparison: {
        before: beforeLog,
        after: afterLog,
        improvementPercentage,
      },
    });
  } catch (error) {
    console.error("Get comparison error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
