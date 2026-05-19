const normalizeCondition = (condition) => {
  return String(condition ?? "").trim().toLowerCase();
};

const isBrandNewCondition = (condition) => {
  const normalizedCondition = normalizeCondition(condition);

  return normalizedCondition === "" || normalizedCondition === "brand new" || normalizedCondition === "new";
};

module.exports = {
  normalizeCondition,
  isBrandNewCondition,
};