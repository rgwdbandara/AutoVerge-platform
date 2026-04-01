const getSimilarityLabel = (score) => {
  if (score >= 0.90) return "Highly Similar";
  if (score >= 0.80) return "Similar";
  if (score >= 0.70) return "Partial Match";
  return "Low Match";
};

module.exports = getSimilarityLabel;