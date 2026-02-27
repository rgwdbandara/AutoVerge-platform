exports.markAsSold = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (vehicle.sellerClerkId !== req.user.sub) {
      return res.status(403).json({ message: "Not authorized" });
    }

    vehicle.status = "sold";
    await vehicle.save();

    res.json(vehicle);

  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};
exports.deleteListing = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (vehicle.sellerClerkId !== req.user.sub) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await vehicle.deleteOne();

    res.json({ message: "Listing deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete listing" });
  }
};
exports.updateListing = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Ownership check
    if (vehicle.sellerClerkId !== req.user.sub) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedVehicle);

  } catch (error) {
    res.status(500).json({ message: "Failed to update listing" });
  }
};
exports.getMyListings = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      sellerClerkId: req.user.sub,
    }).sort({ createdAt: -1 });

    res.json(vehicles);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your listings" });
  }
};
exports.getSingleListing = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(vehicle);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch listing" });
  }
};
exports.getAllListings = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: "active" })
      .sort({ createdAt: -1 });

    res.json(vehicles);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};
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