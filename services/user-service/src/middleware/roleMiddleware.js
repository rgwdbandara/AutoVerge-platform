const UserProfile = require("../models/UserProfile");

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    const user = await UserProfile.findOne({ clerkId: req.user.sub });

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

module.exports = authorizeRoles;