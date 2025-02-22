import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: "renter" | "host";
      firstName?: string;
      lastName?: string;
      email?: string;
      token?: string;
    };
  }
}
