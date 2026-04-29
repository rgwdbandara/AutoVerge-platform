const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String },
  name: { type: String },
  phone: { type: String },
  location: {
    city: { type: String },
    district: { type: String },
  },
  coverPhoto: { type: String },
  role: {
    type: String,
    enum: ["buyer", "seller", "admin"],
    default: "buyer",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);