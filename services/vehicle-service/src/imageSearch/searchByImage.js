const Vehicle = require("../models/Vehicle");
const cosineSimilarity = require("./cosineSimilarity");

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

const isModelRelated = (detectedModel, vehicleModel) => {
  const detected = normalize(detectedModel);
  const vehicle = normalize(vehicleModel);

  if (!detected || !vehicle) return false;
  if (detected === vehicle) return true;
  if (detected.includes(vehicle) || vehicle.includes(detected)) return true;

  const detectedParts = detected.split(/(?=\d)|(?<=\d)/).filter(Boolean);
  const vehicleParts = vehicle.split(/(?=\d)|(?<=\d)/).filter(Boolean);

  return (
    detectedParts.some((part) => vehicle.includes(part)) ||
    vehicleParts.some((part) => detected.includes(part))
  );
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

// Generate match label based on match percentage
const getMatchLabel = (percentage) => {
  if (percentage >= 90) return "Best Match";
  if (percentage >= 80) return "Highly Similar";
  if (percentage >= 70) return "Similar";
  if (percentage >= 60) return "Partial Match";
  return "Low Match";
};

// Generate match reason based on available fields
const getMatchReason = (vehicle, detected, matchPercentage) => {
  // Priority 1: Brand match (strongest signal)
  if (detected?.brand && vehicle.brand) {
    const dbBrand = normalizeBrand(vehicle.brand);
    const gptBrand = normalizeBrand(detected.brand);

    if (dbBrand && gptBrand && (dbBrand.includes(gptBrand) || gptBrand.includes(dbBrand))) {
      // Priority 1a: Brand + Model match (strongest)
      if (detected?.model && vehicle.model) {
        if (isModelRelated(detected.model, vehicle.model)) {
          return `Matching ${vehicle.brand} ${vehicle.model} - brand, model, and body shape detected.`;
        }
      }
      // Priority 1b: Brand + Body type match
      if (vehicle.bodyType && detected?.type) {
        const detectedType = normalize(detected.type);
        const bodyType = normalize(vehicle.bodyType);
        if (detectedType && bodyType && bodyType.includes(detectedType)) {
          return `${vehicle.brand} vehicle - matching brand and body type (${vehicle.bodyType}) detected.`;
        }
      }
      // Priority 1c: Brand match only
      return `${vehicle.brand} detected - matching brand with similar visual features.`;
    }
  }

  // Priority 2: Model match (without brand)
  if (detected?.model && vehicle.model) {
    if (isModelRelated(detected.model, vehicle.model)) {
      return `${vehicle.brand} ${vehicle.model} model matched - similar exterior styling detected.`;
    }
  }

  // Priority 3: Body type match
  if (vehicle.bodyType && detected?.type) {
    const detectedType = normalize(detected.type);
    const bodyType = normalize(vehicle.bodyType);
    if (detectedType && bodyType && bodyType.includes(detectedType)) {
      return `Similar vehicle body type (${vehicle.bodyType}) and overall shape detected.`;
    }
  }

  // Priority 4: View angle match
  if (detected?.viewType) {
    return "Matching viewing angle and visible exterior structure.";
  }

  // Priority 5: High similarity score
  if (matchPercentage >= 85) {
    return "Strong visual similarity found in the uploaded image.";
  }

  if (matchPercentage >= 70) {
    return "Exterior vehicle features show visual similarity.";
  }

  return "Recommended based on closest visual feature similarity.";
};

// Generate matched features array based on viewType and vehicle-specific signals
const getMatchedFeatures = (detected, viewType, vehicle, bestScore) => {
  const view = (viewType || "").toLowerCase();
  const features = new Set();

  const add = (...items) => {
    items.filter(Boolean).forEach((item) => features.add(item));
  };

  const addVehicleSpecificFeature = () => {
    const body = (vehicle?.bodyType || "").toLowerCase();
    const model = (vehicle?.model || "").toLowerCase();

    if (body.includes("suv")) add("high ground clearance");
    else if (body.includes("sedan")) add("sedan proportions");
    else if (body.includes("coupe")) add("sleek roofline");
    else if (body.includes("hatchback")) add("compact rear hatch");
    else if (body.includes("wagon")) add("extended cargo area");
    else if (body.includes("truck")) add("cargo bed design");

    if (model.includes("c")) add("model styling cues");
    if (model.includes("sport") || model.includes("amg")) add("sport styling");
    if (model.includes("x")) add("distinctive front fascia");
  };

  if (view.includes("front") || view.includes("grille")) {
    add("front grille", "headlights", "front bumper");
    addVehicleSpecificFeature();
  } else if (view.includes("side")) {
    add("side profile", "wheel arch", "body line");
    addVehicleSpecificFeature();
  } else if (view.includes("rear")) {
    add("rear shape", "tail lights", "rear bumper");
    addVehicleSpecificFeature();
  } else if (view.includes("interior")) {
    add("interior cabin", "dashboard", "seats");
  } else if (view.includes("angled") || view.includes("corner")) {
    add("body shape", "wheel design", "lighting");
    addVehicleSpecificFeature();
  } else if (detected?.type) {
    const type = (detected.type || "").toLowerCase();

    if (type.includes("suv") || type.includes("truck")) {
      add("high ground clearance", "roof line", "cargo area");
    } else if (type.includes("sedan")) {
      add("body line", "window trim", "door design");
    } else if (type.includes("coupe") || type.includes("sports")) {
      add("aerodynamic shape", "side vents", "lowered stance");
    } else if (type.includes("hatchback") || type.includes("compact")) {
      add("rear hatch design", "bumper contour", "compact proportions");
    } else {
      add("body shape", "visible exterior features", "vehicle proportions");
    }

    addVehicleSpecificFeature();
  } else if (vehicle.bodyType) {
    const body = (vehicle.bodyType || "").toLowerCase();

    if (body.includes("suv")) {
      add("high ground clearance", "roof design", "cargo area");
    } else if (body.includes("sedan")) {
      add("body proportion", "window design", "door handles");
    } else if (body.includes("coupe")) {
      add("sleek profile", "side vents", "aggressive styling");
    } else if (body.includes("hatchback")) {
      add("compact shape", "rear glass", "tailgate design");
    } else {
      add("body shape", "visible exterior features", "vehicle proportions");
    }

    addVehicleSpecificFeature();
  } else {
    add("body shape", "visible exterior features", "vehicle proportions");
  }

  if (bestScore >= 0.85) add("strong overall visual alignment");
  if (detected?.brand) add(`${detected.brand} styling cues`);
  if (detected?.model) add(`${detected.model} design language`);

  return Array.from(features).slice(0, 4);
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
  const results = [];

  for (const vehicle of vehicles) {
    if (!Array.isArray(vehicle.images) || vehicle.images.length === 0) {
      continue;
    }

    let bestScore = -1;
    let bestImage = null;
    let bestImageViewType = null;

    for (const image of vehicle.images) {
      if (!Array.isArray(image.embedding)) {
        continue;
      }

      if (image.embedding.length !== queryFeatureVector.length) {
        continue;
      }

      const similarity = cosineSimilarity(queryFeatureVector, image.embedding);
      let finalScore = similarity * 0.6;

      if (detected?.brand && vehicle.brand) {
        const dbBrand = normalizeBrand(vehicle.brand);
        const gptBrand = normalizeBrand(detected.brand);

        if (dbBrand && gptBrand && (dbBrand.includes(gptBrand) || gptBrand.includes(dbBrand))) {
          finalScore += 0.3;
        }
      }

      if (detected?.type && vehicle.bodyType) {
        const detectedType = normalize(detected.type);
        const bodyType = normalize(vehicle.bodyType);

        if (detectedType && bodyType && bodyType.includes(detectedType)) {
          finalScore += 0.25;
        }
      }

      if (detected?.model && vehicle.model) {
        if (isModelRelated(detected.model, vehicle.model)) {
          finalScore += 0.2;
        }
      }

      if (
        typeof image.viewType === "string" &&
        typeof queryViewType === "string" &&
        image.viewType.toLowerCase() === queryViewType.toLowerCase()
      ) {
        finalScore += 0.05;
      }

      if (
        typeof image.isExterior === "boolean" &&
        typeof queryIsExterior === "boolean" &&
        image.isExterior === queryIsExterior
      ) {
        finalScore += 0.05;
      }

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestImage = image.url;
        bestImageViewType = image.viewType || "unknown";
      }
    }

    if (bestImage) {
      // Convert similarityScore to percentage
      const matchPercentage = Math.min(Math.round(bestScore * 100), 100);
      const matchLabel = getMatchLabel(matchPercentage);
      const matchReason = getMatchReason(vehicle, detected, matchPercentage);
      const matchedFeatures = getMatchedFeatures(detected, bestImageViewType, vehicle, bestScore);

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
        similarityScore: Number(bestScore.toFixed(4)),
        matchedImage: bestImage,
        matchPercentage,
        matchLabel,
        matchReason,
        matchedFeatures,
      });
    }
  }

  results.sort((a, b) => b.similarityScore - a.similarityScore);

  return results.slice(0, 10);
};

module.exports = searchVehiclesByImage;