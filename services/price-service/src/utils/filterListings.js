function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function filterListings(listings, input) {
  const brand = normalizeText(input.brand);
  const model = normalizeText(input.model);
  const year = Number(input.year);
  const mileage = Number(input.mileage);

  let matched = listings.filter(
    (item) =>
      normalizeText(item.brand) === brand &&
      normalizeText(item.model) === model
  );

  if (matched.length === 0) {
    return [];
  }

  const closeYear = matched.filter((item) => Math.abs(item.year - year) <= 1);
  if (closeYear.length > 0) matched = closeYear;

  const closeMileage = matched.filter(
    (item) => Math.abs(item.mileage - mileage) <= 30000
  );
  if (closeMileage.length > 0) matched = closeMileage;

  return matched;
}

module.exports = filterListings;