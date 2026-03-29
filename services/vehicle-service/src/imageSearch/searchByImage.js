const Vehicle = require("../models/Vehicle");
const cosineSimilarity = require("./cosineSimilarity");
const getSimilarityLabel = require("./similarityLabel");

const searchVehiclesByImage = async (queryFeatureVector) => {
  if (!Array.isArray(queryFeatureVector) || queryFeatureVector.length === 0) {
    throw new Error("Valid query feature vector is required");
  }

  const vehicles = await Vehicle.find({
    status: "active",
    images: { $exists: true, $ne: [] },
  }).sort({ createdAt: -1 });

  const results = [];

  for (const vehicle of vehicles) {
    let bestScore = -1;
    let bestMatchedImage = null;

    for (const image of vehicle.images) {
      if (!image?.url) continue;
      if (!Array.isArray(image.embedding) || image.embedding.length === 0) continue;

      try {
        const similarityScore = cosineSimilarity(
          queryFeatureVector,
          image.embedding
        );

        if (similarityScore > bestScore) {
          bestScore = similarityScore;
          bestMatchedImage = image.url;
        }
      } catch (error) {
        console.error(
          `SIMILARITY ERROR for vehicle ${vehicle._id}:`,
          error.message
        );
      }
    }

    if (bestMatchedImage && bestScore >= 0.70) {
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
        similarityScore: Number(bestScore.toFixed(4)),
        similarityLabel: getSimilarityLabel(bestScore),
      });
    }
  }

  results.sort((a, b) => b.similarityScore - a.similarityScore);

  return results.slice(0, 10);
};

module.exports = searchVehiclesByImage;