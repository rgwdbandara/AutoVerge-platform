/**
 * Weighted Scoring System for Image-Based Vehicle Recommendations
 * 
 * Scoring Formula:
 * finalScore = (visualSimilarity * 0.50) + (brandMatch * 0.20) + (bodyTypeMatch * 0.15) + (modelMatch * 0.15)
 * 
 * This ensures balanced recommendations that consider:
 * - Visual similarity (primary factor)
 * - Brand matching (important secondary factor)
 * - Body type matching (tertiary factor)
 */

const normalize = (str) =>
  (str || "")
    .toString()
    .toLowerCase()
    .replace(/[-\s]/g, "")
    .replace(/[^a-z0-9]/g, "");

const brandAliases = {
  mercedes: "mercedesbenz",
  mercedesbenz: "mercedesbenz",
  benz: "mercedesbenz",
};

const normalizeBrand = (brand) => {
  const clean = normalize(brand);
  return brandAliases[clean] || clean;
};

/**
 * Calculate brand match score (0 to 1)
 * Returns 1.0 for exact match, 0.0 for no match
 */
const calculateBrandMatch = (detectedBrand, vehicleBrand) => {
  if (!detectedBrand || !vehicleBrand) return 0;

  const dbBrand = normalizeBrand(vehicleBrand);
  const gptBrand = normalizeBrand(detectedBrand);

  if (!dbBrand || !gptBrand) return 0;

  // Exact match
  if (dbBrand === gptBrand) return 1.0;

  // Partial match (one contains the other)
  if (dbBrand.includes(gptBrand) || gptBrand.includes(dbBrand)) {
    return 0.85;
  }

  return 0;
};

/**
 * Calculate body type match score (0 to 1)
 * Returns 1.0 for exact match, 0.75 for similar types, 0.0 for no match
 */
const calculateBodyTypeMatch = (detectedType, vehicleBodyType) => {
  if (!detectedType || !vehicleBodyType) return 0;

  const detected = normalize(detectedType);
  const bodyType = normalize(vehicleBodyType);

  if (!detected || !bodyType) return 0;

  // Exact match
  if (detected === bodyType) return 1.0;

  // Partial match (one contains the other)
  if (detected.includes(bodyType) || bodyType.includes(detected)) {
    return 0.8;
  }

  // Similar body types
  const sedanVariants = ["sedan", "coupe"];
  const wagonVariants = ["wagon", "estate", "van"];
  const hatchbackVariants = ["hatchback", "compact"];
  const suvVariants = ["suv", "crossover", "cuv"];
  const truckVariants = ["truck", "pickup"];

  const detectedGroup = [
    sedanVariants,
    wagonVariants,
    hatchbackVariants,
    suvVariants,
    truckVariants,
  ].find((group) =>
    group.some(
      (variant) =>
        detected.includes(variant) || variant.includes(detected)
    )
  );

  const vehicleGroup = [
    sedanVariants,
    wagonVariants,
    hatchbackVariants,
    suvVariants,
    truckVariants,
  ].find((group) =>
    group.some(
      (variant) =>
        bodyType.includes(variant) || variant.includes(bodyType)
    )
  );

  // Same body type family gets partial credit
  if (detectedGroup && detectedGroup === vehicleGroup) {
    return 0.6;
  }

  return 0;
};

const calculateModelMatch = (detectedModel, vehicleModel, detectedBrand, vehicleBrand) => {
  if (!detectedModel || !vehicleModel) return 0;

  const detected = normalize(detectedModel);
  const vehicle = normalize(vehicleModel);

  if (!detected || !vehicle) return 0;

  if (detected === vehicle) return 1.0;

  if (detected.includes(vehicle) || vehicle.includes(detected)) {
    return 0.9;
  }

  const detectedTokens = detected.match(/[a-z]+|\d+/g) || [];
  const vehicleTokens = vehicle.match(/[a-z]+|\d+/g) || [];
  const sharedTokens = detectedTokens.filter((token) => vehicleTokens.includes(token));

  if (sharedTokens.length > 0) {
    return 0.75;
  }

  const sameBrand = normalizeBrand(detectedBrand) && normalizeBrand(vehicleBrand) && normalizeBrand(detectedBrand) === normalizeBrand(vehicleBrand);
  const familyRules = [
    ["corolla", ["corolla", "axio", "premio", "allion", "corollahybrid"]],
    ["civic", ["civic", "civictype", "civichybrid"]],
    ["vezel", ["vezel", "hrv", "hr-v"]],
    ["prius", ["prius", "priusc", "priusalpha", "aqua"]],
    ["yaris", ["yaris", "vitz"]],
    ["fit", ["fit", "jazz"]],
    ["demio", ["demio", "mazda2"]],
  ];
  const hatchbackHints = ["aqua", "vitz", "priusc", "fit", "demio", "alto", "dayz", "yaris"];
  const hybridHints = ["hybrid", "hev", "ehev", "phev"];

  for (const [, familyKeywords] of familyRules) {
    const detectedInFamily = familyKeywords.some((hint) => detected.includes(hint));
    const vehicleInFamily = familyKeywords.some((hint) => vehicle.includes(hint));

    if (sameBrand && detectedInFamily && vehicleInFamily) {
      return 0.95;
    }
  }

  if (
    sameBrand &&
    (hatchbackHints.some((hint) => detected.includes(hint) || vehicle.includes(hint)) ||
      hybridHints.some((hint) => detected.includes(hint) || vehicle.includes(hint)))
  ) {
    return 0.75;
  }

  return 0;
};

/**
 * Calculate final weighted score
 * Weights: Visual (65%) + Brand (20%) + BodyType (15%)
 */
const calculateWeightedScore = (
  visualSimilarity,
  brandMatch,
  bodyTypeMatch,
  modelMatch = 0
) => {
  const weights = {
    visual: 0.5,
    brand: 0.20,
    bodyType: 0.15,
    model: 0.15,
  };

  return (
    visualSimilarity * weights.visual +
    brandMatch * weights.brand +
    bodyTypeMatch * weights.bodyType +
    modelMatch * weights.model
  );
};

/**
 * Normalize raw score to display percentage
 * Prevents multiple 100% matches by using realistic scaling
 * 
 * Score ranges:
 * 0.95+ → 97-98% (Exact Match)
 * 0.85-0.94 → 88-96% (Similar Match)
 * 0.75-0.84 → 81-87% (Related Match)
 * Below → Proportional
 */
const normalizeScoreToPercentage = (score) => {
  const capped = Math.max(0, Math.min(100, score));

  if (capped >= 95) return 95;
  if (capped >= 85) return Math.round(85 + (capped - 85) * 0.8);
  if (capped >= 70) return Math.round(70 + (capped - 70) * 0.7);
  if (capped >= 40) return Math.round(capped);

  return Math.round(Math.min(30, Math.max(5, capped)));
};

/**
 * Determine match category based on final score
 */
const getMatchCategory = (score) => {
  if (score >= 90) return "Exact Match";
  if (score >= 80) return "Similar Match";
  if (score >= 65) return "Related Match";
  if (score >= 40) return "Partial Match";
  return "Low Match";
};

module.exports = {
  calculateBrandMatch,
  calculateBodyTypeMatch,
  calculateModelMatch,
  calculateWeightedScore,
  normalizeScoreToPercentage,
  getMatchCategory,
};
