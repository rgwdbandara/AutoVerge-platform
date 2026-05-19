const axios = require("axios");
const FormData = require("form-data");

const extractFeaturesFromFile = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("Image file is required");
  }

  const formData = new FormData();

  formData.append("image", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  try {
    const response = await axios.post(
      "http://image-search-service:5004/extract-features",
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
      }
    );

    return response.data; // { feature_vector: [...] }

  } catch (error) {
    console.error("❌ CNN FEATURE ERROR:", error.message);
    throw error;
  }
};

module.exports = extractFeaturesFromFile;