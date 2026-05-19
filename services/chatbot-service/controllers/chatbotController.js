const intentDetector = require('../utils/intentDetector');
const openaiService = require('../services/openaiService');
const emiService = require('../services/emiService');
const ChatHistory = require('../models/chatHistoryModel');

async function handleMessage(req, res) {
  try {
    const { userId, message } = req.body;
    if (!message) return res.status(400).json({error:'message required'});

    const intent = intentDetector.detectIntent(message);

    let reply = null;

    if (intent.type === 'emi') {
      const params = emiService.parseQuery(message);
      const calculation = emiService.calculate(params);
      reply = { type: 'emi', calculation };
    } else if (intent.type === 'recommendation' || intent.type === 'comparison' || intent.type === 'news') {
      const ai = await openaiService.generateAssistantResponse(message, intent);
      reply = { type: 'text', text: ai };
    } else {
      // fallback to OpenAI conversational reply with helpful suggestions
      const ai = await openaiService.generateAssistantResponse(message, intent);
      reply = { type: 'text', text: ai };
    }

    // Save chat history
    try {
      await ChatHistory.create({ userId: userId || null, message, response: JSON.stringify(reply) });
    } catch(e){ /* don't fail on history save */ }

    return res.json({ intent, reply });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
}

module.exports = { handleMessage };
