const slugify = require("slugify");

const Article = require("../models/Article");
const generateArticle = require("../services/articleAIService");


// ✅ Generate AI Article
exports.generateAIArticle = async (req, res) => {
  try {
    const { topic, category, image } = req.body;

    if (!topic || !category) {
      return res.status(400).json({
        success: false,
        message: "Topic and category are required",
      });
    }

    // 🔥 Generate from OpenAI
    const aiArticle = await generateArticle({
      topic,
      category,
    });

    // 🔥 Create slug
    const slug = slugify(aiArticle.title, {
      lower: true,
      strict: true,
    });

    // 🔥 Save to MongoDB
    const article = await Article.create({
      title: aiArticle.title,
      slug,
      category,
      summary: aiArticle.summary,
      content: aiArticle.content,
      image: image || "",
      tags: aiArticle.tags || [],
    });

    res.status(201).json({
      success: true,
      article,
    });

  } catch (error) {
    console.error("GENERATE ARTICLE ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to generate article",
    });
  }
};


// ✅ Get all articles
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      articles,
    });

  } catch (error) {
    console.error("GET ARTICLES ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
    });
  }
};


// ✅ Get single article by slug
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // 🔥 Optional: increase views
    article.views += 1;
    await article.save();

    res.json({
      success: true,
      article,
    });

  } catch (error) {
    console.error("GET ARTICLE ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
    });
  }
};


// ✅ Update article (admin)
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content, image, category, tags, featured } = req.body;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    if (title) {
      article.title = title;
      article.slug = slugify(title, { lower: true, strict: true });
    }

    if (summary !== undefined) article.summary = summary;
    if (content !== undefined) article.content = content;
    if (image !== undefined) article.image = image;
    if (category !== undefined) article.category = category;
    if (Array.isArray(tags)) article.tags = tags;
    if (featured !== undefined) article.featured = !!featured;

    await article.save();

    res.json({ success: true, article });
  } catch (error) {
    console.error("UPDATE ARTICLE ERROR:", error.message);
    res.status(500).json({ success: false, message: "Failed to update article" });
  }
};


// ✅ Delete article (admin)
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    await Article.deleteOne({ _id: id });

    res.json({ success: true, message: "Article deleted" });
  } catch (error) {
    console.error("DELETE ARTICLE ERROR:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete article" });
  }
};