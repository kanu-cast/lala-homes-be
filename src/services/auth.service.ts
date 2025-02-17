import bcrypt from "bcryptjs";
import User from "../models/user.models"; // Ensure correct path based on your structure
import { sendResponse } from "../utils/sendResponse.utils";
import { Response } from "express";
import { generateToken } from "../utils/auth.utils";
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
  static async loginUser(body: LoginUserInput, res: Response) {
    const { email, password } = body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    const token = generateToken(user!);
    return { user, token };
  }
}

export default UserService;
