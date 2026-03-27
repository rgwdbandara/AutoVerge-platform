const Vehicle = require("../models/Vehicle");
const evaluateAutoTrust = require("../../autotrust");

exports.markAsSold = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // if (vehicle.sellerClerkId !== req.user.sub) {
    //   return res.status(403).json({ message: "Not authorized" });
    // }

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

    // if (vehicle.sellerClerkId !== req.user.sub) {
    //   return res.status(403).json({ message: "Not authorized" });
    // }

    await vehicle.deleteOne();

    res.json({ message: "Listing deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete listing" });
  }
};
exports.updateListing = async (req, res) => {
  try {
    const oldVehicle = await Vehicle.findById(req.params.id);

    if (!oldVehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const updatedData = {
      ...req.body,
    };

    const autoTrustResult = await evaluateAutoTrust(updatedData, oldVehicle);

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        ...updatedData,
        autoTrustScore: autoTrustResult.score,
        autoTrustGrade: autoTrustResult.grade,
        trustLevel: autoTrustResult.trustLevel,
        autoTrustCheckResults: autoTrustResult.checks,
      },
      { new: true }
    );

    res.json(updatedVehicle);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
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
    console.error("MY LISTINGS ERROR:", error);
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

exports.createListing = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const vehicleData = {
      sellerClerkId: req.user?.sub || "test-seller-001",
      title: req.body.title || `${req.body.brand} ${req.body.model}`,
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      price: req.body.price,
      mileage: req.body.mileage,
      fuelType: req.body.fuelType,
      transmission: req.body.transmission,
      description: req.body.description,
      condition: req.body.condition,
      accidentHistory: req.body.accidentHistory,
      serviceHistory: req.body.serviceHistory,
      images: req.body.images || [],
    };

    const autoTrustResult = await evaluateAutoTrust(vehicleData);

    const vehicle = await Vehicle.create({
      ...vehicleData,
      autoTrustScore: autoTrustResult.score,
      autoTrustGrade: autoTrustResult.grade,
      trustLevel: autoTrustResult.trustLevel,
      autoTrustCheckResults: autoTrustResult.checks,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: "Failed to create listing" });
  }
};