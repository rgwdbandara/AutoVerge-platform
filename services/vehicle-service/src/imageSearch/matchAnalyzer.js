const getConfidenceLevel = (score) => {
  if (score >= 0.90) return "Very High";
  if (score >= 0.85) return "High";
  if (score >= 0.78) return "Medium";
  return "Low";
};

const generateExplanation = ({
  score,
  viewMatch,
  bodyTypeMatch,
  exteriorMatch,
}) => {
  if (score >= 0.90) {
    return "Very strong visual match. Vehicle shape and key features align closely.";
  }

  if (score >= 0.85) {
    return "Strong similarity detected with matching visual structure.";
  }

  if (score >= 0.78) {
    return "Moderate similarity. Some visual features match.";
  }

  return "Low similarity. Only limited visual overlap detected.";
};

const analyzeMatch = ({
  similarityScore,
  queryViewType,
  matchedViewType,
  queryBodyTypeHint,
  matchedBodyTypeHint,
  queryIsExterior,
  matchedIsExterior,
}) => {
  const viewMatch =
    queryViewType === "unknown" ||
    matchedViewType === "unknown" ||
    queryViewType === matchedViewType;

  const bodyTypeMatch =
    queryBodyTypeHint === "unknown" ||
    matchedBodyTypeHint === "unknown" ||
    queryBodyTypeHint === matchedBodyTypeHint;

  const exteriorMatch = queryIsExterior === matchedIsExterior;

  return {
    confidenceLevel: getConfidenceLevel(similarityScore),
    explanation: generateExplanation({
      score: similarityScore,
      viewMatch,
      bodyTypeMatch,
      exteriorMatch,
    }),
    matchInsights: {
      viewMatch,
      bodyTypeMatch,
      exteriorMatch,
    },
  };
};

module.exports = analyzeMatch;