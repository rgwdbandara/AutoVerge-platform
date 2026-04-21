const mockListings = require("../data/mockListings");
const buildVehicleQuery = require("./queryBuilder");
const filterListings = require("./filterListings");
const calculatePriceRange = require("./rangeCalculator");

function estimatePrice(inputCar) {
  const searchQuery = buildVehicleQuery(inputCar);
  const matchedListings = filterListings(mockListings, inputCar);
  const range = calculatePriceRange(matchedListings);

  if (!range) {
    return {
      success: false,
      message: "No matching market listings found",
      searchQuery,
      matchedListings: [],
    };
  }

  return {
    success: true,
    searchQuery,
    matchedListings,
    ...range,
  };
}

module.exports = estimatePrice;