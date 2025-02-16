import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello world! It’s LaLa Homes here!! 🏡✨");
});

export default app;
