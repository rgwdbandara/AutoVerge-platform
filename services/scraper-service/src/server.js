require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const startCronJobs = require("./utils/cronJob");

const app = express();

app.use(cors());
app.use(express.json());

const scrapeRoutes = require("./routes/scrapeRoutes");
app.use("/api/scrape", scrapeRoutes);

const priceRoutes = require("./routes/priceRoutes");
app.use("/api/price", priceRoutes);

// DB connect
connectDB();

// Health check
app.get("/", (req, res) => {
  res.send("Scraper Service Running 🚀");
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Scraper Service running on port ${PORT}`);
});

// Start cron jobs
startCronJobs();