const express = require("express");
const router = express.Router();

const clerkAuth = require("../middleware/authMiddleware");
const Settings = require("../models/AdminSettings");

const ADMIN_EMAILS = [
  "admin@gmail.com",
  "bwathsala24@gmail.com",
  "bwathsala24@gamil.com",
];

const isAdmin = (req, res, next) => {
  const email = req.user?.email?.toLowerCase().trim();
  const role = req.user?.public_metadata?.role || req.user?.metadata?.role;

  if (!ADMIN_EMAILS.includes(email) && role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }

  next();
};

router.get("/", clerkAuth, isAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (error) {
    console.error("GET ADMIN SETTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

router.put("/", clerkAuth, isAdmin, async (req, res) => {
  try {
    const { adExpiryDays, approvalMode, featuredPrice } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    settings.adExpiryDays = Number(adExpiryDays) || 30;
    settings.approvalMode = approvalMode === "auto" ? "auto" : "manual";
    settings.featuredPrice = Number(featuredPrice) || 0;

    await settings.save();

    res.json({ message: "Settings updated", settings });
  } catch (error) {
    console.error("UPDATE ADMIN SETTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

module.exports = router;
