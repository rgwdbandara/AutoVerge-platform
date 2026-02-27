require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");

const app = express();

app.use(express.json());

connectDB();


const vehicleRoutes = require("./src/routes/vehicleRoutes");
app.use("/api/vehicles", vehicleRoutes);

// normal routes later here

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log("Vehicle service running"));