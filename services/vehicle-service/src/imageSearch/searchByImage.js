const Vehicle = require("../models/Vehicle");
const cosineSimilarity = require("./cosineSimilarity");
const {
  calculateBrandMatch,
  calculateBodyTypeMatch,
  calculateWeightedScore,
  normalizeScoreToPercentage,
  getMatchCategory,
} = require("./weightedScoring");
const {
  generateMatchExplanation,
  generateIntelligentFeatures,
} = require("./explanationGenerator");

const normalizeKey = (value) =>
  (value || "")
    .toString()
    .toLowerCase()
    .replace(/[-\s]/g, "")
    .replace(/[^a-z0-9]/g, "");

const CATEGORY_GROUPS = {
  hatchback: ["hatchback", "liftback", "compact", "subcompact"],
  suv: ["suv", "crossover", "cuv"],
  sedan: ["sedan", "saloon", "notchback"],
  wagon: ["wagon", "estate", "shootingbrake", "mpv", "minivan", "van"],
  pickup: ["pickup", "truck"],
  coupe: ["coupe", "roadster", "convertible"],
};

const CATEGORY_KEYWORDS = [
  ["pickup", "pickup"],
  ["hilux", "pickup"],
  ["truck", "pickup"],
  ["wagon", "wagon"],
  ["fielder", "wagon"],
  ["probox", "wagon"],
  ["van", "wagon"],
  ["mpv", "wagon"],
  ["minivan", "wagon"],
  ["suv", "suv"],
  ["crossover", "suv"],
  ["cuv", "suv"],
  ["vezel", "suv"],
  ["chr", "suv"],
  ["raize", "suv"],
  ["urbancruiser", "suv"],
  ["harrier", "suv"],
  ["safari", "suv"],
  ["magnite", "suv"],
  ["hatchback", "hatchback"],
  ["liftback", "hatchback"],
  ["aqua", "hatchback"],
  ["vitz", "hatchback"],
  ["priusc", "hatchback"],
  ["fit", "hatchback"],
  ["alto", "hatchback"],
  ["dayz", "hatchback"],
  ["demio", "hatchback"],
  ["yaris", "hatchback"],
  ["civic", "sedan"],
  ["axio", "sedan"],
  ["sedan", "sedan"],
];

const inferCategoryFromText = (text) => {
  const normalized = normalizeKey(text);
  if (!normalized) return null;

  for (const [keyword, category] of CATEGORY_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return category;
    }
  }

  return null;
};

const getVehicleCategory = (vehicle) =>
  inferCategoryFromText(`${vehicle?.title || ""} ${vehicle?.model || ""} ${vehicle?.bodyType || ""}`) ||
  inferCategoryFromText(vehicle?.bodyType) ||
  "unknown";

const getDetectedCategory = (detected) =>
  inferCategoryFromText(`${detected?.model || ""} ${detected?.type || ""} ${detected?.description || ""}`) ||
  inferCategoryFromText(detected?.type) ||
  "unknown";

const categoriesCompatible = (detectedCategory, vehicleCategory) => {
  if (!detectedCategory || !vehicleCategory || detectedCategory === "unknown" || vehicleCategory === "unknown") {
    return true;
  }

  const detectedGroup = Object.entries(CATEGORY_GROUPS).find(([, values]) => values.includes(detectedCategory));
  const vehicleGroup = Object.entries(CATEGORY_GROUPS).find(([, values]) => values.includes(vehicleCategory));

  if (detectedGroup && vehicleGroup) {
    return detectedGroup[0] === vehicleGroup[0];
  }

  return detectedCategory === vehicleCategory;
};

const isRelatedKey = (left, right) => {
  if (!left || !right) {
    return false;
  }

  return left === right || left.includes(right) || right.includes(left);
};


const parseArgs = (arg2, arg3, arg4) => {
  if (arg2 && typeof arg2 === "object" && !Array.isArray(arg2)) {
    return {
      detected: arg2,
      queryViewType: arg3 ?? "unknown",
      queryIsExterior: arg4 ?? true,
    };
  }

  return {
    detected: arg4 ?? {},
    queryViewType: arg2 ?? "unknown",
    queryIsExterior: arg3 ?? true,
  };
};


const searchVehiclesByImage = async (
  queryFeatureVector,
  arg2,
  arg3,
  arg4
) => {
  if (!Array.isArray(queryFeatureVector) || queryFeatureVector.length === 0) {
    throw new Error("No feature vector");
  }

  const { detected, queryViewType, queryIsExterior } = parseArgs(
    arg2,
    arg3,
    arg4
  );

  const vehicles = await Vehicle.find({ status: "active" });
  const candidates = [];

  const inventoryBrands = new Set(
    vehicles.map((vehicle) => normalizeKey(vehicle.brand)).filter(Boolean)
  );
  const detectedBrandKey = normalizeKey(detected?.brand);
  const detectedModelKey = normalizeKey(detected?.model);
  const detectedCategory = getDetectedCategory(detected);
  const brandExistsInInventory = detectedBrandKey
    ? inventoryBrands.has(detectedBrandKey)
    : false;

  const candidateVehicles = vehicles.filter((vehicle) => {
    const vehicleBrandKey = normalizeKey(vehicle.brand);
    const vehicleModelKey = normalizeKey(vehicle.model || vehicle.title);
    const vehicleCategory = getVehicleCategory(vehicle);
    const hasBrand = detectedBrandKey ? vehicleBrandKey === detectedBrandKey : true;
    const hasRelatedModel = detectedModelKey
      ? vehicleModelKey === detectedModelKey || vehicleModelKey.includes(detectedModelKey) || detectedModelKey.includes(vehicleModelKey)
      : false;
    const sameCategory = categoriesCompatible(detectedCategory, vehicleCategory);

    if (detectedBrandKey && detectedModelKey) {
      return hasBrand || hasRelatedModel || sameCategory;
    }

    if (detectedBrandKey) {
      return hasBrand || sameCategory;
    }

    return sameCategory || hasRelatedModel;
  });

  for (const vehicle of candidateVehicles) {
    if (!Array.isArray(vehicle.images) || vehicle.images.length === 0) {
      continue;
    }

    const vehicleBrandKey = normalizeKey(vehicle.brand);
    const vehicleModelKey = normalizeKey(vehicle.model || vehicle.title);
    const vehicleCategory = getVehicleCategory(vehicle);

    const strictBrandMatch =
      detectedBrandKey && vehicleBrandKey && detectedBrandKey === vehicleBrandKey
        ? 1
        : 0;
    const brandMatch = brandExistsInInventory
      ? Math.max(
          calculateBrandMatch(detected?.brand, vehicle.brand),
          strictBrandMatch
        )
      : 0;
    const bodyTypeMatch = categoriesCompatible(detectedCategory, vehicleCategory)
      ? Math.max(0.6, calculateBodyTypeMatch(detected?.type, vehicle.bodyType))
      : calculateBodyTypeMatch(detected?.type, vehicle.bodyType);
    const modelMatch = isRelatedKey(detectedModelKey, vehicleModelKey) ? 1 : 0;

    let bestScore = -1;
    let bestImage = null;
    let bestImageViewType = null;
    let bestVisualSimilarity = 0;

    for (const image of vehicle.images) {
      if (!Array.isArray(image.embedding)) {
        continue;
      }

      if (image.embedding.length !== queryFeatureVector.length) {
        continue;
      }

      // Calculate visual similarity using cosine similarity
      const visualSimilarity = cosineSimilarity(
        queryFeatureVector,
        image.embedding
      );

      // Calculate final weighted score
      // Formula: visualSimilarity * 0.65 + brandMatch * 0.20 + bodyTypeMatch * 0.15
      const finalScore = calculateWeightedScore(
        visualSimilarity,
        brandMatch,
        bodyTypeMatch,
        modelMatch
      );

      // Keep track of best image for this vehicle
      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestImage = image.url;
        bestImageViewType = image.viewType || "unknown";
        bestVisualSimilarity = visualSimilarity;
      }
    }

    if (bestImage) {
      // Normalize score to realistic percentage
      const matchPercentage = normalizeScoreToPercentage(bestScore);

      // Get match category
      const matchLabel = getMatchCategory(bestScore);

      // Generate intelligent explanation
      const matchReason = generateMatchExplanation(
        vehicle,
        detected,
        bestScore,
        matchLabel
      );

      // Generate intelligent matched features
      const matchedFeatures = generateIntelligentFeatures(
        detected,
        vehicle,
        bestScore,
        matchLabel
      );

      candidates.push({
        _id: vehicle._id,
        title: vehicle.title,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        bodyType: vehicle.bodyType,
        trustLevel: vehicle.trustLevel,
        autoTrustGrade: vehicle.autoTrustGrade,
        similarityScore: Number(bestScore.toFixed(4)),
        matchedImage: bestImage,
        matchPercentage,
        matchLabel,
        matchReason,
        matchedFeatures,
        __brandMatch: brandMatch,
        __bodyTypeMatch: bodyTypeMatch,
        __modelMatch: modelMatch,
        __visualSimilarity: Number(bestVisualSimilarity.toFixed(4)),
      });
    }
  }

  // Rank candidates with requirement-first scoring: exact brand+model first, then same-brand / same-body-type, then visual fallback.
  const rankedCandidates = candidates.sort((a, b) => {
    const scoreA =
      (a.__brandMatch > 0 ? 2.5 : 0) +
      (a.__modelMatch > 0 ? 3 : 0) +
      a.__bodyTypeMatch * 1.2 +
      a.__visualSimilarity * 0.8;
    const scoreB =
      (b.__brandMatch > 0 ? 2.5 : 0) +
      (b.__modelMatch > 0 ? 3 : 0) +
      b.__bodyTypeMatch * 1.2 +
      b.__visualSimilarity * 0.8;
    return scoreB - scoreA;
  });

  const MIN_CONFIDENCE_SCORE = 0.3;
  const MIN_FALLBACK_SCORE = 0.7;
  const MIN_RESULTS = 3;
  const selected = [];
  const selectedIds = new Set();
  const selectedModelKeys = new Set();

  const addIfNew = (item, enforceModelDiversity = true) => {
    const key = String(item._id);
    const modelKey = normalizeKey(item.model || item.title);

    if (selectedIds.has(key)) {
      return;
    }

    if (enforceModelDiversity && modelKey && selectedModelKeys.has(modelKey)) {
      return;
    }

    selected.push(item);
    selectedIds.add(key);
    if (modelKey) {
      selectedModelKeys.add(modelKey);
    }
  };

  // 0) Exact brand + model matches first when available.
  if (detectedBrandKey || detectedModelKey) {
    const exactMatches = rankedCandidates.filter((item) => {
      const sameBrand = detectedBrandKey
        ? normalizeKey(item.brand) === detectedBrandKey
        : false;
      const sameModel = detectedModelKey
        ? isRelatedKey(detectedModelKey, normalizeKey(item.model || item.title))
        : false;

      return sameBrand && sameModel;
    });

    for (const item of exactMatches) {
      if (selected.length >= MIN_RESULTS) {
        break;
      }
      addIfNew(item, false);
    }
  }

  // 1) Keep same-brand, same-body-type, and strong visual matches next.
  for (const item of rankedCandidates) {
    if (selected.length >= MIN_RESULTS) {
      break;
    }
    const isStrongSameBrand =
      detectedBrandKey && normalizeKey(item.brand) === detectedBrandKey;
    const isStrongSameType =
      detectedCategory !== "unknown" && categoriesCompatible(detectedCategory, getVehicleCategory(item));
    if (
      item.__modelMatch > 0 ||
      isStrongSameBrand ||
      isStrongSameType ||
      item.similarityScore >= MIN_CONFIDENCE_SCORE
    ) {
      addIfNew(item);
    }
  }

  // 2) If fewer than 3, fill with best fallback matches (same body type or decent visual score).
  if (selected.length < MIN_RESULTS) {
    for (const item of rankedCandidates) {
      if (selected.length >= MIN_RESULTS) {
        break;
      }

      if (
        item.similarityScore >= MIN_FALLBACK_SCORE ||
        item.__bodyTypeMatch >= 0.8 ||
        item.__visualSimilarity >= MIN_FALLBACK_SCORE
      ) {
        addIfNew(item);
      }
    }
  }

  // 3) Last safety fallback: always return top ranked matches if inventory exists.
  if (selected.length === 0 && rankedCandidates.length > 0) {
    for (const item of rankedCandidates.slice(0, MIN_RESULTS)) {
      addIfNew(item, false);
    }
  }

  return selected
    .slice(0, 10)
    .map(({ __brandMatch, __bodyTypeMatch, __modelMatch, __visualSimilarity, ...cleaned }) => ({
      ...cleaned,
      brandMatch: !!__brandMatch,
      modelMatch: !!__modelMatch,
      bodyTypeMatch: typeof __bodyTypeMatch === "number" ? Number(__bodyTypeMatch.toFixed(3)) : __bodyTypeMatch,
      visualSimilarity: typeof __visualSimilarity === "number" ? Number(__visualSimilarity.toFixed(4)) : __visualSimilarity,
    }));
};

module.exports = searchVehiclesByImage;