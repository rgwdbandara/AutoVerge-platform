const ADMIN_EMAILS = [
  "admin@gmail.com",
  "bwathsala24@gmail.com",
  "bwathsala24@gamil.com",
];

const isAdmin = (req, res, next) => {
  const email = req.user?.email?.toLowerCase().trim();
  const role = req.user?.public_metadata?.role || req.user?.metadata?.role;

  if (!ADMIN_EMAILS.includes(email) && role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};

module.exports = isAdmin;
