require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------- HEALTH CHECK ---------- */

app.get("/", (req, res) => {
  res.send("API Gateway is running 🚀");
});

/* ---------- AUTH SERVICE ---------- */

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
  })
);

/* ---------- USER SERVICE ---------- */

app.use(
  "/api/users",
  createProxyMiddleware({
    target: "http://localhost:5002",
    changeOrigin: true,
  })
);

/* ---------- VEHICLE SERVICE ---------- */

app.use(
  "/api/vehicles",
  createProxyMiddleware({
    target: "http://localhost:5003",
    changeOrigin: true,
  })
);

/* ---------- START SERVER ---------- */

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});