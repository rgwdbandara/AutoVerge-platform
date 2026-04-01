const extractFeaturesFromImageUrl = require("./extractFeaturesFromUrl");
const analyzeImageMetaFromUrl = require("./analyzeImageMetaFromUrl");

const generateImageEmbeddings = async (images = []) => {
  const enrichedImages = [];

  for (const image of images) {
    if (!image?.url) {
      enrichedImages.push({
        url: image?.url || "",
        tag: image?.tag || "",
        viewType: "unknown",
        isExterior: true,
        bodyTypeHint: "unknown",
        embedding: [],
      });
      continue;
    }

    try {
      const [cnnResponse, metaResponse] = await Promise.all([
        extractFeaturesFromImageUrl(image.url),
        analyzeImageMetaFromUrl(image.url),
      ]);

      enrichedImages.push({
        url: image.url,
        tag: image.tag || "",
        viewType: metaResponse.view_type || "unknown",
        isExterior:
          typeof metaResponse.is_exterior === "boolean"
            ? metaResponse.is_exterior
            : true,
        bodyTypeHint: metaResponse.body_type_hint || "unknown",
        embedding: cnnResponse.feature_vector || [],
      });
    } catch (error) {
      console.error("EMBEDDING / META ANALYSIS ERROR:", error.message);

      enrichedImages.push({
        url: image.url,
        tag: image.tag || "",
        viewType: "unknown",
        isExterior: true,
        bodyTypeHint: "unknown",
        embedding: [],
      });
    }
  }

  return enrichedImages;
};

module.exports = generateImageEmbeddings;