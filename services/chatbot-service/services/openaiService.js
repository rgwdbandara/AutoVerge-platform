const axios = require('axios');

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

async function generateAssistantResponse(userMessage, intent = {}) {
  if (!OPENAI_KEY) {
    // Provide helpful fallback suggestions
    return `I can help with:\n• Car recommendations\n• EMI calculations\n• Vehicle comparisons\n• Buying tips\n• EV news\n\nExamples:\n- Best SUV under 15 million\n- Aqua vs Fit\n- EMI for 12 million car`;
  }

  try {
    const system = `You are AutoVerge AI Assistant. Provide concise automotive advice, comparisons, EMI explanations and recommendations for Sri Lanka. Mix Sinhala and English when user uses mixed language.`;
    const data = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 700,
      temperature: 0.2
    };

    const resp = await axios.post(OPENAI_URL, data, {
      headers: { Authorization: `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' }
    });
    const text = (resp.data.choices && resp.data.choices[0].message.content) || '';
    return text;
  } catch (err) {
    console.error('OpenAI error', err?.response?.data || err.message);
    return `I can help with:\n• Car recommendations\n• EMI calculations\n• Vehicle comparisons\n• Buying tips\n• EV news`;
  }
}

module.exports = { generateAssistantResponse };
