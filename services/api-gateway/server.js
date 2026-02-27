require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("API Gateway is running 🚀");
});

/* ---------- ROUTE PROXIES ---------- */

// Auth service
app.use("/api/auth", createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
}));

// User service
app.use("/api/users", createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
}));

// Vehicle service
app.use("/api/vehicles", createProxyMiddleware({
  target: process.env.VEHICLE_SERVICE_URL,
  changeOrigin: true,
}));

/* ---------- START SERVER ---------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});