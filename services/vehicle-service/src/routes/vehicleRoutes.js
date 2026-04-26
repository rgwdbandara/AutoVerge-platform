const express = require("express");
const router = express.Router();

const clerkAuth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { calculateEMI } = require("../controllers/emiController");
const {
  createListing,
  getAllListings,
  getSingleListing,
  getMyListings,
  getExpiredListings,
  getMyPendingListings,
  reactivateListing,
  approveListing,
  updateListing,
  deleteListing,
  markAsSold,
  searchByImage,
} = require("../controllers/vehicleController");

// image-based search
router.post("/search-by-image", upload.single("image"), searchByImage);

router.post("/calculate-emi", calculateEMI);

// Create listing (seller only)
router.post("/", clerkAuth, createListing);

// public browse
router.get("/", getAllListings);

// seller dashboard (MUST be before /:id routes)
router.get("/my", clerkAuth, getMyListings);

// seller expired listings
router.get("/my/expired", clerkAuth, getExpiredListings);

// seller pending listings
router.get("/my/pending", clerkAuth, getMyPendingListings);

// admin approve listing
router.put("/approve/:id", clerkAuth, approveListing);

// update listing (owner only)
router.put("/:id", clerkAuth, updateListing);

// delete listing
router.delete("/:id", clerkAuth, deleteListing);

// mark as sold
router.patch("/:id/sold", clerkAuth, markAsSold);

// reactivate listing
router.patch("/:id/reactivate", clerkAuth, reactivateListing);

// single listing
router.get("/:id", getSingleListing);

module.exports = router;