const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    adExpiryDays: { type: Number, default: 30 },
    approvalMode: {
      type: String,
      enum: ["manual", "auto"],
      default: "manual",
    },
    featuredPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminSettings", settingsSchema);
