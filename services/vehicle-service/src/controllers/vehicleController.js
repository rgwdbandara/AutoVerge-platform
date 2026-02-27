const Vehicle = require("../models/Vehicle");

exports.createListing = async (req, res) => {
  try {
    const sellerClerkId = req.user.sub; // from Clerk token

    const vehicle = await Vehicle.create({
      ...req.body,
      sellerClerkId,
    });

    res.status(201).json(vehicle);

  } catch (error) {
    res.status(500).json({ message: "Failed to create listing" });
  }
};