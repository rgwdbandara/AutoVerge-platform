const visualCheck = require("./checks/visualCheck");
const usageCheck = require("./checks/usageCheck");
const maintenanceCheck = require("./checks/maintenanceCheck");
const stabilityCheck = require("./checks/stabilityCheck");

const evaluateAutoTrust = async (vehicleData, oldVehicle = null) => {
  const visual = visualCheck(vehicleData);
  const usage = await usageCheck(vehicleData);
  const maintenance = maintenanceCheck(vehicleData);
  const stability = stabilityCheck(vehicleData, oldVehicle);

  const totalScore =
    visual.score +
    usage.score +
    maintenance.score +
    stability.score;

  // Max score = 12
  let grade = "D";
  let trustLevel = "Low";

  if (totalScore >= 10) {
    grade = "A";
    trustLevel = "High";
  } else if (totalScore >= 7) {
    grade = "B";
    trustLevel = "Medium";
  } else if (totalScore >= 5) {
    grade = "C";
    trustLevel = "Low";
  }

  return {
    score: totalScore,
    grade,
    trustLevel,
    checks: {
      visual,
      usage,
      maintenance,
      stability,
    },
  };
};

module.exports = evaluateAutoTrust;