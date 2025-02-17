import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { ErrorHandler } from "./middlewares/errorHandler.middlewares";
import { sendResponse } from "./utils/sendResponse.utils";

// Load environment variables
dotenv.config();

const app = express();
// Middleware
app.use(express.json());
// Enable CORS
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello world! It’s LaLa Homes here!! 🏡✨");
});

app.use("/api/auth", authRoutes);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, 201, true, "Route Not Found", null);
});

app.use(ErrorHandler);
export default app;
