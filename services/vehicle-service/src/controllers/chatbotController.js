const askAutoVergeBot = require("../services/chatbotService");

exports.chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const result = await askAutoVergeBot(message);

    res.json({
      success: true,
      reply: result.text,
      vehicles: result.vehicles || [],
    });
  } catch (error) {
    console.error("CHATBOT ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Chatbot failed to respond",
    });
  }
};