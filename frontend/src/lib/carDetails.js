const normalizeCondition = (condition) => {
  return String(condition ?? "").trim().toLowerCase();
};

export const isBrandNewCondition = (condition) => {
  const normalizedCondition = normalizeCondition(condition);

  return normalizedCondition === "" || normalizedCondition === "brand new" || normalizedCondition === "new";
};

export const formatConditionLabel = (condition) => {
  if (isBrandNewCondition(condition)) {
    return "Brand New";
  }

  const normalizedCondition = normalizeCondition(condition);

  if (!normalizedCondition) {
    return "N/A";
  }

  return "Used";
};

export const formatMileageValue = (condition, mileage) => {
  if (isBrandNewCondition(condition)) {
    return 0;
  }

  if (mileage === 0 || mileage === "0") {
    return 0;
  }

  return mileage || "N/A";
};