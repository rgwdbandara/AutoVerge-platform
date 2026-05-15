const intentDetector = require('../utils/intentDetector');
const openaiService = require('../services/openaiService');
const recommendationService = require('../services/recommendationService');
const emiService = require('../services/emiService');
const comparisonService = require('../services/comparisonService');
const ChatHistory = require('../models/chatHistoryModel');

async function handleMessage(req, res) {
  try {
    const { userId, message } = req.body;
    if (!message) return res.status(400).json({error:'message required'});

    const intent = intentDetector.detectIntent(message);

    let reply = null;

    if (intent.type === 'recommendation') {
      const opts = { budget: intent.budget, vehicleType: intent.vehicleType, raw: message };
      const items = await recommendationService.recommend(opts);
      reply = { type: 'recommendation', items };
    } else if (intent.type === 'emi') {
      const params = emiService.parseQuery(message);
      const calculation = emiService.calculate(params);
      reply = { type: 'emi', calculation };
    } else if (intent.type === 'comparison') {
      const cars = intent.entities || [];
      const comp = await comparisonService.compare(cars);
      reply = { type: 'comparison', comp };
    } else if (intent.type === 'news') {
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
