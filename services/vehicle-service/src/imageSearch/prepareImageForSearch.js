const prepareImageForSearch = async (file) => {
  if (!file) {
    throw new Error("Image file is required");
  }

  return {
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    buffer: file.buffer,
  };
};

module.exports = prepareImageForSearch;