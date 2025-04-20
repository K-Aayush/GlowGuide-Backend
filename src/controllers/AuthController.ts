import { Request, Response } from "express";
import { db } from "../lib/prisma";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import generateToken from "../utils/generateToken";

interface AuthRequest extends Request {
  user?: any;
}

//register user controller
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password || !role || !phone) {
    res.status(400).json({ success: false, message: "Missing details" });
    return;
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    //check if there is any existing user
    if (existingUser) {
      res.status(401).json({ success: false, message: "user already exists" });
      return;
    }

    //check existing phonenumber
    const existingNumber = await db.user.findUnique({
      where: { phone },
    });

    if (existingNumber) {
      res
        .status(401)
        .json({ success: false, message: "phone number already exists" });
      return;
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //validate roles
    const allowedRoles = ["USER", "DERMATOLOGISTS", "ADMIN"];
    if (!allowedRoles.includes(role)) {
      res.status(400).json({ success: false, message: "Invalid role" });
      return;
    }

    //create userdata
    const userData: Prisma.UserCreateInput = {
      email,
      password: hashPassword,
      role,
      name,
      phone,
    };

    const createdUser = await db.user.create({
      data: userData,
    });

    const token = generateToken(createdUser.id);

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
        phone: createdUser.phone,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//login user controller
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Missing details" });
    return;
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    //throw error if user doesn't exists
    if (!existingUser) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    //check if password matches
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = generateToken(existingUser.id);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  if (!userId) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized, login again" });
    return;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
