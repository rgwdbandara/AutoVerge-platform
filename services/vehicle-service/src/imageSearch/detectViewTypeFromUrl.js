const axios = require("axios");

const detectViewTypeFromImageUrl = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error("Image URL is required");
  }

  const response = await axios.post("http://image-search-service:5004/detect-view-type", {
    imageUrl,
  });

  return response.data;
};

module.exports = detectViewTypeFromImageUrl;