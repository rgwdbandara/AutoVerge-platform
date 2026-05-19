const express = require("express");
const router = express.Router();

const clerkAuth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { calculateEMI } = require("../controllers/emiController");
const { getRelatedVehicles } = require("../controllers/relatedVehicleController");
const {
  createListing,
  getAllListings,
  getSingleListing,
  getMyListings,
  getExpiredListings,
  getMyPendingListings,
  getPendingListingsForAdmin,
  getAllListingsForAdmin,
  getAdminStats,
  reactivateListing,
  approveListing,
  approveListingByAdmin,
  rejectListingByAdmin,
  deleteListingByAdmin,
  updateListing,
  deleteListing,
  markAsSold,
  searchByImage,
  submitVehicleInquiry,
  getSellerInquiries,
  getUnreadInquiryCount,
  markMyInquiriesAsRead,
} = require("../controllers/vehicleController");

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

// image-based search
router.post("/search-by-image", upload.single("image"), searchByImage);

router.post("/calculate-emi", calculateEMI);

// Create listing (seller only)
router.post("/", clerkAuth, createListing);

// public browse
router.get("/", getAllListings);

// seller dashboard (MUST be before /:id routes)
router.get("/my", clerkAuth, getMyListings);

// seller inquiries
router.get("/my/inquiries", clerkAuth, getSellerInquiries);
router.get("/my/inquiries/unread-count", clerkAuth, getUnreadInquiryCount);
router.patch("/my/inquiries/read", clerkAuth, markMyInquiriesAsRead);
router.post("/my/inquiries/mark-read", clerkAuth, markMyInquiriesAsRead);

// seller expired listings
router.get("/my/expired", clerkAuth, getExpiredListings);

// seller pending listings
router.get("/my/pending", clerkAuth, getMyPendingListings);

// admin approve listing
router.put("/approve/:id", clerkAuth, approveListing);

// admin pending listings / approvals
router.get("/admin/all", clerkAuth, isAdmin, getAllListingsForAdmin);
router.get("/admin/pending", clerkAuth, isAdmin, getPendingListingsForAdmin);
router.get("/admin/pending-ads", clerkAuth, isAdmin, getPendingListingsForAdmin);
router.get("/admin/stats", clerkAuth, isAdmin, getAdminStats);
router.put("/admin/approve/:id", clerkAuth, isAdmin, approveListingByAdmin);
router.put("/admin/reject/:id", clerkAuth, isAdmin, rejectListingByAdmin);
router.delete("/admin/delete/:id", clerkAuth, isAdmin, deleteListingByAdmin);
router.patch("/admin/:id/approve", clerkAuth, isAdmin, approveListingByAdmin);
router.patch("/admin/:id/reject", clerkAuth, isAdmin, rejectListingByAdmin);

// update listing (owner only)
router.put("/:id", clerkAuth, updateListing);

// delete listing
router.delete("/:id", clerkAuth, deleteListing);

// mark as sold
router.patch("/:id/sold", clerkAuth, markAsSold);

// reactivate listing
router.patch("/:id/reactivate", clerkAuth, reactivateListing);

// public inquiry submission for a listing
router.post("/:id/inquiries", submitVehicleInquiry);

// related listings for a vehicle
router.get("/related/:id", getRelatedVehicles);

// single listing
router.get("/:id", getSingleListing);

module.exports = router;