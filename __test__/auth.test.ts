import request from "supertest";
import app from "../src/app";
import { sequelize } from "../src/config/db.config";

describe("Auth Routes", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database before tests
  });

  afterAll(async () => {
    await sequelize.close();
  });

  let agent = request.agent(app);
  let token: string;
  let userId: string;

  const userCredentials = {
    firstName: "John",
    lastName: "Doe",
    email: "test@example.com",
    password: "Test@1234"
  };

  /** ✅ Test User Registration */
  it("should register a user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(userCredentials);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");
    userId = res.body.user.id;
  });

  /** ✅ Test User Login */
  it("should log in a user successfully", async () => {
    const res = await agent.post("/api/auth/login").send({
      email: userCredentials.email,
      password: userCredentials.password,
      rememberMe: true
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    token = res.headers["set-cookie"][0]; // Store session token for authenticated requests
  });

  /** ❌ Test Login with Incorrect Password */
  it("should not log in with incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: userCredentials.email,
      password: "wrongpassword"
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Invalid Email/Password Combination"
    );
  });

  /** ✅ Test Authenticated Route (GET /me) */
  it("should return user details when authenticated", async () => {
    const res = await agent.get("/api/auth/me");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  /** ❌ Test Authenticated Route Without Login */
  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  /** ✅ Test Logout */
  it("should log out the user", async () => {
    const res = await agent.post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Logged out successfully");
  });

  /** ❌ Test Access to Protected Route After Logout */
  it("should deny access to /me after logout", async () => {
    const res = await agent.get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  /** ✅ Test Google OAuth Redirection */
  it("should redirect to Google OAuth login", async () => {
    const res = await request(app).get("/api/auth/google");
    expect(res.status).toBe(302); // Expect a redirect response
  });

  /** ❌ Test Google OAuth Callback Failure */
  it("should redirect to login on Google OAuth failure", async () => {
    const res = await request(app).get("/api/auth/google/callback");
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("//accounts.google.com/o/oauth2");
  });
});
