const estimatePrice = require("../utils/priceLogic");

exports.getEstimatedPrice = (req, res) => {
  try {
    const { brand, model, year, mileage } = req.body;

    if (!brand || !model || !year || mileage === undefined) {
      return res.status(400).json({
        message: "brand, model, year and mileage are required",
      });
    }

    const result = estimatePrice({
      brand,
      model,
      year: Number(year),
      mileage: Number(mileage),
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Price estimation error:", error);
    return res.status(500).json({
      message: "Failed to estimate price",
    });
  }
};