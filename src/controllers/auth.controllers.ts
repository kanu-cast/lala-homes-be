// auth.controllers.ts
import { Request, Response, RequestHandler, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models";
import UserService from "../services/auth.service";
import { generateToken } from "../utils/auth.utils";
import { sendResponse } from "../utils/sendResponse.utils";

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
    // generate token for new user
    const token = generateToken(user);
    sendResponse(res, 201, true, "User registered successfully", {
      user,
      token
    });
  } catch (error) {
    return next({ error });
  }
};

// Login User
export const login: RequestHandler = async (req, res, next) => {
  try {
    // Find user by email
    const validUserAndToken = await UserService.loginUser(req.body, res);
    if (!validUserAndToken) {
      sendResponse(res, 400, false, "Invalid Email/Password Combination");
    } else {
      sendResponse(res, 201, true, "Logged in successfully", {
        validUserAndToken
      });
    }
  } catch (error) {
    return next({ error });
  }
};
