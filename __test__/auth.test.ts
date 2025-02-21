import request from "supertest";
import app from "../src/app"; // Adjust the path to your Express app
import { sequelize } from "../src/config/db.config"; // Ensure correct path
import User from "../src/models/user.models";
import jwt from "jsonwebtoken";

let token: string;

describe("🔐 AUTHENTICATION TESTS", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "johnwick@example.com",
      password: "SecurePass123!"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty(
      "message",
      "User registered and logged in successfully"
    );
    expect(res.body).toHaveProperty("token");
  });

  it("should not register with an existing email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "johnwick@example.com",
      password: "SecurePass123!"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Email already in use");
  });

  it("should log in an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "johnwick@example.com",
      password: "SecurePass123!"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should reject login with incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "johnwick@example.com",
      password: "WrongPass123!"
    });

    expect(res.statusCode).toBe(401);
  });

  it("should access a protected route with a valid token", async () => {
    const res = await request(app)
      .post("/api/property/")
      .send({
        title: "Another cool crib",
        description: "Another cozy crib is beautifulllllllll",
        price: 1200,
        currency: "rwf",
        category: "villa",
        location: "niboye, kicukiro, kigali, rwanda"
      })
      .set("Authorization", token);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Property created successfully");
  });

  it("should reject access to a protected route without a token", async () => {
    const res = await request(app).post("/api/property/").send({
      title: "Another cool crib",
      description: "Another cozy crib is beautifulllllllll",
      price: 1200,
      currency: "rwf",
      category: "villa",
      location: "niboye, kicukiro, kigali, rwanda"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty(
      "message",
      "Unauthorized: No token provided"
    );
  });

  it("should reject access to a protected route with an invalid token", async () => {
    const res = await request(app)
      .post("/api/property/")
      .send({
        title: "Another cool crib",
        description: "Another cozy crib is beautifulllllllll",
        price: 1200,
        currency: "rwf",
        category: "villa",
        location: "niboye, kicukiro, kigali, rwanda"
      })
      .set("Authorization", "Bearer invalid.token.here");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized: Invalid token");
  });

  it("should simulate Google OAuth login", async () => {
    const mockUser = {
      id: "123456",
      firstName: "Google",
      lastName: "User",
      email: "googleuser@example.com"
    };

    const user = await User.create({
      googleId: mockUser.id,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      role: "renter"
    });

    const token = `Bearer ${jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" })}`;

    expect(user).toBeDefined();
    expect(token).toMatch(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/);
  });
});
