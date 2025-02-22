import { Router, Request, Response } from "express";
import { register } from "../controllers/auth.controllers";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  signupValidation,
  loginValidation
} from "../middlewares/validators.middlewares";
import { validate } from "../middlewares/validate.middlewares";
import User from "../models/user.models";

const router = Router();

// Register route
router.post("/register", signupValidation, validate, register);

// Login route (Local Strategy)
router.post(
  "/login",
  loginValidation,
  validate,
  passport.authenticate("local", { session: false }),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const token = jwt.sign(
        {
          id: req.user.id,
          role: req.user.role,
          firstName: req.user.firstName,
          lastName: req.user.lastName
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "6h" }
      );

      res.json({
        success: true,
        token: "Bearer " + token,
        user: {
          id: req.user.id,
          role: req.user.role,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email
        }
      });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

// Initiate Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   async (req, res) => {
//     try {
//       if (!req.user) {
//         res.status(401).json({ success: false, message: "Unauthorized" });
//         return;
//       }

//       const token = jwt.sign(
//         { id: req.user.id, role: req.user.role },
//         process.env.JWT_SECRET as string,
//         { expiresIn: "1h" }
//       );

//       res.json({
//         success: true,
//         token: "Bearer " + token,
//         user: {
//           id: req.user.id,
//           role: req.user.role,
//           firstName: req.user.firstName,
//           lastName: req.user.lastName,
//           email: req.user.email
//         }
//       });
//     } catch (error) {
//       res
//         .status(500)
//         .json({ success: false, message: "Internal server error" });
//     }
//   }
// );
router.get(
  "/google/callback",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      // Check if user exists in the database
      let user = await User.findOne({ where: { email: req.user.email } });

      if (!user) {
        // Create a new user
        user = await User.create({
          googleId: req.user.id, // Store Google ID
          firstName: req.user.firstName as string,
          lastName: req.user.lastName as string,
          email: req.user.email as string,
          role: "renter" // Default role
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "6h" }
      );

      res.redirect(
        `${process.env.FRONTEND_URL}/property?id=${user.id}&token=${token}&first=${user.firstName}&last=${user.lastName}`
      );
      return;
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

export default router;
