import express, { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { ErrorHandler } from "./middlewares/errorHandler.middlewares";
import { sendResponse } from "./utils/sendResponse.utils";
import passport from "passport";
import "./config/passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import bookingRoutes from "./routes/booking.routes";
import propertyRoutes from "./routes/property.routes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Swagger Setup
const swaggerFile = path.resolve(__dirname, "swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFile, "utf8"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Basic route
app.get("/", (req, res) => {
  res.send("Hello world! It’s LaLa Homes here!! 🏡✨");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/bookings", bookingRoutes);

// 404 Handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, 404, false, "Route Not Found", null);
});

// Error Handler
app.use(ErrorHandler);

export default app;
