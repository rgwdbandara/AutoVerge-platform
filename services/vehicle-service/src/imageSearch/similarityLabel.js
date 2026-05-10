/**
 * Utility functions for similarity labeling
 * Generates professional match labels with better categorization
 * 
 * Match Categories:
 * - Exact Match (97-98%)
 * - Similar Match (88-96%)
 * - Related Match (81-87%)
 * - Partial Match (65-80%)
 * - Low Match (<65%)
 */

const getMatchLabel = (percentage) => {
  if (percentage >= 97) return "Exact Match";
  if (percentage >= 88) return "Similar Match";
  if (percentage >= 81) return "Related Match";
  if (percentage >= 65) return "Partial Match";
  return "Low Match";
};

const getMatchColor = (matchLabel) => {
  const colors = {
    "Exact Match": "text-green-700",
    "Similar Match": "text-emerald-600",
    "Related Match": "text-blue-600",
    "Partial Match": "text-amber-600",
    "Low Match": "text-gray-600",
  };
  return colors[matchLabel] || "text-gray-600";
};

const getMatchBgColor = (matchLabel) => {
  const colors = {
    "Exact Match": "bg-green-50",
    "Similar Match": "bg-emerald-50",
    "Related Match": "bg-blue-50",
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