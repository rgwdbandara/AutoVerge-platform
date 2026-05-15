jest.mock("../../src/models/Article", () => ({
  find: jest.fn(),
}));

jest.mock("../../src/services/articleAIService", () => jest.fn());

const { getArticles } = require("../../src/controllers/articleController");
const Article = require("../../src/models/Article");

describe("GET Articles API", () => {
  test("should return all articles", async () => {
    const articles = [
      {
        id: 1,
        title: "Best Hybrid Cars in Sri Lanka",
        category: "Buying Guide",
      },
      {
        id: 2,
        title: "Latest EV Trends in 2026",
        category: "EV News",
      },
    ];

    Article.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(articles),
    });

    const res = {
      json: jest.fn(),
    };

    await getArticles({}, res);

    expect(Article.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      articles,
    });
  });
});
