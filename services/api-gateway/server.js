require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());

// ❌ IMPORTANT: DO NOT use express.json() before proxy
// app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Gateway is running 🚀");
});

app.use("/api/auth", createProxyMiddleware({
  target: "http://auth-service:5001",
  changeOrigin: true,
}));

app.use("/api/users", createProxyMiddleware({
  target: "http://user-service:5002",
  changeOrigin: true,
}));

app.use("/api/vehicles", createProxyMiddleware({
  target: "http://vehicle-service:5003",
  changeOrigin: true,
}));

app.use("/api/price", createProxyMiddleware({
  target: "http://scraper-service:5005",
  changeOrigin: true,
}));

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});