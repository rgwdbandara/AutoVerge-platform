const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateArticle = async ({ topic, category }) => {
  try {
    const prompt = `
Write a professional automotive article for AutoVerge.

Topic: ${topic}
Category: ${category}

Requirements:
- Beginner friendly
- Professional tone
- Sri Lankan vehicle market focused
- Include introduction, features, benefits, conclusion
- Around 700 words

Return ONLY valid JSON format:

{
  "title": "",
  "summary": "",
  "content": "",
  "tags": ["", "", ""]
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an automotive article writer.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const text = response.choices[0].message.content;

    return JSON.parse(text);
  } catch (error) {
    console.error("AI ARTICLE ERROR:", error.message);
    throw error;
  }
};

module.exports = generateArticle;