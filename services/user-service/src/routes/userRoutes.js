const express = require("express");
const router = express.Router();

const clerkAuth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  syncProfile,
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getPublicProfile,
  verifySeller,
} = require("../controllers/userController");

router.post("/sync-profile", clerkAuth, syncProfile);
router.get("/me", clerkAuth, getMyProfile);
router.put("/me", clerkAuth, updateMyProfile);
router.delete("/me", clerkAuth, deleteMyProfile);

router.get("/:id", getPublicProfile);

router.patch(
  "/:id/verify-seller",
  clerkAuth,
  authorizeRoles("admin"),
  verifySeller
);

module.exports = router;