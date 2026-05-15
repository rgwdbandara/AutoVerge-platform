const Listing = require("../models/Listing");

const CACHE_TTL_MS = 5 * 60 * 1000;
const listingsCache = new Map();

const buildCacheKey = (brand, model, year, mileage) => {
  return [
    String(brand).trim().toLowerCase(),
    String(model).trim().toLowerCase(),
    Number(year),
    Number(mileage),
  ].join("|");
};

const getCachedListings = (key) => {
  const entry = listingsCache.get(key);

  if (!entry) return null;

  if (entry.expiresAt < Date.now()) {
    listingsCache.delete(key);
    return null;
  }

  return entry.value;
};

const setCachedListings = (key, value) => {
  listingsCache.set(key, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
};

const cacheAndReturn = (key, listings) => {
  setCachedListings(key, listings);
  return listings;
};

async function findSimilarListings(brand, model, year, mileage) {

  let listings = await Listing.find({
    brand: brand,
    model: { $regex: model, $options: "i" }, // ✅ FIXED
    year: { $gte: year - 3, $lte: year + 3 }, // tighter range
  });

  console.log("STEP 1 👉", listings.length);

  if (listings.length >= 5) return listings;

  // fallback 1
  listings = await Listing.find({
    model: { $regex: model, $options: "i" },
  });

  console.log("STEP 2 👉", listings.length);

  if (listings.length >= 5) return listings;

  // final fallback
  listings = await Listing.find({}).limit(20);

  console.log("FINAL 👉", listings.length);

  return listings;
}

function calculateMarketRange(listings) {
  const prices = listings
    .map((l) => l.price)
    .filter((p) => typeof p === "number" && !isNaN(p));

  if (prices.length === 0) {
    return { min: null, max: null, median: null };
  }

  // Remove outliers
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const filtered = prices.filter((p) => p > avg * 0.7 && p < avg * 1.3);
  if (filtered.length === 0) {
    return { min: null, max: null, median: null };
  }

  const minPrice = Math.min(...filtered);
  const maxPrice = Math.max(...filtered);

  const sorted = [...filtered].sort((a, b) => a - b);
  const medianPrice = sorted[Math.floor(sorted.length / 2)];

  return { min: minPrice, max: maxPrice, median: medianPrice };
}

function getDecisionAndConfidence(sellerPrice, minPrice, maxPrice, listings) {

  let decision = "Fair Price";

  const lowerBound = minPrice * 0.9;   // 10% below
  const upperBound = maxPrice * 1.1;   // 10% above

  if (sellerPrice < lowerBound) {
    decision = "Good Deal";
  } else if (sellerPrice > upperBound) {
    decision = "Overpriced";
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