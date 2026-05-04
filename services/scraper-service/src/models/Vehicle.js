const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    sellerClerkId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    brand: String,
    model: String,
    year: Number,
    mileage: Number,
    fuelType: String,
    transmission: String,
    condition: String,
    serviceHistory: String,
    status: {
      type: String,
      enum: ["pending", "active", "sold", "expired", "rejected", "removed"],
      default: "pending",
    },
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
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);