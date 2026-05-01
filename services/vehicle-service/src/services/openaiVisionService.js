const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeImageWithGPT = async (file) => {
  try {
    if (!file || !file.buffer) {
      return {
        brand: null,
        type: null,
        model: null,
        description: null,
      };
    }

    const base64Image = file.buffer.toString("base64");

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this vehicle image and return a short, user-friendly JSON summary.

Return ONLY a valid JSON object with these exact fields:
- brand: the vehicle manufacturer name or null if uncertain
- type: the vehicle type (SUV, Sedan, Hatchback, Coupe, Truck, Van, Crossover, etc) or null if uncertain
- model: the specific vehicle model name or null if uncertain
- description: a short natural-language description of what is visible in the image, even if brand/model are uncertain

Guidelines:
- Keep description concise and helpful, around one sentence.
- If the image shows only a partial vehicle, describe the visible parts and likely vehicle style.
- Return null for brand/model if you are not confident.
- Return ONLY valid JSON, no markdown, no code fences.

Example response format:
{"brand":"Toyota","type":"SUV","model":"Fortuner","description":"A white midsize SUV with a tall stance and modern front styling."}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 180,
    });

    let text = response.choices?.[0]?.message?.content || "";

    console.log("GPT RAW RESPONSE:", text);

    text = text.replace(/```json\n?|```\n?/g, "").trim();

    let parsed = {
      brand: null,
      type: null,
      model: null,
      description: null,
    };

    try {
      parsed = JSON.parse(text);
      if (!parsed.brand) parsed.brand = null;
      if (!parsed.type) parsed.type = null;
      if (!parsed.model) parsed.model = null;
      if (!parsed.description) parsed.description = null;
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError.message);
      parsed = {
        brand: null,
        type: null,
        model: null,
        description: null,
      };
    }

    console.log("GPT PARSED RESULT:", parsed);

    return parsed;
  } catch (error) {
    console.error("GPT VISION ERROR:", error.message);
    return {
      brand: null,
      type: null,
      model: null,
      description: null,
    };
  }
};

module.exports = analyzeImageWithGPT;
