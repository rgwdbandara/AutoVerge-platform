const express = require("express");
const router = express.Router();
const { getEstimatedPrice } = require("../controllers/priceController");

router.post("/estimate-price", getEstimatedPrice);

module.exports = router;