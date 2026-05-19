const Vehicle = require("../models/Vehicle");
const cosineSimilarity = require("./cosineSimilarity");
const {
  calculateBrandMatch,
  calculateBodyTypeMatch,
  calculateModelMatch,
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

const normalizeViewType = (value) => {
  const normalized = normalizeKey(value);

  if (!normalized) return "unknown";
  if (normalized.includes("front")) return "front";
  if (normalized.includes("rear") || normalized.includes("back")) return "rear";
  if (normalized.includes("side")) return "side";
  if (normalized.includes("angle") || normalized.includes("threequarter") || normalized.includes("3quarter")) return "angled";
  if (normalized.includes("interior") || normalized.includes("dashboard") || normalized.includes("cabin")) return "interior";
  return "unknown";
};

const normalizeColor = (value) => {
  const normalized = normalizeKey(value);
  if (!normalized) return "";

  const colorFamilies = [
    ["white", ["white", "pearl", "ivory", "cream"]],
    ["black", ["black", "charcoal", "graphite", "onyx"]],
    ["silver", ["silver", "gray", "grey", "slate", "metallic"]],
    ["blue", ["blue", "navy", "azure"]],
    ["red", ["red", "maroon", "burgundy"]],
    ["green", ["green", "olive"]],
    ["brown", ["brown", "beige", "gold", "bronze"]],
    ["yellow", ["yellow", "orange"]],
  ];

  for (const [familyKey, values] of colorFamilies) {
    if (values.some((entry) => normalized.includes(entry))) {
      return familyKey;
    }
  }

  return normalized;
};

const MODEL_FAMILIES = [
  ["corolla", ["corolla", "axio", "premio", "allion", "corollahybrid"]],
  ["civic", ["civic", "civichybrid", "civictype"]],
  ["vezel", ["vezel", "hrv", "hr-v"]],
  ["prius", ["prius", "priusc", "priusalpha", "aqua"]],
  ["yaris", ["yaris", "vitz"]],
  ["fit", ["fit", "jazz"]],
  ["demio", ["demio", "mazda2"]],
  ["wagonr", ["wagonr", "wagon-r", "wagon r"]],
];

const BODY_TYPE_GROUPS = {
  sedan: ["sedan", "saloon", "notchback"],
  hatchback: ["hatchback", "liftback", "compact", "subcompact"],
  suv: ["suv", "crossover", "cuv", "jeep"],
  wagon: ["wagon", "estate", "shootingbrake", "mpv", "minivan", "van"],
  pickup: ["pickup", "truck"],
  coupe: ["coupe", "roadster", "convertible"],
};

const BODY_TYPE_KEYWORDS = [
  ["hilux", "pickup"],
  ["dmax", "pickup"],
  ["ranger", "pickup"],
  ["navara", "pickup"],
  ["wagon", "wagon"],
  ["fielder", "wagon"],
  ["probox", "wagon"],
  ["sienta", "wagon"],
  ["van", "wagon"],
  ["mpv", "wagon"],
  ["minivan", "wagon"],
  ["vezel", "suv"],
  ["hrv", "suv"],
  ["harrier", "suv"],
  ["raize", "suv"],
  ["chr", "suv"],
  ["suv", "suv"],
  ["crossover", "suv"],
  ["cuv", "suv"],
  ["aqua", "hatchback"],
  ["vitz", "hatchback"],
  ["fit", "hatchback"],
  ["yaris", "hatchback"],
  ["priusc", "hatchback"],
  ["alto", "hatchback"],
  ["dayz", "hatchback"],
  ["demio", "hatchback"],
  ["sedan", "sedan"],
  ["axio", "sedan"],
  ["corolla", "sedan"],
  ["civic", "sedan"],
];

const isRelatedKey = (left, right) => {
  if (!left || !right) return false;
  return left === right || left.includes(right) || right.includes(left);
};

const inferCategoryFromText = (text) => {
  const normalized = normalizeKey(text);
  if (!normalized) return null;

  for (const [keyword, category] of BODY_TYPE_KEYWORDS) {
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

  const detectedGroup = Object.entries(BODY_TYPE_GROUPS).find(([, values]) => values.includes(detectedCategory));
  const vehicleGroup = Object.entries(BODY_TYPE_GROUPS).find(([, values]) => values.includes(vehicleCategory));

  if (detectedGroup && vehicleGroup) {
    return detectedGroup[0] === vehicleGroup[0];
  }

  return detectedCategory === vehicleCategory;
};

const getModelFamily = (value) => {
  const normalized = normalizeKey(value);
  if (!normalized) return null;

  for (const [familyKey, aliases] of MODEL_FAMILIES) {
    if (aliases.some((alias) => normalized.includes(normalizeKey(alias)))) {
      return familyKey;
    }
  }

  return null;
};

const isFamilyRelatedModel = (detectedModel, vehicleModel) => {
  const detectedFamily = getModelFamily(detectedModel);
  const vehicleFamily = getModelFamily(vehicleModel);

  if (detectedFamily && vehicleFamily && detectedFamily === vehicleFamily) {
    return true;
  }

  const detected = normalizeKey(detectedModel);
  const vehicle = normalizeKey(vehicleModel);

  if (!detected || !vehicle) return false;
  if (detected === vehicle) return true;
  if (detected.includes(vehicle) || vehicle.includes(detected)) return true;

  return false;
};

const isColorCompatible = (detectedColor, vehicleColor) => {
  const detected = normalizeColor(detectedColor);
  const vehicle = normalizeColor(vehicleColor);

  if (!detected || !vehicle) return true;
  if (detected === vehicle) return true;

  const compatibleFamilies = {
    white: ["white", "pearl", "ivory", "cream"],
    black: ["black", "charcoal", "graphite", "onyx"],
    silver: ["silver", "gray", "grey", "slate", "metallic"],
    blue: ["blue", "navy", "azure"],
    red: ["red", "maroon", "burgundy"],
    green: ["green", "olive"],
    brown: ["brown", "beige", "gold", "bronze"],
    yellow: ["yellow", "orange"],
  };

  return Object.values(compatibleFamilies).some((family) => family.includes(detected) && family.includes(vehicle));
};

const isViewCompatible = (queryViewType, candidateViewType, queryIsExterior, candidateIsExterior) => {
  const query = normalizeViewType(queryViewType);
  const candidate = normalizeViewType(candidateViewType);

  if (query === "unknown" || candidate === "unknown") {
    return true;
  }

  if (queryIsExterior === false && candidateIsExterior === true) {
    return false;
  }

  if (queryIsExterior === true && candidateIsExterior === false && query !== "interior") {
    return false;
  }

  if (query === "interior") {
    return candidate === "interior";
  }

  if (query === candidate) {
    return true;
  }

  const compatible = {
    front: ["front", "angled"],
    rear: ["rear", "angled"],
    side: ["side", "angled"],
    angled: ["front", "rear", "side", "angled"],
  };

  return (compatible[query] || []).includes(candidate);
};

const calculateViewMatch = (queryViewType, candidateViewType, queryIsExterior, candidateIsExterior) => {
  const query = normalizeViewType(queryViewType);
  const candidate = normalizeViewType(candidateViewType);

  if (query === "unknown" || candidate === "unknown") {
    return 0;
  }

  if (!isViewCompatible(query, candidate, queryIsExterior, candidateIsExterior)) {
    return 0;
  }

  if (query === candidate) return 1;
  if (query === "angled" || candidate === "angled") return 0.85;
  if ((query === "front" && candidate === "rear") || (query === "rear" && candidate === "front")) return 0.45;
  return 0.7;
};

const calculateColorMatch = (detectedColor, vehicleColor) => {
  const detected = normalizeColor(detectedColor);
  const vehicle = normalizeColor(vehicleColor);

  if (!detected || !vehicle) return 0;
  if (detected === vehicle) return 1;

  const families = [
    ["white", ["white", "pearl", "ivory", "cream"]],
    ["black", ["black", "charcoal", "graphite", "onyx"]],
    ["silver", ["silver", "gray", "grey", "slate", "metallic"]],
    ["blue", ["blue", "navy", "azure"]],
    ["red", ["red", "maroon", "burgundy"]],
    ["green", ["green", "olive"]],
    ["brown", ["brown", "beige", "gold", "bronze"]],
    ["yellow", ["yellow", "orange"]],
  ];

  return families.some(([, values]) => values.includes(detected) && values.includes(vehicle)) ? 0.8 : 0;
};

const parseArgs = (arg2, arg3, arg4) => {
  if (arg2 && typeof arg2 === "object" && !Array.isArray(arg2)) {
    return {
      detected: arg2,
      queryViewType: normalizeViewType(arg2.viewType || arg2.view_type || arg3 || "unknown"),
      queryIsExterior:
        typeof arg2.isExterior === "boolean" ? arg2.isExterior : arg4 ?? true,
    };
  }

  return {
    detected: arg4 ?? {},
    queryViewType: normalizeViewType(arg2 ?? "unknown"),
    queryIsExterior: arg3 ?? true,
  };
};

const getMatchLabel = (confidence) => {
  if (confidence >= 90) return "Exact Match";
  if (confidence >= 80) return "Similar Match";
  if (confidence >= 65) return "Related Match";
  if (confidence >= 40) return "Partial Match";
  return "Low Match";
};

const buildConfidence = ({ finalScore, exactSemantic, strongSemantic }) => {
  if (exactSemantic) {
    return Math.min(95, Math.max(85, Math.round(finalScore)));
  }

  if (strongSemantic) {
    return Math.min(65, Math.max(40, Math.round(finalScore)));
  }

  return Math.min(30, Math.max(5, Math.round(finalScore * 0.8)));
};

const getBrandStageMatch = ({ vehicleBrandKey, detectedBrandKey, detectedModelKey, vehicleModelKey }) => {
  if (!detectedBrandKey) {
    return true;
  }

  if (vehicleBrandKey === detectedBrandKey) {
    return true;
  }

  if (!detectedModelKey) {
    return false;
  }

  return isFamilyRelatedModel(detectedModelKey, vehicleModelKey);
};

const vehicleMatchesStage = ({ vehicle, image, detected, stage, detectedBrandKey, detectedModelKey, detectedCategory, queryViewType, queryIsExterior, detectedColor }) => {
  const vehicleBrandKey = normalizeKey(vehicle.brand);
  const vehicleModelKey = normalizeKey(vehicle.model || vehicle.title);
  const vehicleCategory = getVehicleCategory(vehicle);
  const vehicleColor = vehicle.color;

  if (stage.bodyMode === "required" && detectedCategory !== "unknown" && !categoriesCompatible(detectedCategory, vehicleCategory)) {
    return { accepted: false, reason: "body-type" };
  }

  if (stage.brandMode === "strict" && detectedBrandKey && vehicleBrandKey !== detectedBrandKey) {
    return { accepted: false, reason: "brand" };
  }

  if (stage.brandMode === "family" && detectedBrandKey) {
    const familyMatches = isFamilyRelatedModel(detected?.model, vehicle.model || vehicle.title);

    if (!getBrandStageMatch({ vehicleBrandKey, detectedBrandKey, detectedModelKey, vehicleModelKey }) && !familyMatches) {
      return { accepted: false, reason: "brand-family" };
    }
  }

  if (stage.colorMode === "strict" && detectedColor && !isColorCompatible(detectedColor, vehicleColor)) {
    return { accepted: false, reason: "color" };
  }

  const imageViewType = normalizeViewType(image.viewType);
  const imageExterior = typeof image.isExterior === "boolean" ? image.isExterior : true;

  if (stage.viewMode === "strict" && queryViewType !== "unknown" && !isViewCompatible(queryViewType, imageViewType, queryIsExterior, imageExterior)) {
    return { accepted: false, reason: "view" };
  }

  return { accepted: true, reason: null, vehicleCategory, vehicleBrandKey, vehicleModelKey };
};

const scoreVehicleImage = ({ queryFeatureVector, detected, queryViewType, queryIsExterior, image, vehicle }) => {
  if (!Array.isArray(image.embedding) || image.embedding.length !== queryFeatureVector.length) {
    return null;
  }

  const visualSimilarity = cosineSimilarity(queryFeatureVector, image.embedding);
  const brandScore = detected?.brand ? calculateBrandMatch(detected.brand, vehicle.brand) : 0;
  const bodyScore = detected?.type ? calculateBodyTypeMatch(detected.type, vehicle.bodyType) : 0;
  const modelScore = detected?.model ? calculateModelMatch(detected.model, vehicle.model || vehicle.title, detected.brand, vehicle.brand) : 0;
  const viewScore = calculateViewMatch(queryViewType, image.viewType, queryIsExterior, typeof image.isExterior === "boolean" ? image.isExterior : true);
  const colorScore = calculateColorMatch(detected?.color, vehicle.color);

  const weightedScore =
    brandScore * 25 +
    bodyScore * 20 +
    modelScore * 15 +
    viewScore * 10 +
    visualSimilarity * 30 +
    colorScore * 5;

  const finalScore = Math.min(100, Math.round(weightedScore));
  const exactSemantic = brandScore >= 0.85 && bodyScore >= 0.8 && modelScore >= 0.75 && viewScore >= 0.7;
  const strongSemantic = brandScore >= 0.85 || bodyScore >= 0.8 || modelScore >= 0.75 || viewScore >= 0.8;
  const confidence = buildConfidence({ finalScore, exactSemantic, strongSemantic });
  const matchLabel = getMatchLabel(confidence);

  return {
    finalScore,
    confidence,
    matchLabel,
    brandScore,
    bodyScore,
    modelScore,
    viewScore,
    colorScore,
    visualSimilarity,
  };
};

const buildSemanticFallbackResult = ({
  vehicle,
  detected,
  selectedStage,
  reason,
  matchType,
}) => {
  const detectedBrandKey = normalizeKey(detected?.brand);
  const detectedModelKey = normalizeKey(detected?.model);
  const vehicleBrandKey = normalizeKey(vehicle.brand);
  const vehicleModelKey = normalizeKey(vehicle.model || vehicle.title);
  const brandExact = detectedBrandKey && vehicleBrandKey === detectedBrandKey;
  const modelExact = detectedModelKey && isRelatedKey(detectedModelKey, vehicleModelKey);
  const familyRelated = detected?.model ? isFamilyRelatedModel(detected.model, vehicle.model || vehicle.title) : false;
  const semanticConfidence = modelExact
    ? 68
    : brandExact
      ? 62
      : familyRelated
        ? 58
        : 45;
  const matchLabel = getMatchLabel(semanticConfidence);

  return {
    _id: vehicle._id,
    title: vehicle.title,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    price: vehicle.price,
    bodyType: vehicle.bodyType,
    trustLevel: vehicle.trustLevel,
    autoTrustGrade: vehicle.autoTrustGrade,
    similarityScore: Number((semanticConfidence / 100).toFixed(4)),
    finalScore: semanticConfidence,
    confidence: semanticConfidence,
    matchedImage: vehicle.images?.[0]?.url || "/no-car.png",
    matchedViewType: vehicle.images?.[0]?.viewType || "unknown",
    matchPercentage: semanticConfidence,
    matchLabel,
    matchType,
    matchReason: `${reason}. Semantic metadata matched without a usable image embedding.`,
    matchedFeatures: generateIntelligentFeatures(detected, vehicle, semanticConfidence / 100, matchLabel),
    brandMatch: brandExact,
    modelMatch: modelExact,
    bodyTypeMatch: 0,
    viewMatch: 0,
    colorMatch: 0,
    visualSimilarity: 0,
    scoreBreakdown: {
      brand: brandExact ? 25 : 0,
      bodyType: 0,
      model: modelExact ? 15 : 0,
      view: 0,
      color: 0,
      cosine: 0,
    },
    semanticStage: selectedStage.name,
    semanticOnly: true,
  };
};

const searchVehiclesByImage = async (queryFeatureVector, arg2, arg3, arg4) => {
  if (!Array.isArray(queryFeatureVector) || queryFeatureVector.length === 0) {
    throw new Error("No feature vector");
  }

  const { detected, queryViewType, queryIsExterior } = parseArgs(arg2, arg3, arg4);
  const detectedBrandKey = normalizeKey(detected?.brand);
  const detectedModelKey = normalizeKey(detected?.model);
  const detectedCategory = getDetectedCategory(detected);
  const detectedColor = normalizeColor(detected?.color);

  const vehicles = await Vehicle.find({ status: "active" }).lean();
  const inventoryBrands = new Set(vehicles.map((vehicle) => normalizeKey(vehicle.brand)).filter(Boolean));
  const brandExistsInInventory = detectedBrandKey ? inventoryBrands.has(detectedBrandKey) : false;

  console.log("IMAGE SEARCH OPENAI METADATA:", {
    brand: detected?.brand || null,
    model: detected?.model || null,
    type: detected?.type || null,
    color: detected?.color || null,
    viewType: queryViewType,
    isExterior: queryIsExterior,
    description: detected?.description || null,
  });
  console.log("IMAGE SEARCH INVENTORY SNAPSHOT:", {
    totalActiveVehicles: vehicles.length,
    detectedBrandInInventory: brandExistsInInventory,
    detectedCategory,
  });

  const brandCandidates = vehicles.filter((vehicle) => {
    const vehicleBrandKey = normalizeKey(vehicle.brand);
    const vehicleModelKey = normalizeKey(vehicle.model || vehicle.title);
    const matchesBrand = getBrandStageMatch({
      vehicleBrandKey,
      detectedBrandKey,
      detectedModelKey,
      vehicleModelKey,
    });

    return matchesBrand;
  });

  const brandRejectedVehicles = vehicles
    .filter((vehicle) => !brandCandidates.some((candidate) => String(candidate._id) === String(vehicle._id)))
    .map((vehicle) => ({
      id: String(vehicle._id),
      title: vehicle.title,
      reason: "brand",
    }));

  const modelCandidates = detectedModelKey
    ? brandCandidates.filter((vehicle) => {
        const vehicleModelKey = normalizeKey(vehicle.model || vehicle.title);
        return isFamilyRelatedModel(detected?.model, vehicle.model || vehicle.title) || isRelatedKey(detectedModelKey, vehicleModelKey);
      })
    : brandCandidates;

  const modelRejectedVehicles = brandCandidates
    .filter((vehicle) => !modelCandidates.some((candidate) => String(candidate._id) === String(vehicle._id)))
    .map((vehicle) => ({
      id: String(vehicle._id),
      title: vehicle.title,
      reason: "model",
    }));

  const selectedVehicles = modelCandidates.length > 0 ? modelCandidates : brandCandidates.length > 0 ? brandCandidates : vehicles;
  const selectedStage = detectedModelKey && modelCandidates.length > 0
    ? { name: "brand->model->final" }
    : brandCandidates.length > 0
      ? { name: "brand->final" }
      : { name: "fallback->final" };

  console.log("IMAGE SEARCH SEMANTIC FILTERING:", {
    totalVehicles: vehicles.length,
    brandCandidates: brandCandidates.length,
    modelCandidates: modelCandidates.length,
    selectedCandidates: selectedVehicles.length,
  });
  console.log("IMAGE SEARCH REJECTED VEHICLES:", [...brandRejectedVehicles, ...modelRejectedVehicles].slice(0, 20));

  const results = [];
  let overallMatchType = "Hybrid Match";
  let overallReason = "Semantic filtering and visual scoring produced ranked matches.";
  let overallConfidence = 0;

  for (const vehicle of selectedVehicles) {
    const images = Array.isArray(vehicle.images) ? vehicle.images : [];
    let bestMatch = null;
    let bestImage = null;
    let hasUsableEmbedding = false;
    let bestCosineScore = 0;
    let bestWeightedScore = 0;
    let candidateRejectedReason = "no usable embedding";

    console.log("IMAGE SEARCH CANDIDATE:", {
      title: vehicle.title,
      imagesCount: images.length,
    });

    for (const image of images) {
      const embeddingExists = Array.isArray(image.embedding);
      const embeddingLength = embeddingExists ? image.embedding.length : 0;

      console.log("IMAGE SEARCH IMAGE CHECK:", {
        title: vehicle.title,
        imageViewType: image.viewType || "unknown",
        hasEmbedding: embeddingExists,
        embeddingLength,
        uploadedVectorLength: queryFeatureVector.length,
      });

      const stageEvaluation = vehicleMatchesStage({
        vehicle,
        image,
        detected,
        stage: {
          brandMode: "none",
          bodyMode: detectedCategory !== "unknown" ? "required" : "none",
          viewMode: queryViewType !== "unknown" ? "strict" : "none",
          colorMode: detectedColor ? "strict" : "none",
        },
        detectedBrandKey,
        detectedModelKey,
        detectedCategory,
        queryViewType,
        queryIsExterior,
        detectedColor,
      });

      if (!stageEvaluation.accepted) {
        candidateRejectedReason = stageEvaluation.reason || "semantic filter";
        console.log("IMAGE SEARCH IMAGE REJECTED:", {
          title: vehicle.title,
          imageViewType: image.viewType || "unknown",
          rejectedReason: candidateRejectedReason,
        });
        continue;
      }

      const scoreBreakdown = scoreVehicleImage({
        queryFeatureVector,
        detected,
        queryViewType,
        queryIsExterior,
        image,
        vehicle,
      });

      if (!scoreBreakdown) {
        candidateRejectedReason = !embeddingExists
          ? "missing embedding"
          : embeddingLength !== queryFeatureVector.length
            ? "embedding length mismatch"
            : "unusable image embedding";
        console.log("IMAGE SEARCH IMAGE REJECTED:", {
          title: vehicle.title,
          imageViewType: image.viewType || "unknown",
          rejectedReason: candidateRejectedReason,
        });
        continue;
      }

      hasUsableEmbedding = true;
      bestCosineScore = Math.max(bestCosineScore, scoreBreakdown.visualSimilarity);
      bestWeightedScore = Math.max(bestWeightedScore, scoreBreakdown.finalScore);

      console.log("IMAGE SEARCH SCORE BREAKDOWN:", {
        vehicleId: String(vehicle._id),
        title: vehicle.title,
        imageViewType: image.viewType || "unknown",
        finalScore: scoreBreakdown.finalScore,
        confidence: scoreBreakdown.confidence,
        brandScore: scoreBreakdown.brandScore,
        bodyScore: scoreBreakdown.bodyScore,
        modelScore: scoreBreakdown.modelScore,
        viewScore: scoreBreakdown.viewScore,
        colorScore: scoreBreakdown.colorScore,
        cosineSimilarity: Number(scoreBreakdown.visualSimilarity.toFixed(4)),
      });

      if (!bestMatch || scoreBreakdown.finalScore > bestMatch.finalScore) {
        bestMatch = scoreBreakdown;
        bestImage = image;
      }
    }

    if (!bestMatch || !bestImage) {
      console.log("IMAGE SEARCH CANDIDATE SUMMARY:", {
        title: vehicle.title,
        imagesCount: images.length,
        hasEmbedding: hasUsableEmbedding,
        embeddingLength: images.find((image) => Array.isArray(image.embedding))?.embedding?.length || 0,
        cosineScore: Number(bestCosineScore.toFixed(4)),
        finalWeightedScore: Number(bestWeightedScore.toFixed(2)),
        rejectedReason: candidateRejectedReason,
      });
      continue;
    }

    const normalizedScore = bestMatch.finalScore / 100;
    const matchReason = generateMatchExplanation(
      vehicle,
      detected,
      normalizedScore,
      bestMatch.matchLabel
    );
    const matchedFeatures = generateIntelligentFeatures(
      detected,
      vehicle,
      normalizedScore,
      bestMatch.matchLabel
    );

    results.push({
      _id: vehicle._id,
      title: vehicle.title,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      bodyType: vehicle.bodyType,
      trustLevel: vehicle.trustLevel,
      autoTrustGrade: vehicle.autoTrustGrade,
      similarityScore: Number(normalizedScore.toFixed(4)),
      finalScore: bestMatch.finalScore,
      confidence: bestMatch.confidence,
      matchedImage: bestImage.url,
      matchedViewType: bestImage.viewType || "unknown",
      matchPercentage: bestMatch.confidence,
      matchLabel: bestMatch.matchLabel,
      matchReason,
      matchedFeatures,
      brandMatch: bestMatch.brandScore >= 0.85,
      modelMatch: bestMatch.modelScore >= 0.75,
      bodyTypeMatch: Number(bestMatch.bodyScore.toFixed(3)),
      viewMatch: Number(bestMatch.viewScore.toFixed(3)),
      colorMatch: Number(bestMatch.colorScore.toFixed(3)),
      visualSimilarity: Number(bestMatch.visualSimilarity.toFixed(4)),
      scoreBreakdown: {
        brand: Number((bestMatch.brandScore * 25).toFixed(2)),
        bodyType: Number((bestMatch.bodyScore * 20).toFixed(2)),
        model: Number((bestMatch.modelScore * 15).toFixed(2)),
        view: Number((bestMatch.viewScore * 10).toFixed(2)),
        color: Number((bestMatch.colorScore * 5).toFixed(2)),
        cosine: Number((bestMatch.visualSimilarity * 30).toFixed(2)),
      },
      semanticStage: selectedStage.name,
      matchType: hasUsableEmbedding ? "Hybrid Match" : "Semantic Match",
    });
  }

  if (results.length === 0) {
    const fallbackPool = selectedVehicles.length > 0
      ? selectedVehicles
      : brandCandidates.length > 0
        ? brandCandidates
        : vehicles;

    console.log("IMAGE SEARCH SEMANTIC ONLY FALLBACK:", {
      fallbackPoolSize: fallbackPool.length,
      reason: "No usable image embeddings across shortlisted candidates",
    });

    fallbackPool.slice(0, 3).forEach((vehicle) => {
      results.push(
        buildSemanticFallbackResult({
          vehicle,
          detected,
          selectedStage,
          reason: "No usable image embeddings across shortlisted candidates",
          matchType: "Semantic Match",
        })
      );
    });
  }

  if (results.length === 0 && brandCandidates.length > 0 && selectedVehicles !== brandCandidates) {
    console.log("IMAGE SEARCH FALLBACK TO BRAND CANDIDATES");
  }

  if (results.length === 0 && vehicles.length > 0) {
    console.log("IMAGE SEARCH FALLBACK TO ALL ACTIVE VEHICLES");
  }

  if (results.length < 3) {
    const existingIds = new Set(results.map((item) => String(item._id)));
    const fallbackCandidates = [
      ...selectedVehicles,
      ...brandCandidates,
      ...vehicles,
    ].filter((vehicle, index, array) => {
      const key = String(vehicle._id);
      return array.findIndex((item) => String(item._id) === key) === index && !existingIds.has(key);
    });

    for (const vehicle of fallbackCandidates) {
      if (results.length >= 3) {
        break;
      }

      const semanticResult = buildSemanticFallbackResult({
        vehicle,
        detected,
        selectedStage,
        reason: "Top-up fallback to ensure at least three results",
        matchType: "Semantic Match",
      });

      console.log("IMAGE SEARCH TOP-UP FALLBACK:", {
        title: vehicle.title,
        matchType: semanticResult.matchType,
        confidence: semanticResult.confidence,
      });

      results.push(semanticResult);
      existingIds.add(String(vehicle._id));
    }
  }

  if (results.length > 0) {
    const top = results[0];
    overallConfidence = top.confidence || top.matchPercentage || 0;
    overallMatchType = top.matchType || (top.visualSimilarity > 0 ? "Hybrid Match" : "Semantic Match");
    overallReason = top.matchReason || "Top ranked result selected.";
  }

  results.sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    if (b.scoreBreakdown?.brand !== a.scoreBreakdown?.brand) {
      return (b.scoreBreakdown?.brand || 0) - (a.scoreBreakdown?.brand || 0);
    }
    return (b.scoreBreakdown?.cosine || 0) - (a.scoreBreakdown?.cosine || 0);
  });

  console.log(
    "IMAGE SEARCH FINAL RANKING:",
    results.slice(0, 3).map((item, index) => ({
      rank: index + 1,
      id: String(item._id),
      title: item.title,
      finalScore: item.finalScore,
      confidence: item.confidence,
      semanticStage: item.semanticStage,
    }))
  );

  return {
    results: results.slice(0, 3),
    matchType: overallMatchType,
    confidence: overallConfidence,
    reason: overallReason,
  };
};

module.exports = searchVehiclesByImage;
