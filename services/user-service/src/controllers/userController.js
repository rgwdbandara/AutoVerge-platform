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
  try {
    const clerkId = req.user.sub;

    const updated = await UserProfile.findOneAndUpdate(
      { clerkId },
      {
        name: req.body.name,
        phone: req.body.phone,
        location: req.body.location,
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const clerkId = req.user.sub;

    let profile = await UserProfile.findOne({ clerkId });

    if (!profile) {
      profile = await UserProfile.create({
        clerkId,
        email: req.user.email,
        name: req.user.name,
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
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

exports.deleteMyProfile = async (req, res) => {
  try {
    const clerkId = req.user.sub;

    await UserProfile.findOneAndDelete({ clerkId });

    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("DELETE PROFILE ERROR:", error);
    res.status(500).json({ message: "Failed to delete profile" });
  }
};