const express = require("express");
const router = express.Router();

const clerkAuth = require("../middleware/authMiddleware");

router.get("/me", clerkAuth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;