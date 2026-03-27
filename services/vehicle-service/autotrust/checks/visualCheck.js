const visualCheck = (vehicleData) => {
  const images = vehicleData.images || [];

  if (images.length >= 4) {
    return {
      level: "Strong",
      score: 3,
      reason: "Good image coverage provided",
    };
  }

  if (images.length >= 2) {
    return {
      level: "Moderate",
      score: 2,
      reason: "Partial image coverage provided",
    };
  }

  return {
    level: "Weak",
    score: 1,
    reason: "Limited image evidence provided",
  };
};

module.exports = visualCheck;