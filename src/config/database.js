const dotenv = require("dotenv");
dotenv.config();

require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    schema: "public"
  },
  test: {
    username: "test_db_owner",
    password: "npg_unb72WUiTrYV",
    database: "test_db",
    host: "ep-small-glade-abds6o55-pooler.eu-west-2.aws.neon.tech",
    port: 5432,
    dialect: "postgres",
    logging: false,
    schema: "public",
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL === "true",
        rejectUnauthorized: false
      }
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    schema: "public",
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL === "true",
        rejectUnauthorized: false
      }
    }
  }
};
