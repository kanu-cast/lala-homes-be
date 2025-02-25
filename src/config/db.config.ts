import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

// Get the environment (default to 'development')
const env = process.env.NODE_ENV || "development";

// Get the correct database URL based on the environment
const DB_URL =
  env === "development"
    ? process.env.DB_DEV_URL
    : env === "test"
      ? "postgresql://test_db_owner:npg_unb72WUiTrYV@ep-small-glade-abds6o55-pooler.eu-west-2.aws.neon.tech/test_db?sslmode=require"
      : process.env.DB_PROD_URL;

// Log the database URL to check if it's correct (remove this after debugging)
console.log("Connecting to ", env, " environment database:", DB_URL);

// Create Sequelize instance
export const sequelize = new Sequelize(DB_URL as string, {
  dialect: "postgres",
  logging: false // Set this to `true` for more verbose logging if needed
});

// Function to test database connection
export const dbConnect = () => {
  sequelize
    .authenticate()
    .then(() => console.log(`✅ ${env} Database connected successfully!`))
    .catch((err) => console.error("❌ Database connection failed:", err));

  // Sync models with the database
  sequelize.sync({}).then(() => {
    console.log("Database synchronized");
  });
};
