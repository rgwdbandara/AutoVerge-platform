function buildVehicleQuery({ brand, model, year }) {
  const parts = [brand, model, year, "Sri Lanka price"].filter(Boolean);
  return parts.join(" ");
}

module.exports = buildVehicleQuery;