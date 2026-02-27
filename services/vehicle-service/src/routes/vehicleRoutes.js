const express = require("express");
const router = express.Router();

const clerkAuth = require("../middleware/authMiddleware");
const { createListing } = require("../controllers/vehicleController");

// Create listing (seller only)
router.post("/", clerkAuth, createListing);

module.exports = router;