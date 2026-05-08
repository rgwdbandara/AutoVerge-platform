/**
 * Utility functions for similarity labeling
 * Generates supervisor-friendly visual matching labels
 */

const getMatchLabel = (percentage) => {
  if (percentage >= 90) return "Best Match";
  if (percentage >= 80) return "Highly Similar";
  if (percentage >= 70) return "Similar";
  if (percentage >= 60) return "Partial Match";
  return "Low Match";
};

const getMatchColor = (matchLabel) => {
  const colors = {
    "Best Match": "text-green-700",
    "Highly Similar": "text-emerald-600",
    "Similar": "text-blue-600",
    "Partial Match": "text-amber-600",
    "Low Match": "text-gray-600",
  };
  return colors[matchLabel] || "text-gray-600";
};

const getMatchBgColor = (matchLabel) => {
  const colors = {
    "Best Match": "bg-green-50",
    "Highly Similar": "bg-emerald-50",
    "Similar": "bg-blue-50",
    "Partial Match": "bg-amber-50",
    "Low Match": "bg-gray-50",
  };
  return colors[matchLabel] || "bg-gray-50";
};

// Legacy export for backward compatibility
const getSimilarityLabel = (score) => {
  const percentage = Math.min(Math.round(score * 100), 100);
  return getMatchLabel(percentage);
};

module.exports = {
  getMatchLabel,
  getMatchColor,
  getMatchBgColor,
  getSimilarityLabel, // Legacy
};