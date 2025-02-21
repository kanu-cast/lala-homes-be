import bcrypt from "bcryptjs";
import User from "../models/user.models"; // Ensure correct path based on your structure
import { sendResponse } from "../utils/sendResponse.utils";
import { Response } from "express";

interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface LoginUserInput {
  email: string;
  password: string;
}
class UserService {
  static async registerUser(
    { firstName, lastName, email, password }: RegisterUserInput,
    res: Response
  ) {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      sendResponse(res, 400, false, "Email already in use", null);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      role: "renter",
      email,
      password: hashedPassword
    });

    return user;
  }
}

export default UserService;
