const extractFeaturesFromImageUrl = require("./extractFeaturesFromUrl");

const generateImageEmbeddings = async (images = []) => {
  const enrichedImages = [];

  for (const image of images) {
    if (!image?.url) {
      enrichedImages.push({
        url: image?.url || "",
        tag: image?.tag || "",
        embedding: [],
      });
      continue;
    }

    try {
      const cnnResponse = await extractFeaturesFromImageUrl(image.url);

      enrichedImages.push({
        url: image.url,
        tag: image.tag || "",
        embedding: cnnResponse.feature_vector || [],
      });
    } catch (error) {
      console.error("EMBEDDING GENERATION ERROR:", error.message);

      enrichedImages.push({
        url: image.url,
        tag: image.tag || "",
        embedding: [],
      });
    }
  }

  return enrichedImages;
};

module.exports = generateImageEmbeddings;
