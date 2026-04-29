
require("dotenv").config();
const express = require("express");
const cors = require("cors"); // ADD THIS
const connectDB = require("./src/config/db");
const clerkAuth = require("./src/middleware/authMiddleware");
const { deleteListingByAdmin } = require("./src/controllers/vehicleController");


const app = express();

const ADMIN_EMAILS = [
	"admin@gmail.com",
	"bwathsala24@gmail.com",
	"bwathsala24@gamil.com",
];

const isAdmin = (req, res, next) => {
	const email = req.user?.email?.toLowerCase().trim();
	const role = req.user?.public_metadata?.role || req.user?.metadata?.role;

	if (!ADMIN_EMAILS.includes(email) && role !== "admin") {
		return res.status(403).json({ msg: "Admin only" });
	}

	next();
};

app.use(cors()); // ADD THIS
app.use(express.json());

connectDB();


const vehicleRoutes = require("./src/routes/vehicleRoutes");
const adminSettingsRoutes = require("./src/routes/adminSettingsRoutes");

app.use("/admin/settings", adminSettingsRoutes);
app.delete("/admin/delete/:id", clerkAuth, isAdmin, deleteListingByAdmin);
app.use("/api/vehicles", vehicleRoutes);
app.use("/", vehicleRoutes);

// normal routes later here

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log("Vehicle service running"));