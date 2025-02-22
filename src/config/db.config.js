"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = exports.sequelize = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize_1 = require("sequelize");
// Get the environment (default to 'development')
const env = process.env.NODE_ENV || "development";
// Get the correct database URL based on the environment
const DB_URL =
  env === "development"
    ? process.env.DB_DEV_URL
    : env === "test"
      ? process.env.DB_TEST_URL ||
        "postgresql://test_db_owner:npg_unb72WUiTrYV@ep-small-glade-abds6o55-pooler.eu-west-2.aws.neon.tech/test_db?sslmode=require"
      : process.env.DB_PROD_URL;
// Log the database URL to check if it's correct (remove this after debugging)
console.log("Connecting to database:", DB_URL);
// Create Sequelize instance
exports.sequelize = new sequelize_1.Sequelize(DB_URL, {
  dialect: "postgres",
  logging: false // Set this to `true` for more verbose logging if needed
});
// Function to test database connection
const dbConnect = () => {
  exports.sequelize
    .authenticate()
    .then(() => console.log(`✅ ${env} Database connected successfully!`))
    .catch((err) => console.error("❌ Database connection failed:", err));
  // Sync models with the database
  exports.sequelize.sync({}).then(() => {
    console.log("Database synchronized");
  });
};
exports.dbConnect = dbConnect;
