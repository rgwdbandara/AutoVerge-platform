const Vehicle = require("../models/Vehicle");
const cosineSimilarity = require("./cosineSimilarity");
const getSimilarityLabel = require("./similarityLabel");
const analyzeMatch = require("./matchAnalyzer");

const getCompatibleViewTypes = (queryViewType) => {
  switch (queryViewType) {
    case "front":
      return ["front", "angled", "unknown"];
    case "rear":
      return ["rear", "angled", "unknown"];
    case "side":
      return ["side", "angled", "unknown"];
    case "angled":
      return ["angled", "front", "rear", "side", "unknown"];
    case "interior":
      return ["interior", "unknown"];
    default:
      return ["front", "rear", "side", "angled", "interior", "unknown"];
  }
};

const isCompatibleBodyType = (queryBodyTypeHint, imageBodyTypeHint) => {
  if (queryBodyTypeHint === "unknown" || imageBodyTypeHint === "unknown") {
    return true;
  }

  const groupMap = {
    sedan: ["sedan", "hatchback"],
    hatchback: ["hatchback", "sedan"],
    suv: ["suv", "pickup"],
    pickup: ["pickup", "suv"],
    van: ["van"],
  };

  return groupMap[queryBodyTypeHint]?.includes(imageBodyTypeHint) || false;
};

const searchVehiclesByImage = async (
  queryFeatureVector,
  queryViewType = "unknown",
  queryIsExterior = true,
  queryBodyTypeHint = "unknown"
) => {
  if (!Array.isArray(queryFeatureVector) || queryFeatureVector.length === 0) {
    throw new Error("Valid query feature vector is required");
  }

  const compatibleViewTypes = getCompatibleViewTypes(queryViewType);

  const vehicles = await Vehicle.find({
    status: "active",
    images: { $exists: true, $ne: [] },
  }).sort({ createdAt: -1 });

  console.log("QUERY VIEW:", queryViewType);
  console.log("QUERY EXTERIOR:", queryIsExterior);
  console.log("QUERY BODY TYPE:", queryBodyTypeHint);
  console.log("ACTIVE VEHICLES FOUND:", vehicles.length);

  const results = [];

  for (const vehicle of vehicles) {
    let bestScore = -1;
    let bestMatchedImage = null;
    let bestMatchedTag = null;
    let bestMatchedViewType = null;
    let bestMatchedBodyTypeHint = null;
    let bestMatchedIsExterior = true;

    const filteredImages = vehicle.images.filter((image) => {
      if (!image?.url) return false;
      if (!Array.isArray(image.embedding) || image.embedding.length === 0) return false;

      const imageViewType = image.viewType || "unknown";
      const imageIsExterior =
        typeof image.isExterior === "boolean" ? image.isExterior : true;
      const imageBodyTypeHint = image.bodyTypeHint || "unknown";

      const viewCompatible = compatibleViewTypes.includes(imageViewType);
      const exteriorCompatible = queryIsExterior === imageIsExterior;
      const bodyTypeCompatible = isCompatibleBodyType(
        queryBodyTypeHint,
        imageBodyTypeHint
      );

      return viewCompatible && exteriorCompatible && bodyTypeCompatible;
    });

    let finalImages = filteredImages;

    // fallback: if strict metadata filtering removes everything,
    // compare with all valid embedded images of that vehicle
    if (finalImages.length === 0) {
      finalImages = vehicle.images.filter((image) => {
        if (!image?.url) return false;
        if (!Array.isArray(image.embedding) || image.embedding.length === 0) return false;
        return true;
      });
    }

    console.log(
      `Vehicle ${vehicle.title} -> strict matches: ${filteredImages.length}, fallback usable images: ${finalImages.length}`
    );

    if (finalImages.length === 0) {
      continue;
    }

    for (const image of finalImages) {
      try {
        if (image.embedding.length !== queryFeatureVector.length) {
          console.log(
            `Skipping ${vehicle.title} due to vector length mismatch: query=${queryFeatureVector.length}, image=${image.embedding.length}`
          );
          continue;
        }

        const similarityScore = cosineSimilarity(
          queryFeatureVector,
          image.embedding
        );

        if (similarityScore > bestScore) {
          bestScore = similarityScore;
          bestMatchedImage = image.url;
          bestMatchedTag = image.tag || null;
          bestMatchedViewType = image.viewType || "unknown";
          bestMatchedBodyTypeHint = image.bodyTypeHint || "unknown";
          bestMatchedIsExterior =
            typeof image.isExterior === "boolean" ? image.isExterior : true;
        }
      } catch (error) {
        console.error(
          `SIMILARITY ERROR for vehicle ${vehicle._id}:`,
          error.message
        );
      }
    }

    if (bestMatchedImage && bestScore >= 0.65) {
      const analysis = analyzeMatch({
        similarityScore: bestScore,
        queryViewType,
        matchedViewType: bestMatchedViewType,
        queryBodyTypeHint,
        matchedBodyTypeHint: bestMatchedBodyTypeHint,
        queryIsExterior,
        matchedIsExterior: bestMatchedIsExterior,
      });

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
        matchedImage: bestMatchedImage,
        matchedTag: bestMatchedTag,
        matchedViewType: bestMatchedViewType,
        matchedBodyTypeHint: bestMatchedBodyTypeHint,
        similarityScore: Number(bestScore.toFixed(4)),
        similarityLabel: getSimilarityLabel(bestScore),
        confidenceLevel: analysis.confidenceLevel,
        explanation: analysis.explanation,
        matchInsights: analysis.matchInsights,
      });
    } else {
      console.log(
        `Vehicle ${vehicle.title} rejected. bestMatchedImage=${!!bestMatchedImage}, bestScore=${bestScore}`
      );
    }
  }

  results.sort((a, b) => b.similarityScore - a.similarityScore);

  console.log("FINAL MATCH COUNT:", results.length);

  return results.slice(0, 10);
};

module.exports = searchVehiclesByImage;