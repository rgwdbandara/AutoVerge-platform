const mongoose = require("mongoose");

const importedListingSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["ikman", "riyasewana", "patpat"],
      required: true,
    },

    sourceUrl: {
      type: String,
      required: true,
      unique: true,
    },

    title: String,
    brand: String,
    model: String,
    year: Number,
    price: Number,
    mileage: Number,
    fuelType: String,
    transmission: String,
    location: String,
    description: String,

    images: [
      {
        url: String,
        tag: {
          type: String,
          default: "other",
        },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "published", "ignored"],
      default: "pending",
    },

    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImportedListing", importedListingSchema);