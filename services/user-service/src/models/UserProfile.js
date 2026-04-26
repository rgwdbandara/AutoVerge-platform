const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },

    name: String,
    email: String,
    fullName: String,
    phone: String,
    profileImage: String,
    coverPhoto: String,
    address: String,
    bio: String,
    location: {
      city: String,
      district: String,
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },

    sellerVerificationStatus: {
      type: String,
      enum: ["not_requested", "pending", "approved", "rejected"],
      default: "not_requested",
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);