import { Router } from "express";
import {
  isAuthenticated,
  isBookingOwner,
  isHost
} from "../middlewares/auth.middlewares";

import {
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  confirmBooking,
  updateBooking
} from "../controllers/booking.controllers";
import {
  bookingValidation,
  checkAvailability
} from "../middlewares/validators.middlewares";
import { validate } from "../middlewares/validate.middlewares";

const router = Router();

router.post(
  "/",
  bookingValidation,
  validate,
  isAuthenticated,
  checkAvailability,
  createBooking
);
router.get("/", isAuthenticated, getBookings);
router.get("/:id", isAuthenticated, getBooking);
router.patch("/:id/cancel", isAuthenticated, isBookingOwner, cancelBooking);
router.patch("/:id/confirm", isAuthenticated, isHost, confirmBooking);
router.patch(
  "/:id",
  isAuthenticated,
  isBookingOwner,
  bookingValidation,
  validate,
  checkAvailability,
  updateBooking
);

export default router;
