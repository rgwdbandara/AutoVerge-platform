const User = require("../models/User");

exports.syncUser = async (req, res) => {
  try {
    const { sub, email } = req.user; // sub = clerkId

    let user = await User.findOne({ clerkId: sub });

    if (!user) {
      user = await User.create({
        clerkId: sub,
        email: email,
        role: "buyer",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};