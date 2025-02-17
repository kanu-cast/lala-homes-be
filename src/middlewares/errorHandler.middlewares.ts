// author's Note:
// This can be handled in an external package in the future for reusability and uniformity

import { Request, Response, NextFunction } from "express";

export function ErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error (optional)
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  // Send a response to the client
  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
}
