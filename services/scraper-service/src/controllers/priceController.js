const {
  findSimilarListings,
  calculateMarketRange,
  getDecisionAndConfidence,
} = require("../utils/priceLogic");

exports.estimatePrice = async (req, res) => {
  try {
    const { brand, model, year, mileage, sellerPrice } = req.body;

    const listings = await findSimilarListings(
      brand,
      model,
      Number(year),
      Number(mileage)
    );

    console.log("🔥 FINAL LISTINGS:", listings.length);

    if (listings.length === 0) {
      return res.json({
        message: "Not enough data",
        confidence: "Low",
        marketRange: null,
      });
    }

    const { min, max, median } = calculateMarketRange(listings);

    const { decision, confidence } = getDecisionAndConfidence(
      Number(sellerPrice),
      min,
      max,
      listings
    );

    return res.json({
      marketRange: { min, max, median },
      listingCount: listings.length,
      sellerPrice,
      decision,
      confidence,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error estimating price" });
  }
};