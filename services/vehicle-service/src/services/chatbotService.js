const OpenAI = require("openai");
const Vehicle = require("../models/Vehicle");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const askAutoVergeBot = async (message) => {

  // 🔥 SIMPLE DB SEARCH LOGIC

  const lower = message.toLowerCase();

  let matchedVehicles = [];

 // SUV
if (lower.includes("suv")) {

  matchedVehicles = await Vehicle.find({
    bodyType: /suv/i,
    status: "active",
  })
  .select("title brand model price bodyType images")
  .limit(3);

}

  // Toyota
  else if (lower.includes("toyota")) {
    matchedVehicles = await Vehicle.find({
      brand: /toyota/i,
      status: "active",
    }).limit(5);
  }

  // Honda
  else if (lower.includes("honda")) {
    matchedVehicles = await Vehicle.find({
      brand: /honda/i,
      status: "active",
    }).limit(5);
  }

  // BMW
  else if (lower.includes("bmw")) {
    matchedVehicles = await Vehicle.find({
      brand: /bmw/i,
      status: "active",
    }).limit(5);
  }

  // 🔥 PRICE DETECTION
  const priceMatch = lower.match(/under\s+(\d+)/);

  if (priceMatch) {
    const maxPrice = Number(priceMatch[1]) * 1000000;

    matchedVehicles = await Vehicle.find({
      price: { $lte: maxPrice },
      status: "active",
    }).limit(5);
  }

  const vehicleContext = matchedVehicles.map((vehicle) => ({
    _id: vehicle._id,
    title: vehicle.title,
    brand: vehicle.brand,
    bodyType: vehicle.bodyType,
    price: vehicle.price,
    images: vehicle.images,
  }));

  // 🔥 AI RESPONSE
  const response = await client.responses.create({
    model: "gpt-4o-mini",

    input: [
      {
        role: "system",
        content: `
You are AutoVerge AI Assistant.You are AutoVerge AI Assistant.

You are a bilingual AI assistant for a smart vehicle marketplace.

You can understand and respond in:
- English
- Sinhala
- Sinhala-English mixed language

Rules:
- If the user asks in Sinhala, respond in Sinhala.
- If the user asks in English, respond in English.
- If mixed language is used, respond naturally.

You help users:
- discover vehicles
- compare cars
- search SUVs/sedans
- recommend vehicles
- understand AutoTrust scores
- use image search

Keep responses:
- short
- friendly
- professional
- easy to understand

If matching vehicles exist:
recommend them naturally.

If no vehicles found:
say no matching vehicles are currently available.

You help users discover vehicles on the AutoVerge platform.

Use the provided vehicle database results if available.

Available vehicles:
${JSON.stringify(vehicleContext, null, 2)}

Keep responses:
- short
- helpful
- friendly
- professional

If vehicles exist:
recommend them naturally.

If no vehicles found:
say no matching vehicles are available currently.
`,
      },

      {
        role: "user",
        content: message,
      },
    ],
  });

  return {
    text: response.output_text,
    vehicles: matchedVehicles,
  };
};

module.exports = askAutoVergeBot;