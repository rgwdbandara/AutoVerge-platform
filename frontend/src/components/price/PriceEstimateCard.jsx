import { useEffect, useState, useRef } from "react";
import { useApi } from "../../lib/api";

const formatLKR = (value) => {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-LK").format(value);
};

const extractModel = (fullTitle) => {
  if (!fullTitle) return "";
  const parts = fullTitle.split(" ");
  return parts.slice(1).join(" ");
};

function PriceEstimateCard({ car }) {
  const api = useApi();

  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 IMPORTANT: prevent duplicate calls
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!car) return;

    // 🔥 STOP duplicate calls
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchPriceEstimate = async () => {
      try {
        setLoading(true);

        const payload = {
          brand: car.brand,
          model: car.model || extractModel(car.title),
          year: car.year,
          mileage: car.mileage,
          sellerPrice: car.price,
        };

        console.log("🚀 PAYLOAD:", payload);

        const result = await api("/api/price/estimate", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        console.log("✅ BACKEND RESULT:", result);

        setPriceData(result);
      } catch (error) {
        console.error("Price estimate error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceEstimate();
  }, [car, api]);

  return (
    <div className="p-6 mt-6 border border-gray-200 rounded-2xl bg-gray-50">
      <h3 className="text-xl font-semibold text-gray-900">
        💰 Market Price Estimate
      </h3>

      {loading && (
        <p className="mt-3 text-gray-600">Fetching market data...</p>
      )}

      {!loading && priceData?.marketRange && (
        <div className="mt-4 space-y-2 text-gray-700">
          <p>
            Min Price: <b>LKR {formatLKR(priceData.marketRange.min)}</b>
          </p>

          <p>
            Max Price: <b>LKR {formatLKR(priceData.marketRange.max)}</b>
          </p>

          <p>
            Median Price: <b>LKR {formatLKR(priceData.marketRange.median)}</b>
          </p>

          <p className="mt-3 font-bold">
            Decision:{" "}
            <span
              className={
                priceData.decision === "Good Deal"
                  ? "text-green-600"
                  : priceData.decision === "Overpriced"
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {priceData.decision}
            </span>
          </p>

          <p>Confidence: {priceData.confidence}</p>
          <p>Listings Used: {priceData.listingCount}</p>
        </div>
      )}

      {!loading && priceData && !priceData.marketRange && (
        <p className="mt-3 text-gray-600">
          {priceData.message || "Not enough data"}
        </p>
      )}
    </div>
  );
}

export default PriceEstimateCard;