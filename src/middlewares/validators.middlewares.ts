import { Response, Request, NextFunction } from "express";
import { body } from "express-validator";
import { parseDate } from "../utils/parseDate.utils";
import Booking from "../models/booking.models";
import { Op } from "sequelize";

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email address."),
  body("password").notEmpty().withMessage("Password is required.")
];

export const signupValidation = [
  body("firstName")
    .isString()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters."),
  body("lastName")
    .isString()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters."),
  body("email").isEmail().withMessage("Invalid email address."),
  body("password")
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[0-9]/)
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must be at least 8 characters and include an uppercase letter, a number, and a special character."
    )
];

export const propertyValidation = [
  body("title")
    .isString()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters."),
  body("description")
    .isString()
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters."),
  body("location").notEmpty().withMessage("Location is required."),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number."),
  body("category")
    .isIn(["villa", "townhouse", "apartment", "cottage"])
    .withMessage("Invalid category.")
];

/**
 * Custom validation function to check if a date is valid and in the future.
 */
const isValidFutureDate = (value: string) => {
  const parsed = parseDate(value);
  if (!parsed)
    throw new Error(
      "Invalid date format. Use DD.MM.YYYY, DD-MM-YYYY, or DD/MM/YYYY."
    );

  if (new Date(parsed) < new Date())
    throw new Error("Date must be in the future.");

  return true;
};

export const bookingValidation = [
  body("propertyId").isUUID().withMessage("Invalid property ID."),
  body("checkIn").custom(isValidFutureDate),
  body("checkOut").custom((value, { req }) => {
    isValidFutureDate(value);

    // Ensure checkOut is after checkIn
    const checkInParsed = parseDate(req.body.checkIn);
    const checkOutParsed = parseDate(value);

    if (!checkInParsed || !checkOutParsed)
      throw new Error("Invalid date format.");

    if (new Date(checkOutParsed) <= new Date(checkInParsed)) {
      throw new Error("Check-out date must be after check-in date.");
    }

    return true;
  })
];

export const checkAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { propertyId, checkIn, checkOut } = req.body;

  // Validate input
  if (!propertyId || !checkIn || !checkOut) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    // Parse dates to ensure they are in the correct format
    const parsedCheckIn = new Date(checkIn);
    const parsedCheckOut = new Date(checkOut);

    if (isNaN(parsedCheckIn.getTime()) || isNaN(parsedCheckOut.getTime())) {
      res.status(400).json({ message: "Invalid date format." });
      return;
    }

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
      where: {
        propertyId,
        [Op.or]: [
          {
            checkIn: { [Op.between]: [parsedCheckIn, parsedCheckOut] }
          },
          {
            checkOut: { [Op.between]: [parsedCheckIn, parsedCheckOut] }
          },
          {
            checkIn: { [Op.lte]: parsedCheckIn },
            checkOut: { [Op.gte]: parsedCheckOut }
          }
        ]
      }
    });

    if (existingBooking) {
      res.status(400).json({
        message: "Property is already booked for the selected dates.",
        conflictingBooking: {
          checkIn: existingBooking.checkIn,
          checkOut: existingBooking.checkOut
        }
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
