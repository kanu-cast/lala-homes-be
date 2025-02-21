import { Request, Response, NextFunction } from "express";
import Property from "../models/property.models";
import Booking from "../models/booking.models";
import User from "../models/user.models";
import { parseDate } from "../utils/parseDate.utils";

// Create a new booking
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { propertyId, checkIn, checkOut } = req.body;
    const renterId = req.user?.id as string;

    // Parse the dates using the flexible parsing function
    const checkInDate = parseDate(checkIn);
    const checkOutDate = parseDate(checkOut);

    // Check if the dates are valid
    if (!checkInDate || !checkOutDate) {
      res
        .status(400)
        .json({ message: "Invalid date format for checkIn or checkOut" });
      return;
    }

    // Ensure the property exists
    const property = await Property.findByPk(propertyId);
    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }
    // Ensure the renter is not the host
    if (renterId === property.hostId) {
      res
        .status(403)
        .json({ message: "Hosts cannot book their own properties" });
      return;
    }
    // Create the booking
    const booking = await Booking.create({
      propertyId,
      renterId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      status: "pending"
    });

    res.status(201).json({ message: "Booking created successfully", booking });
    return;
  } catch (error) {
    next(error);
  }
};

// Get all bookings (for renter)
export const getBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const renterId = req.user?.id;

    const bookings = await Booking.findAll({
      where: { renterId },
      include: [{ model: Property, as: "property" }]
    });

    res.status(200).json({ bookings });
    return;
  } catch (error) {
    next(error);
  }
};

// Get a single booking
export const getBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        { model: Property, as: "property" },
        {
          model: User,
          as: "renter",
          attributes: ["firstName", "lastName", "email"]
        }
      ]
    });

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    res.status(200).json({ booking });
    return;
  } catch (error) {
    next(error);
  }
};

// Cancel a booking
export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    booking.status = "canceled";
    await booking.save();

    res.status(200).json({ message: "Booking canceled successfully", booking });
    return;
  } catch (error) {
    next(error);
  }
};

// Confirm a booking (Host only)
export const confirmBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [{ model: Property, as: "property" }]
    });

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    // Ensure the authenticated user is the host of the property
    if (booking.property.hostId !== req.user?.id) {
      res
        .status(403)
        .json({ message: "Only the host can confirm this booking" });
      return;
    }

    booking.status = "confirmed";
    await booking.save();

    res
      .status(200)
      .json({ message: "Booking confirmed successfully", booking });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    // Convert dates into proper format
    const checkIn = parseDate(startDate);
    const checkOut = parseDate(endDate);

    // Ensure booking exists
    const booking = await Booking.findByPk(id);
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    // Update the booking
    booking.checkIn = checkIn as Date;
    booking.checkOut = checkOut as Date;
    await booking.save();

    res.status(200).json({ message: "Booking updated successfully", booking });
    return;
  } catch (error) {
    console.log("££££££££££££££££££££££££££££££££££££", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
