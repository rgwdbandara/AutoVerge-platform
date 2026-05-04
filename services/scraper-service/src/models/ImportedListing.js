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
      }
    }

    if (bestImage) {
      results.push({
        _id: vehicle._id,
        title: vehicle.title,
        brand: vehicle.brand,
        model: vehicle.model,
        similarityScore: Number(bestScore.toFixed(4)),
        matchedImage: bestImage,
      });
    }
  }

  results.sort((a, b) => b.similarityScore - a.similarityScore);

  return results.slice(0, 10);
};

module.exports = searchVehiclesByImage;