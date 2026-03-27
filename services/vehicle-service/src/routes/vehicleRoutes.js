const express = require("express");
const router = express.Router();

const clerkAuth = require("../middleware/authMiddleware");
const {
	createListing,
	getAllListings,
	getSingleListing,
	getMyListings,
	updateListing,
	deleteListing,
	markAsSold
} = require("../controllers/vehicleController");

// Create listing (seller only)
router.post("/", createListing);

// public browse
router.get("/", getAllListings);

// seller dashboard
router.get("/my", clerkAuth, getMyListings);


// update listing
router.put("/:id", updateListing);

// delete listing
router.delete("/:id", clerkAuth, deleteListing);

// mark as sold
router.patch("/:id/sold", clerkAuth, markAsSold);

// single listing
router.get("/:id", getSingleListing);

module.exports = router;