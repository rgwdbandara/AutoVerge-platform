const completenessCheck = (vehicleData) => {
  let filled = 0;

  if (vehicleData.title && vehicleData.title.trim() !== "") filled++;
  if (vehicleData.brand && vehicleData.brand.trim() !== "") filled++;
  if (vehicleData.model && vehicleData.model.trim() !== "") filled++;
  if (vehicleData.year) filled++;
  if (vehicleData.price) filled++;
  if (vehicleData.mileage) filled++;
  if (vehicleData.description && vehicleData.description.trim() !== "") filled++;
  if (vehicleData.fuelType && vehicleData.fuelType.trim() !== "") filled++;
  if (vehicleData.transmission && vehicleData.transmission.trim() !== "") filled++;

  if (filled >= 8) {
    return {
      level: "Strong",
      score: 3,
      reason: "Listing details are mostly complete",
    };
  }

  if (filled >= 5) {
    return {
      level: "Moderate",
      score: 2,
      reason: "Listing details are partially complete",
    };
  }

  return {
    level: "Weak",
    score: 1,
    reason: "Listing details are incomplete",
  };
};

module.exports = completenessCheck;
