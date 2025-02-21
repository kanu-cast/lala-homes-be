import request from "supertest";
import app from "../src/app";
import { sequelize } from "../src/config/db.config";
import Property from "../src/models/property.models";
import User from "../src/models/user.models";
import { generateAuthToken } from "../src/utils/auth.utils";

let renterToken: string;
let hostToken: string;
let renterId: string;
let hostId: string;
let propertyId: string;
let bookingId: string;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset DB before tests

  // Create a host
  const host = await User.create({
    firstName: "Host",
    lastName: "User",
    email: "host@example.com",
    password: "password123",
    role: "host"
  });
  hostId = host.id;
  hostToken = generateAuthToken(host);

  // Create a renter
  const renter = await User.create({
    firstName: "Renter",
    lastName: "User",
    email: "renter@example.com",
    password: "password123",
    role: "renter"
  });
  renterId = renter.id;
  renterToken = generateAuthToken(renter);

  const property = await Property.create({
    title: "Test Property",
    description: "A test property for booking",
    price: 100,
    currency: "USD",
    location: "Test City",
    hostId: hostId,
    category: "apartment"
  });

  propertyId = property.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Booking Routes", () => {
  it("should create a booking", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${renterToken}`)
      .send({
        propertyId,
        checkIn: "2025-03-10",
        checkOut: "2025-03-15"
      });

    expect(response.status).toBe(201);
    expect(response.body.booking).toHaveProperty("id");
    expect(response.body.booking.status).toBe("pending");
    bookingId = response.body.booking.id;
  });

  it("should not allow a host to book their own property", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${hostToken}`)
      .send({
        propertyId,
        checkIn: "2025-03-10",
        checkOut: "2025-03-15"
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Hosts cannot book their own properties"
    );
  });

  it("should fetch all bookings for the renter", async () => {
    const response = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${renterToken}`);

    expect(response.status).toBe(200);
    expect(response.body.bookings.length).toBeGreaterThan(0);
  });

  it("should fetch a single booking", async () => {
    const response = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${renterToken}`);

    expect(response.status).toBe(200);
    expect(response.body.booking.id).toBe(bookingId);
  });

  //   it("should update a booking", async () => {
  //     const response = await request(app)
  //       .patch(`/api/bookings/${bookingId}`)
  //       .set("Authorization", `Bearer ${renterToken}`)
  //       .send({
  //         checkIn: "2025-10-12",
  //         checkOut: "2025-10-18"
  //       });
  //     console.log("++++++++++++++++++++++++++++++++", response.body);
  //     expect(response.status).toBe(200);
  //     expect(response.body.booking.checkIn).toContain("2025-03-12");
  //     expect(response.body.booking.checkOut).toContain("2025-03-18");
  //   });

  it("should allow the host to confirm a booking", async () => {
    const response = await request(app)
      .patch(`/api/bookings/${bookingId}/confirm`)
      .set("Authorization", `Bearer ${hostToken}`);

    expect(response.status).toBe(200);
    expect(response.body.booking.status).toBe("confirmed");
  });

  it("should allow the renter to cancel a booking", async () => {
    const response = await request(app)
      .patch(`/api/bookings/${bookingId}/cancel`)
      .set("Authorization", `Bearer ${renterToken}`);

    expect(response.status).toBe(200);
    expect(response.body.booking.status).toBe("canceled");
  });

  it("should prevent a non-owner from updating a booking", async () => {
    const response = await request(app)
      .patch(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${hostToken}`)
      .send({
        checkIn: "2025-04-01",
        checkOut: "2025-04-05"
      });

    expect(response.status).toBe(403);
  });

  it("should prevent an unauthorized user from accessing bookings", async () => {
    const response = await request(app).get("/api/bookings");
    expect(response.status).toBe(401);
  });
});
