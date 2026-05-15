const { generateAIArticle } = require("../../src/controllers/articleController");
const Article = require("../../src/models/Article");
const generateArticle = require("../../src/services/articleAIService");

jest.mock("../../src/models/Article", () => ({
  create: jest.fn(),
}));

jest.mock("../../src/services/articleAIService", () => jest.fn());

describe("CREATE Article API", () => {
  test("should create a new article", async () => {
    generateArticle.mockResolvedValue({
      title: "Toyota Aqua Review",
      summary: "A compact hybrid review",
      content: "Full article content",
      tags: ["Toyota", "Hybrid"],
    });

    Article.create.mockResolvedValue({
      title: "Toyota Aqua Review",
      slug: "toyota-aqua-review",
      category: "Car Reviews",
    });

    const req = {
      body: {
        topic: "Toyota Aqua Review",
        category: "Car Reviews",
        image: "",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await generateAIArticle(req, res);

    expect(generateArticle).toHaveBeenCalledWith({
      topic: "Toyota Aqua Review",
      category: "Car Reviews",
    });
    expect(Article.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      article: expect.objectContaining({
        title: "Toyota Aqua Review",
        slug: "toyota-aqua-review",
        category: "Car Reviews",
      }),
    });
  });
});
