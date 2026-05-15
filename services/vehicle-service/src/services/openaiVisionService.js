const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 seconds timeout
  maxRetries: 1,
});

const analyzeImageWithGPT = async (file) => {
  try {
    if (!file || !file.buffer) {
      return {
        isVehicle: false,
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
              text: `Analyze this image. First decide if the image contains a real vehicle/car. If it is not a vehicle, return isVehicle:false and brand/type/model as null. If it is a vehicle, return isVehicle:true with brand/type/model if visible.

Return ONLY a valid JSON object with these exact fields:
- isVehicle: true if the image contains a real vehicle/car, otherwise false
- brand: the vehicle manufacturer name or null if uncertain
- type: the vehicle type (SUV, Sedan, Hatchback, Coupe, Truck, Van, Crossover, etc) or null if uncertain
- model: the specific vehicle model name or null if uncertain
- description: a short natural-language description of what is visible in the image, even if brand/model are uncertain

Guidelines:
- Keep description concise and helpful, around one sentence.
- If the image shows only a partial vehicle, describe the visible parts and likely vehicle style.
- Return null for brand/model if you are not confident.
- If the image is not a vehicle, set brand/type/model to null and provide a short description of the non-vehicle image.
- Return ONLY valid JSON, no markdown, no code fences.

Example response format:
{\"isVehicle\":true,\"brand\":\"Toyota\",\"type\":\"SUV\",\"model\":\"Fortuner\",\"description\":\"A white midsize SUV with a tall stance and modern front styling.\"}`,
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
      isVehicle: false,
      brand: null,
      type: null,
      model: null,
      description: null,
    };

    try {
      parsed = JSON.parse(text);
      parsed.isVehicle = Boolean(parsed.isVehicle);
      if (!parsed.brand) parsed.brand = null;
      if (!parsed.type) parsed.type = null;
      if (!parsed.model) parsed.model = null;
      if (!parsed.description) parsed.description = null;
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError.message);
      parsed = {
        isVehicle: false,
        brand: null,
        type: null,
        model: null,
        description: null,
      };
    }

    console.log("GPT PARSED RESULT:", parsed);

    return parsed;
  } catch (error) {
    if (error.code === "ERR_HTTP_REQUEST_TIMEOUT" || error.message.includes("timeout")) {
      console.error("GPT VISION TIMEOUT: OpenAI API took too long. Fallback to basic detection.");
    } else {
      console.error("GPT VISION ERROR:", error.message);
    }
    
    // Fallback: Return generic vehicle response instead of failing completely
    return {
      isVehicle: true, // Assume it's a vehicle to allow search to proceed
      brand: null,
      type: null,
      model: null,
      description: "Vehicle image analysis unavailable - using fallback mode",
    };
  }
};

module.exports = analyzeImageWithGPT;
