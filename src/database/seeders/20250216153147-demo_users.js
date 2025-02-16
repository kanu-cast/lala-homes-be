"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Users", [
      {
        id: "f1c3a8d5-6e42-49b9-b7a3-12e8d76c4e5a",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "$2b$10$hashedpasswordhere", // bcrypt hashed password
        role: "host",
        googleId: null,
        avatar: "https://example.com/avatar.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "b7d5a93c-2f14-4c89-bc97-efa3d42e671b",
        firstName: "Jane",
        lastName: "Smith",
        email: "janesmith@example.com",
        password: null, // Google login user
        role: "renter",
        googleId: "google-user-id",
        avatar: "https://example.com/avatar2.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
