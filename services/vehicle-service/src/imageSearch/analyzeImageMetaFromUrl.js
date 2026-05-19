const axios = require("axios");

const analyzeImageMetaFromUrl = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error("Image URL is required");
  }

  const response = await axios.post("http://image-search-service:5004/analyze-image-meta", {
    imageUrl,
  });

  return response.data;
};

module.exports = analyzeImageMetaFromUrl;