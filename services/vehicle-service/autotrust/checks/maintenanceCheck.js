const maintenanceCheck = (vehicleData) => {
  const serviceHistory = vehicleData.serviceHistory;

  if (serviceHistory === "Full Service History") {
    return {
      level: "Strong",
      score: 3,
      reason: "Full service history provided",
    };
  }

  if (serviceHistory === "Partial Service History") {
    return {
      level: "Moderate",
      score: 2,
      reason: "Partial service history provided",
    };
  }

  return {
    level: "Weak",
    score: 1,
    reason: "No service history provided",
  };
};

module.exports = maintenanceCheck;