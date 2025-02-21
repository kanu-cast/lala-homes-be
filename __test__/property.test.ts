import request from "supertest";
import app from "../src/app";
import jwt from "jsonwebtoken";

// Mock User Data
const renterUser = {
  id: "b7d5a93c-2f14-4c89-bc97-efa3d42e671b",
  role: "renter"
};
const hostUser = {
  id: "f1c3a8d5-6e42-49b9-b7a3-12e8d76c4e5a",
  role: "host"
};

// Mock JWT Tokens
let renterToken = jwt.sign(renterUser, process.env.JWT_SECRET as string);
let hostToken = jwt.sign(hostUser, process.env.JWT_SECRET as string);

describe("Property Routes", () => {
  let propertyId: string;

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Junior",
      lastName: "Doe",
      email: "juniordoe1@example.com",
      password: "SecurePass123!"
    });
    renterToken = res.body.token;
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty(
      "message",
      "User registered and logged in successfully"
    );
    expect(res.body).toHaveProperty("token");
  });
  // Test property creation
  it("should allow an authenticated user to create a property", async () => {
    const res = await request(app)
      .post("/api/property")
      .set("Authorization", `${renterToken}`)
      .send({
        title: "Luxury Apartment",
        description: "A nice place to stay",
        price: 150,
        currency: "USD",
        category: "apartment",
        location: "New York"
      });
    expect(res.status).toBe(201);
    expect(res.body.property).toHaveProperty("id");
    expect(res.body.property.title).toBe("Luxury Apartment");

    propertyId = res.body.property.id;
  });

  // Test fetching all properties
  it("should retrieve all properties", async () => {
    const res = await request(app).get("/api/property");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test fetching a single property
  it("should retrieve a specific property", async () => {
    const res = await request(app).get(`/api/property/${propertyId}`);

    expect(res.status).toBe(200);
    expect(res.body.property.id).toBe(propertyId);
  });

  // Test property update
  it("should allow the owner to update a property", async () => {
    const res = await request(app)
      .put(`/api/property/${propertyId}`)
      .set("Authorization", `${renterToken}`)
      .send({
        title: "Luxury Apartment",
        description: "A nice place to stay",
        price: 4150,
        currency: "USD",
        category: "apartment",
        location: "New York"
      });

    expect(res.status).toBe(200);
    expect(res.body.property.price).toBe(4150);
  });

  // Unauthorized update attempt
  it("should prevent unauthorized users from updating a property", async () => {
    const res = await request(app)
      .put(`/api/property/${propertyId}`)
      .set("Authorization", `Bearer ${hostToken}`)
      .send({ price: 250 });

    expect(res.status).toBe(401);
  });

  // Test property deletion
  it("should allow the owner to delete a property", async () => {
    const res = await request(app)
      .delete(`/api/property/${propertyId}`)
      .set("Authorization", `${renterToken}`);

    expect(res.status).toBe(200);
  });

  // Attempt to delete a non-existing property
  it("should return 404 for a non-existent property", async () => {
    const res = await request(app)
      .delete(`/api/property/${propertyId}`)
      .set("Authorization", `${renterToken}`);

    expect(res.status).toBe(404);
  });
});
