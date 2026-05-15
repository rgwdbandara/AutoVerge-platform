const { chatWithBot } = require("../../src/controllers/chatbotController");
const askAutoVergeBot = require("../../src/services/chatbotService");

jest.mock("../../src/services/chatbotService", () => jest.fn());

describe("CHATBOT API", () => {
  test("should return SUV recommendation response", async () => {
    askAutoVergeBot.mockResolvedValue({
      text: "Recommended SUVs found",
      vehicles: [],
    });

    const req = {
      body: {
        message: "Best SUV under 15 million",
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await chatWithBot(req, res);

    expect(askAutoVergeBot).toHaveBeenCalledWith("Best SUV under 15 million");
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      reply: "Recommended SUVs found",
      vehicles: [],
    });
  });
});
