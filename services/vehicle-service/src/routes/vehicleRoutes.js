const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

const clerkAuth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { calculateEMI } = require("../controllers/emiController");
const {
  createListing,
  getAllListings,
  getSingleListing,
  getMyListings,
  updateListing,
  deleteListing,
  markAsSold,
  searchByImage,
} = require("../controllers/vehicleController");

// image-based search
router.post("/search-by-image", upload.single("image"), searchByImage);

router.post("/calculate-emi", calculateEMI);

router.post("/estimate-price", (req, res) => {
  const scriptPath = path.join(
    __dirname,
    "../../../../ai-model/predict.py"
  );

  console.log("Script path:", scriptPath);

  const pythonProcess = spawn("python", [scriptPath]);

  let result = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  pythonProcess.on("close", () => {
    console.log("RAW RESULT:", result);

    try {
      const parsed = JSON.parse(result.trim());
      const USD_TO_LKR = 300;

      const lkrPrice = parsed.estimated_price * USD_TO_LKR;

      res.json({
        estimated_price_lkr: Math.round(lkrPrice),
        estimated_price_usd: parsed.estimated_price
      });
    } catch (err) {
      console.error("PARSE ERROR:", err);
      res.status(500).json({ error: "Invalid response" });
    }
  });

  pythonProcess.stdin.write(JSON.stringify(req.body));
  pythonProcess.stdin.end();
});

// Create listing (seller only)
router.post("/", createListing);

// public browse
router.get("/", getAllListings);

// seller dashboard
router.get("/my", getMyListings);

// update listing
router.put("/:id", updateListing);

// delete listing
router.delete("/:id", clerkAuth, deleteListing);

// mark as sold
router.patch("/:id/sold", clerkAuth, markAsSold);

// single listing
router.get("/:id", getSingleListing);

module.exports = router;