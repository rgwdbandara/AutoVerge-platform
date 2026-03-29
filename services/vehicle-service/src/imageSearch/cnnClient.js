const axios = require("axios");
const FormData = require("form-data");

const extractFeaturesFromCNNService = async (file) => {
  if (!file) {
    throw new Error("Image file is required for CNN service");
  }

  const formData = new FormData();
  formData.append("image", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  const response = await axios.post(
    "http://127.0.0.1:5004/extract-features",
    formData,
    {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
    }
  );

  return response.data;
};

module.exports = extractFeaturesFromCNNService;