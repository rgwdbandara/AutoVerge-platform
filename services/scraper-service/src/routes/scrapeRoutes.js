const express = require("express");
const router = express.Router();
const { runScraper } = require("../controllers/scrapeController");

router.get("/run", runScraper);

module.exports = router;