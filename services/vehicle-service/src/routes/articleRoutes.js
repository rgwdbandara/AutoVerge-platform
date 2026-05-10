const express = require("express");

const router = express.Router();

const {
  generateAIArticle,
  getArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");


// ✅ Generate AI article
router.post("/generate", generateAIArticle);


// ✅ Get all articles
router.get("/", getArticles);


// ✅ Get single article
router.get("/:slug", getArticleBySlug);

// Admin update article
router.put("/admin/:id", require("../middleware/authMiddleware"), require("../middleware/isAdmin"), updateArticle);

// Admin delete article
router.delete("/admin/:id", require("../middleware/authMiddleware"), require("../middleware/isAdmin"), deleteArticle);


module.exports = router;