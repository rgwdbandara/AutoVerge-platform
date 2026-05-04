require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const startCronJobs = require("./utils/cronJob");
const importedRoutes = require("./routes/importedRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/imported", importedRoutes);

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

// Diagnostic: list registered routes (temporary)
app.get("/_routes", (req, res) => {
  try {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // routes registered directly on the app
        const methods = Object.keys(middleware.route.methods).join(',');
        routes.push({ path: middleware.route.path, methods });
      } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
        // router middleware
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const methods = Object.keys(handler.route.methods).join(',');
            routes.push({ path: handler.route.path, methods });
          }
        });
      }
    });
    res.json({ routes });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Scraper Service running on port ${PORT}`);
});

// Start cron jobs
startCronJobs();