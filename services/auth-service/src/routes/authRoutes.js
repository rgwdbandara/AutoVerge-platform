const User = require("../models/User");
router.get("/me", clerkAuth, async (req, res) => {
  const user = await User.findOne({ clerkId: req.user.sub });
  res.json(user);
});
const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
  "/admin-only",
  clerkAuth,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);
const express = require("express");
const router = express.Router();
const clerkAuth = require("../middleware/authMiddleware");

router.get("/protected", clerkAuth, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

const { syncUser } = require("../controllers/userController");

router.post("/sync", clerkAuth, syncUser);

module.exports = router;