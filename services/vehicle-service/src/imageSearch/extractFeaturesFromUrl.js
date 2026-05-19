const axios = require("axios");

const extractFeaturesFromImageUrl = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error("Image URL is required");
  }

  const response = await axios.post("http://image-search-service:5004/extract-features", {
    imageUrl,
  });

  return response.data;
};

module.exports = extractFeaturesFromImageUrl;