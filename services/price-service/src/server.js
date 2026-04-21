require("dotenv").config();
const express = require("express");
const cors = require("cors");
const priceRoutes = require("./routes/priceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Price Service Running 🚀");
});

app.use("/api/price", priceRoutes);

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Price Service running on port ${PORT}`);
});