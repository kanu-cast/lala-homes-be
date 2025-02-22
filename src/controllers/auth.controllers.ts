import { Request, Response, NextFunction } from "express";
import UserService from "../services/auth.service";
import jwt from "jsonwebtoken";

// Register User
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.registerUser(req.body, res);

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      message: "User registered and logged in successfully",
      token: "Bearer " + token,
      user: {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};
