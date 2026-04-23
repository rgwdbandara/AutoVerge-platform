const {
  findSimilarListings,
  calculateMarketRange,
  getDecisionAndConfidence,
} = require("../utils/priceLogic");

exports.estimatePrice = async (req, res) => {
  try {
    const { brand, model, year, mileage, sellerPrice } = req.body;

    if (!brand || !model || !year || !sellerPrice) {
      return res.status(400).json({
        message: "brand, model, year, sellerPrice required",
      });
    }

    const listings = await findSimilarListings(brand, model, Number(year), Number(mileage));

    if (listings.length < 3) {
      return res.json({
        message: "Not enough data",
        confidence: "Low",
      });
    }

    const { minPrice, maxPrice, medianPrice } =
      calculateMarketRange(listings);

    const { decision, confidence } = getDecisionAndConfidence(
      Number(sellerPrice),
      minPrice,
      maxPrice,
      listings
    );

    return res.json({
      marketRange: {
        min: minPrice,
        max: maxPrice,
        median: medianPrice,
      },
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