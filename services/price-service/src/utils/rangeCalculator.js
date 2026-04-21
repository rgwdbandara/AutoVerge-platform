function calculateMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length === 0) return 0;
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }
  return sorted[middle];
}

function removeOutliers(prices) {
  if (prices.length < 4) return prices;

  const sorted = [...prices].sort((a, b) => a - b);
  const trimCount = Math.floor(sorted.length * 0.1);

  return sorted.slice(trimCount, sorted.length - trimCount || sorted.length);
}

function calculatePriceRange(listings) {
  if (!listings.length) {
    return null;
  }

  const prices = listings.map((item) => Number(item.price)).filter(Boolean);
  const cleaned = removeOutliers(prices);

  if (!cleaned.length) {
    return null;
  }

  return {
    minPrice: Math.min(...cleaned),
    maxPrice: Math.max(...cleaned),
    medianPrice: calculateMedian(cleaned),
    listingCount: listings.length,
  };
}

module.exports = calculatePriceRange;