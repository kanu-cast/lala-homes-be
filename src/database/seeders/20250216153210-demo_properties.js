"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("properties", [
      {
        id: "3f2b1d7a-9c44-4c8f-9b68-6e5b7e2a3a12",
        title: "Cozy Apartment in Kigali",
        description: "A beautiful 2-bedroom apartment with a great city view.",
        price: 75000.0,
        currency: "RWF",
        category: "villa",
        location: "Kigali, Rwanda",
        imageUrl:
          "https://coralhomes.com.au/wp-content/uploads/Atlanta-Series-1190x680.png",
        hostId: "f1c3a8d5-6e42-49b9-b7a3-12e8d76c4e5a", // Assuming John Doe is a host
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "8a67d9e3-4b22-41e0-97f1-d8a9c1b5f8d3",
        title: "Luxury Villa with Pool",
        description:
          "Enjoy a luxurious stay in this 4-bedroom villa with a pool.",
        price: 20000.0,
        currency: "RWF",
        category: "townhouse",
        location: "Nairobi, Kenya",
        imageUrl:
          "https://www.livehome3d.com/assets/img/social/how-to-design-a-house.jpg",
        hostId: "f1c3a8d5-6e42-49b9-b7a3-12e8d76c4e5a", // Hosted by John Doe
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("properties", null, {});
  }
};
