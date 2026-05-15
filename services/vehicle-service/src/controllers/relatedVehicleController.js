const Vehicle = require("../models/Vehicle");

const buildRelatedScore = (vehicle, currentVehicle) => {
  let score = 0;

  if (currentVehicle.brand && vehicle.brand && vehicle.brand === currentVehicle.brand) {
    score += 3;
  }

  if (currentVehicle.bodyType && vehicle.bodyType && vehicle.bodyType === currentVehicle.bodyType) {
    score += 2;
  }

  if (currentVehicle.price && vehicle.price) {
    const minPrice = currentVehicle.price * 0.75;
    const maxPrice = currentVehicle.price * 1.25;

    if (vehicle.price >= minPrice && vehicle.price <= maxPrice) {
      score += 1;
    }

    const priceGap = Math.abs(vehicle.price - currentVehicle.price);
    score += Math.max(0, 1 - priceGap / currentVehicle.price);
  }

  return score;
};

exports.getRelatedVehicles = async (req, res) => {
  try {
    const { id } = req.params;

    const currentVehicle = await Vehicle.findById(id).lean();

    if (!currentVehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const query = {
      _id: { $ne: currentVehicle._id },
      status: "active",
    };

    const orConditions = [];

    if (currentVehicle.brand) {
      orConditions.push({ brand: currentVehicle.brand });
    }

    if (currentVehicle.bodyType) {
      orConditions.push({ bodyType: currentVehicle.bodyType });
    }

    if (currentVehicle.price) {
      orConditions.push({
        price: {
          $gte: currentVehicle.price * 0.75,
          $lte: currentVehicle.price * 1.25,
        },
      });
    }

    if (orConditions.length) {
      query.$or = orConditions;
    }

    const candidates = await Vehicle.find(query)
      .select("title price year transmission fuelType bodyType brand model images status createdAt")
      .lean();

    const sorted = candidates
      .map((vehicle) => ({
        ...vehicle,
        similarityScore: buildRelatedScore(vehicle, currentVehicle),
      }))
      .sort((left, right) => {
        if (right.similarityScore !== left.similarityScore) {
          return right.similarityScore - left.similarityScore;
        }

        return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
      })
      .slice(0, 8)
      .map(({ similarityScore, ...vehicle }) => vehicle);

    res.json(sorted);
  } catch (error) {
    console.error("RELATED VEHICLES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch related vehicles" });
  }
};