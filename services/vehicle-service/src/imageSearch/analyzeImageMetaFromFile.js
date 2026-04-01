const axios = require("axios");
const FormData = require("form-data");

const analyzeImageMetaFromFile = async (file) => {
  if (!file) {
    throw new Error("Image file is required");
  }

  const formData = new FormData();
  formData.append("image", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  const response = await axios.post(
    "http://127.0.0.1:5004/analyze-image-meta",
    formData,
    {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
    }
  );

  return response.data;
};

module.exports = analyzeImageMetaFromFile;