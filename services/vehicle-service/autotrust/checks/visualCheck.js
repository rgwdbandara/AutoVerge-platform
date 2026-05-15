const visualCheck = (vehicleData) => {
  const images = (vehicleData.images || []).filter(
    (img) => img && img.url && img.url.trim() !== ""
  );

  const tags = images.map((img) => img.tag);

  const hasFront = tags.includes("front");
  const hasRear = tags.includes("rear");
  const hasSide = tags.includes("side");
  const hasInterior = tags.includes("interior");

  const coverageCount = [hasFront, hasRear, hasSide, hasInterior].filter(Boolean).length;

  if (images.length >= 4 && coverageCount >= 4) {
    return {
      level: "Strong",
      score: 3,
      reason: "Complete visual coverage provided",
    };
  }

  if (images.length >= 2 && coverageCount >= 2) {
    return {
      level: "Moderate",
      score: 2,
      reason: "Partial visual coverage provided",
    };
  }

  return {
    level: "Weak",
    score: 1,
    reason: "Limited visual evidence provided",
  };
};

module.exports = visualCheck;