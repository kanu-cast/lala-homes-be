"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("bookings", [
      {
        id: "e29d14b8-7a46-4352-92c1-48f7e15b9f63",
        propertyId: "3f2b1d7a-9c44-4c8f-9b68-6e5b7e2a3a12", // Refers to "Cozy Apartment in Kigali"
        renterId: "b7d5a93c-2f14-4c89-bc97-efa3d42e671b", // Jane Smith (renter)
        checkIn: "2025-03-01",
        checkOut: "2025-03-07",
        status: "confirmed",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("bookings", null, {});
  }
};
