const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  brand: String,
  model: String,
  year: Number,
  mileage: Number,
  price: Number,
  fuelType: String,
  transmission: String,
  location: String,
  source: String,
  url: String,
  scrapedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Listing", listingSchema);