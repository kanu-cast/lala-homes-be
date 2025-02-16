import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV || "development";

const configs: any = {
  development: {
    url: process.env.DB_DEV_URL,
    dialect: "postgres"
  },
  test: {
    url: process.env.DB_TEST_URL,
    dialect: "postgres"
  },
  production: {
    url: process.env.DB_PROD_URL,
    dialect: "postgres"
  }
};

export default configs[env];
