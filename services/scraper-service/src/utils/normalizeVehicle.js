function normalizeText(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = normalizeText;