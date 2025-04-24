import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { Role } from "@prisma/client";

export const getDermatologist = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      where: { role: Role.DERMATOLOGISTS },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      where: { role: Role.USER },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
