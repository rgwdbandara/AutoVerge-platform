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
  let gradeReason = "";

  if (percentage >= 85) {
    grade = "A";
    trustLevel = "High";
    gradeReason = "Excellent listing with complete details, strong visual evidence, and stable information.";
  } else if (percentage >= 70) {
    grade = "B";
    trustLevel = "Medium";
    gradeReason = "Good listing with mostly complete details and adequate visual evidence.";
  } else if (percentage >= 50) {
    grade = "C";
    trustLevel = "Low";
    gradeReason = "Fair listing but missing some important details or visual evidence.";
  } else {
    grade = "D";
    trustLevel = "Low";
    gradeReason = "Poor listing with insufficient details or incomplete information.";
  }

  // grade cap rules
  if (!vehicleData.year || !vehicleData.mileage || !vehicleData.price) {
    grade = "D";
    trustLevel = "Low";
    gradeReason = "Essential vehicle information is missing (year, mileage, or price).";
  }

  if (!vehicleData.brand || !vehicleData.model) {
    if (grade === "A") grade = "C";
    if (grade === "B") grade = "C";
    trustLevel = "Low";
    gradeReason = "Vehicle brand or model information is missing.";
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
    gradeReason = "Limited visual evidence - at least 2 images with different angles recommended.";
  }

  if (completeness.level === "Weak") {
    grade = "D";
    trustLevel = "Low";
    gradeReason = completeness.reason;
  }

  // Build detailed reason from failed checks
  const failedChecks = [];
  if (completeness.level === "Weak") failedChecks.push(completeness.reason);
  if (visual.level === "Weak") failedChecks.push(visual.reason);
  if (usage.level === "Weak") failedChecks.push(usage.reason);
  if (maintenance.level === "Weak") failedChecks.push(maintenance.reason);
  if (stability.level === "Weak") failedChecks.push(stability.reason);

  if (failedChecks.length > 0 && grade === "D") {
    gradeReason = failedChecks.join(". ") + ".";
  }

  return {
    grade,
    trustLevel,
    gradeReason,
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