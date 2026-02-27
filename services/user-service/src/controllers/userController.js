const UserProfile = require("../models/UserProfile");

exports.verifySeller = async (req, res) => {
  const profile = await UserProfile.findByIdAndUpdate(
    req.params.id,
    { sellerVerificationStatus: "approved" },
    { new: true }
  );

  res.json(profile);
};

exports.getPublicProfile = async (req, res) => {
  const profile = await UserProfile.findById(req.params.id);
  res.json(profile);
};

exports.updateMyProfile = async (req, res) => {
  const profile = await UserProfile.findOneAndUpdate(
    { clerkId: req.user.sub },
    req.body,
    { new: true }
  );

  res.json(profile);
};

exports.getMyProfile = async (req, res) => {
  const profile = await UserProfile.findOne({ clerkId: req.user.sub });
  res.json(profile);
};

exports.syncProfile = async (req, res) => {
  try {
    const clerkId = req.user.sub;

    let profile = await UserProfile.findOne({ clerkId });

    if (!profile) {
      profile = await UserProfile.create({ clerkId });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};