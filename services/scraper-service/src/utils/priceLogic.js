const Listing = require("../models/Listing");

async function findSimilarListings(brand, model, year, mileage) {
  // Strict filter: brand, model, year ±1, mileage ±30000
  let listings = await Listing.find({
    brand: brand,
    model: model,
    year: { $gte: year - 1, $lte: year + 1 },
    mileage: { $gte: mileage - 30000, $lte: mileage + 30000 },
  });
  if (listings.length > 0) return listings;

  // Fallbacks
  listings = await Listing.find({ model: model });
  if (listings.length > 0) return listings;

  listings = await Listing.find({ brand: brand });
  if (listings.length > 0) return listings;

  listings = await Listing.find({});
  return listings;
}

function calculateMarketRange(listings) {
  const prices = listings
    .map((l) => l.price)
    .filter((p) => typeof p === "number" && !isNaN(p));

  if (prices.length === 0) {
    return { minPrice: null, maxPrice: null, medianPrice: null };
  }

  // Remove outliers
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const filtered = prices.filter((p) => p > avg * 0.5 && p < avg * 1.5);
  if (filtered.length === 0) {
    return { minPrice: null, maxPrice: null, medianPrice: null };
  }

  const minPrice = Math.min(...filtered);
  const maxPrice = Math.max(...filtered);

  const sorted = [...filtered].sort((a, b) => a - b);
  const medianPrice = sorted[Math.floor(sorted.length / 2)];

  return { minPrice, maxPrice, medianPrice };
}

function getDecisionAndConfidence(sellerPrice, minPrice, maxPrice, listings) {
  let decision = "Overpriced";

  if (sellerPrice < minPrice) {
    decision = "Good Deal";
  } else if (sellerPrice <= maxPrice) {
    decision = "Fair Price";
  }

  let confidence = "Low";

  if (listings.length >= 10) confidence = "High";
  else if (listings.length >= 5) confidence = "Medium";

  return { decision, confidence };
}

module.exports = {
  findSimilarListings,
  calculateMarketRange,
  getDecisionAndConfidence,
};