import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key";

import { UserAttributes } from "../models/user.models";

export const generateAuthToken = (user: UserAttributes): string => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
};
