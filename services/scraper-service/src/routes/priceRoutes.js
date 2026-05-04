const express = require("express");
const router = express.Router();
const { estimatePrice } = require("../controllers/priceController");

router.post("/estimate", estimatePrice);

module.exports = router;