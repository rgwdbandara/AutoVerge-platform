const clerkAuth = async (req, res, next) => {
  try {
    // TEMP DEV USER
    req.user = {
      sub: "user_3AF9_qf4o5310E",
      email: "test@autoverge.com",
      role: "buyer"
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" });
  }
};

module.exports = clerkAuth;
