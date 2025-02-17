import express, { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { ErrorHandler } from "./middlewares/errorHandler.middlewares";
import { sendResponse } from "./utils/sendResponse.utils";
import session from "express-session";
import passport from "passport";
import "./config/passport";
import cookieParser from "cookie-parser";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
// Middleware
app.use(express.json());
// cros origin stuff
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend requests
    credentials: true // Allow cookies to be sent
  })
);

app.use(express.json());
app.use(cookieParser());

// 🔹 Setup Express Session
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 } // 1 day
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello world! It’s LaLa Homes here!! 🏡✨");
});

app.use("/api/auth", authRoutes);

app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send("Dashboard");
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, 201, true, "Route Not Found", null);
});

app.use(ErrorHandler);
export default app;
