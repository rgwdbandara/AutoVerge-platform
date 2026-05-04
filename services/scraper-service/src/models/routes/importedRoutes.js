const express = require("express");
const router = express.Router();

const {
  getAllImported,
  ignoreListing,
  publishListing,
  getSingleImported,
} = require("../controllers/importedController");

router.get("/", getAllImported);
router.post("/ignore/:id", ignoreListing);
router.post("/publish/:id", publishListing);
router.get("/:id", getSingleImported);

module.exports = router;