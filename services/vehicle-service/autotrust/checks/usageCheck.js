const fs = require("fs");
const path = require("path");
const { isBrandNewCondition } = require("../utils/vehicleCondition");

const usageCheck = async (vehicleData) => {
  const year = parseInt(vehicleData.year);
  const mileage = parseInt(vehicleData.mileage);
  const brandNew = isBrandNewCondition(vehicleData.condition);

  if (!year) {
    return {
      level: "Weak",
      score: 1,
      reason: "Year is missing",
    };
  }

  if (brandNew) {
    return {
      level: "Strong",
      score: 3,
      reason: "Brand new vehicle does not require used-car mileage comparison",
    };
  }

  if (!mileage) {
    return {
      level: "Weak",
      score: 1,
      reason: "Mileage is required for used vehicles",
    };
  }

  const filePath = path.join(__dirname, "../dataset/used_cars_dataset.csv");
  const file = fs.readFileSync(filePath, "utf-8");
  const rows = file.split("\n").slice(1);

  let totalMileage = 0;
  let count = 0;

  rows.forEach((row) => {
    const cols = row.split(",");

    const rowYear = parseInt(cols[9]);
    const rowMileage = parseInt(cols[6]);

    if (!isNaN(rowYear) && !isNaN(rowMileage)) {
      if (Math.abs(rowYear - year) <= 1) {
        totalMileage += rowMileage;
        count++;
      }
    }
  });

  if (count === 0) {
    return {
      level: "Weak",
      score: 1,
      reason: "Insufficient market data for usage comparison",
    };
  }

  const avgMileage = totalMileage / count;

  if (mileage < avgMileage * 0.6 || mileage > avgMileage * 1.4) {
    return {
      level: "Weak",
      score: 1,
      reason: "Mileage appears unusual for vehicle age",
    };
  }

  if (mileage < avgMileage * 0.8 || mileage > avgMileage * 1.2) {
    return {
      level: "Moderate",
      score: 2,
      reason: "Mileage is slightly outside the typical range",
    };
  }

  return {
    level: "Strong",
    score: 3,
    reason: "Mileage is consistent with vehicle age",
  };
};

module.exports = usageCheck;