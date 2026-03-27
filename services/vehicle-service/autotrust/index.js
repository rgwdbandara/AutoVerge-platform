const completenessCheck = require("./checks/completenessCheck");
const visualCheck = require("./checks/visualCheck");
const usageCheck = require("./checks/usageCheck");
const maintenanceCheck = require("./checks/maintenanceCheck");
const stabilityCheck = require("./checks/stabilityCheck");

const evaluateAutoTrust = async (vehicleData, oldVehicle = null) => {
  const completeness = completenessCheck(vehicleData);
  const visual = visualCheck(vehicleData);
  const usage = await usageCheck(vehicleData);
  const maintenance = maintenanceCheck(vehicleData);
  const stability = stabilityCheck(vehicleData, oldVehicle);

  // weighted scoring (real-world style)
  const totalScore =
    completeness.score * 4 +
    visual.score * 5 +
    usage.score * 5 +
    maintenance.score * 3 +
    stability.score * 3;

  // convert to percentage
  const maxScore = 60;
  const percentage = Math.round((totalScore / maxScore) * 100);

  let grade = "D";
  let trustLevel = "Low";

  if (percentage >= 85) {
    grade = "A";
    trustLevel = "High";
  } else if (percentage >= 70) {
    grade = "B";
    trustLevel = "Medium";
  } else if (percentage >= 50) {
    grade = "C";
    trustLevel = "Low";
  } else {
    grade = "D";
    trustLevel = "Low";
  }

  // grade cap rules
  if (!vehicleData.year || !vehicleData.mileage || !vehicleData.price) {
    grade = "D";
    trustLevel = "Low";
  }

  if (!vehicleData.brand || !vehicleData.model) {
    if (grade === "A") grade = "C";
    if (grade === "B") grade = "C";
    trustLevel = "Low";
  }

  const validImages = (vehicleData.images || []).filter(
    (img) => {
      if (typeof img === "string") {
        return img.trim() !== "";
      }

      return Boolean(img?.url && img.url.trim() !== "");
    }
  );

  if (validImages.length <= 1) {
    if (grade === "A") grade = "C";
    if (grade === "B") grade = "C";
  }

  if (completeness.level === "Weak") {
    grade = "D";
    trustLevel = "Low";
  }

  return {
    grade,
    trustLevel,
    checks: {
      completeness,
      visual,
      usage,
      maintenance,
      stability,
    },
  };
};

module.exports = evaluateAutoTrust;