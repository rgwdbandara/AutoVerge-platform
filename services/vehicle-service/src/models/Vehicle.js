const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    // 🔹 Ownership
    sellerClerkId: {
      type: String,
      required: true,
    },

    // 🔹 Listing basic info
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },

    // 🔹 Vehicle details
    brand: String,
    model: String,
    year: Number,
    mileage: Number,
    color: String,
    bodyType: String,
    seats: Number,
    fuelType: String,
    transmission: String,

    // 🔹 Condition
    condition: String,
    accidentHistory: Boolean,
    serviceHistory: String,
    previousOwners: Number,
    extraFeatures: String,

    // 🔹 Images
    images: [
      {
        url: String,
        tag: String,
        viewType: {
          type: String,
          enum: ["front", "rear", "side", "angled", "interior", "unknown"],
          default: "unknown",
        },
        isExterior: {
          type: Boolean,
          default: true,
        },
        bodyTypeHint: {
          type: String,
          enum: ["sedan", "hatchback", "suv", "van", "pickup", "unknown"],
          default: "unknown",
        },
        embedding: [Number],
      },
    ],

    autoTrustGrade: String,
    trustLevel: String,
    autoTrustCheckResults: Object,

    // 🔹 Listing status
    status: {
      type: String,
      enum: ["active", "sold", "removed"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);