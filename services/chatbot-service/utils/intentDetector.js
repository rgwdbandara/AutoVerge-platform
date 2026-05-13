const parseBudget = (text = "") => {
  const normalized = String(text).replace(/,/g, "").toLowerCase();
  const matches = normalized.match(/(\d+(?:\.\d+)?)\s*(million|mn|m|lakhs?|lakh)?/i);

  if (!matches) return null;

  let value = Number(matches[1]);
  if (!Number.isFinite(value)) return null;

  const unit = (matches[2] || "").toLowerCase();
  if (unit === "million" || unit === "mn" || unit === "m") {
    value *= 1000000;
  } else if (unit.includes("lakh")) {
    value *= 100000;
  } else if (value < 1000) {
    value *= 1000000;
  }

  return Math.round(value);
};

const detectIntent = (message = "") => {
  const text = String(message).toLowerCase();
  const budget = parseBudget(text);

  if (/\b(emi|installment|installments|instalment|monthly payment|loan payment)\b/.test(text)) {
    return { type: "emi", budget, entities: [] };
  }

  if (/\b(compare|vs\.?|versus|difference between|which is better|a or b)\b/.test(text)) {
    const entities = String(message)
      .split(/vs\.?|versus|and|,|\//i)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3);

    return { type: "comparison", budget, entities };
  }

  if (/\b(news|latest|update|updates|ev news|car news|market news)\b/.test(text)) {
    return { type: "news", budget, entities: [] };
  }

  if (/\b(recommend|recommendation|suggest|best|good car|buy|buying|under budget|budget|suv|sedan|hatchback|family car|luxury)\b/.test(text)) {
    return { type: "recommendation", budget, vehicleType: null, entities: [] };
  }

  return { type: "chat", budget, entities: [] };
};

module.exports = { detectIntent, parseBudget };
