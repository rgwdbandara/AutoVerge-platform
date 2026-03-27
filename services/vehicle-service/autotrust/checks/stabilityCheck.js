const stabilityCheck = (vehicleData, oldVehicle) => {
  // new listing (no previous data)
  if (!oldVehicle) {
    return {
      level: "Strong",
      score: 3,
      reason: "New listing with no changes",
    };
  }

  let changes = 0;

  // check price change
  if (vehicleData.price !== oldVehicle.price) {
    changes++;
  }

  // check images change
  if (
    JSON.stringify(vehicleData.images) !==
    JSON.stringify(oldVehicle.images)
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