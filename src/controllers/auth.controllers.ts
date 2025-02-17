// auth.controllers.ts
import { Request, Response, RequestHandler, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models";
import UserService from "../services/auth.service";
import { generateToken } from "../utils/auth.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import passport from "passport";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // Change this in production

// Register User
export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user already exists
    const user = await UserService.registerUser(req.body, res);
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(201).json({ message: "Logged in successfully", user });
    });
  } catch (error) {
    return next({ error });
  }
};
