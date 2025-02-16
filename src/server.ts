import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { dbConnect } from "./config/db.config";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Initialize Sequelize (replace with your actual DB config)
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false // Disable logging for cleaner output
  }
);
// Basic route
app.get("/", (req, res) => {
  res.send("Hello world! It’s LaLa Homes here!! 🏡✨");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

dbConnect();
