import jwt from "jsonwebtoken";
import User from "../models/user.models";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key";

export const generateToken = (user: User) => {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d"
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
};
