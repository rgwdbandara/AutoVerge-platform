const { verifyToken, createClerkClient } = require("@clerk/backend");

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const clerkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.user = payload;

    // Enrich token payload with reliable email/role data from Clerk user profile.
    if (req.user?.sub) {
      try {
        const clerkUser = await clerkClient.users.getUser(req.user.sub);
        const primaryEmail = clerkUser.emailAddresses.find(
          (email) => email.id === clerkUser.primaryEmailAddressId
        )?.emailAddress;

        req.user.email = primaryEmail || req.user.email;
        req.user.public_metadata =
          clerkUser.publicMetadata || req.user.public_metadata || {};
        req.user.metadata = clerkUser.privateMetadata || req.user.metadata || {};
      } catch (profileError) {
        console.warn("Could not enrich Clerk user profile:", profileError.message);
      }
    }

    if (!req.user?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = clerkAuth;