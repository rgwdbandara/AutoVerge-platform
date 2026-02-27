
const { createClerkClient } = require("@clerk/backend");

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const express = require("express");
const router = express.Router();
const clerkAuth = require("../middleware/authMiddleware");

router.get("/protected", clerkAuth, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

router.get("/dev-token", async (req, res) => {
  try {
    const userId = "user_3AF958io0hBKUImkXYqf4o5310E"; 

    const token = await clerkClient.sessions.createToken({
      userId,
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;