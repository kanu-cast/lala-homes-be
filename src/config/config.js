require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    migrationStoragePath: "src/database/migrations",
    seederStoragePath: "src/database/seeders"
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "test_db",
    host: process.env.DB_HOST,
    dialect: "postgres",
    migrationStoragePath: "src/database/migrations",
    seederStoragePath: "src/database/seeders",
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
    dialect: "postgres"
  }
};
