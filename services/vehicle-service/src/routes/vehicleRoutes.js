const express = require("express");
const router = express.Router();

const clerkAuth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  createListing,
  getAllListings,
  getSingleListing,
  getMyListings,
  updateListing,
  deleteListing,
  markAsSold,
  searchByImage,
} = require("../controllers/vehicleController");

// image-based search
router.post("/search-by-image", upload.single("image"), searchByImage);

// Create listing (seller only)
router.post("/", createListing);

// public browse
router.get("/", getAllListings);

// seller dashboard
router.get("/my", getMyListings);

// update listing
router.put("/:id", updateListing);

// delete listing
router.delete("/:id", clerkAuth, deleteListing);

// mark as sold
router.patch("/:id/sold", clerkAuth, markAsSold);

// single listing
router.get("/:id", getSingleListing);

module.exports = router;