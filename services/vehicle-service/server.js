
require("dotenv").config();
const express = require("express");
const cors = require("cors"); // ADD THIS
const connectDB = require("./src/config/db");


const app = express();

app.use(cors()); // ADD THIS
app.use(express.json());

connectDB();


const vehicleRoutes = require("./src/routes/vehicleRoutes");
app.use("/api/vehicles", vehicleRoutes);
app.use("/", vehicleRoutes);

// normal routes later here

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log("Vehicle service running"));