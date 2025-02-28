import { Request, Response } from "express";
import { db } from "../lib/prisma";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import generateToken from "../utils/generateToken";

//register user controller
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ success: false, message: "Missing details" });
    return;
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    //check if there is any existing user
    if (existingUser) {
      res.status(400).json({ success: false, message: "user already exists" });
      return;
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //validate roles
    const allowedRoles = ["USER", "DERMATOLOGISTS"];
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
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

//login user controller
export const loginUser = () => {};
