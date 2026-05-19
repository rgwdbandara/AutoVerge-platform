function extractBrandModel(title = "") {
  const normalizedTitle = title.toLowerCase();

  let brand = "";
  let model = "";

  const brands = [
    "toyota",
    "honda",
    "suzuki",
    "nissan",
    "bmw",
    "mercedes",
    "audi",
    "kia",
    "hyundai",
    "mazda",
    "ford",
  ];

  for (const b of brands) {
    if (normalizedTitle.includes(b)) {
      brand = b;
      model = title.replace(new RegExp(b, "i"), "").trim();

      break;
    }
  }

  return {
    brand,
    model,
  };
}

module.exports = extractBrandModel;