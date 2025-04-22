import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { Role } from "@prisma/client";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    await db.user.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(Role).includes(role)) {
      res.status(400).json({
        success: false,
        message: "Invalid role",
      });
      return;
    }

    const user = await db.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalDermatologists, totalProducts, totalAppointments] =
      await Promise.all([
        db.user.count({ where: { role: "USER" } }),
        db.user.count({ where: { role: "DERMATOLOGISTS" } }),
        db.product.count(),
        db.appointment.count(),
      ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDermatologists,
        totalProducts,
        totalAppointments,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
