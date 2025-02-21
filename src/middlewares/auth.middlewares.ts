import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.models";
import Property from "../models/property.models";
import Booking from "../models/booking.models";

// Middleware to check if the user is authenticated
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1]; // Get the token after "Bearer "

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    // Fetch the user from the database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
      return;
    }

    // Attach the user to the request object
    req.user = {
      id: user.id,
      role: user.role as "renter" | "host",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized: Token expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid token" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
};

// Middleware to check if the user is a host
export const isHost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.user && req.user.role === "host") {
    next();
    return;
  }
  res
    .status(403)
    .json({ success: false, message: "Access denied. Hosts only." });
};
// Middleware to check if the user is a host
export const isRenter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.user && req.user.role === "renter") {
    next();
    return;
  }
  res
    .status(403)
    .json({ success: false, message: "Access denied. Renters only." });
};
// Middleware to check if the user owns a property
export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const property = await Property.findByPk(id);

    if (!property) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }

    if (property.hostId !== userId) {
      res.status(403).json({
        success: false,
        message: "Access denied. You are not the owner of this property."
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Middleware to check if the user owns a booking
export const isBookingOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    if (booking.renterId !== userId) {
      res.status(403).json({
        success: false,
        message: "Access denied. You are not the renter of this booking."
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
