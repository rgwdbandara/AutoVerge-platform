const stabilityCheck = (vehicleData, oldVehicle) => {
  if (!oldVehicle) {
    return {
      level: "Moderate",
      score: 2,
      reason: "New listing submitted",
    };
  }

  let changes = 0;

  if (vehicleData.price !== oldVehicle.price) changes++;
  if (vehicleData.mileage !== oldVehicle.mileage) changes++;
  if (
    JSON.stringify(vehicleData.images || []) !==
    JSON.stringify(oldVehicle.images || [])
  ) {
    changes++;
  }

  if (changes === 0) {
    return {
      level: "Strong",
      score: 3,
      reason: "Listing details remain stable",
    };
  }

  if (changes === 1) {
    return {
      level: "Moderate",
      score: 2,
      reason: "Minor updates detected in listing",
    };
  }

  return {
    level: "Weak",
    score: 1,
    reason: "Frequent changes detected in listing",
  };
};

module.exports = stabilityCheck;