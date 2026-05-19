import { useEffect, useState } from "react";
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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!car) return;

    const fetchPriceEstimate = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const payload = {
          brand: car.brand || car.title?.split(" ")[0],
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
        console.error("❌ Price estimate error:", error);
        setErrorMsg("Could not load market price estimate.");
      } finally {
        setLoading(false);
      }
    };

    fetchPriceEstimate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car?._id]); // ✅ ONLY run once per car (fix repeat issue)

  return (
    <div className="p-6 mt-6 border border-gray-200 rounded-2xl bg-gray-50">
      <h3 className="text-xl font-semibold text-gray-900">
        💰 Market Price Estimate
      </h3>

      {/* LOADING */}
      {loading && (
        <p className="mt-3 text-gray-600">
          🔄 Fetching market data...
        </p>
      )}

      {/* ERROR */}
      {!loading && errorMsg && (
        <p className="mt-3 text-red-600">{errorMsg}</p>
      )}

      {/* SUCCESS */}
      {!loading && priceData?.marketRange && (
        <div className="mt-4 space-y-2 text-gray-700">

          <p>
            Min Price:{" "}
            <span className="font-semibold">
              LKR {formatLKR(priceData.marketRange.min)}
            </span>
          </p>

          <p>
            Max Price:{" "}
            <span className="font-semibold">
              LKR {formatLKR(priceData.marketRange.max)}
            </span>
          </p>

          <p>
            Median Price:{" "}
            <span className="font-semibold">
              LKR {formatLKR(priceData.marketRange.median)}
            </span>
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

          <p>
            Confidence:{" "}
            <span className="font-medium">
              {priceData.confidence}
            </span>
          </p>

          <p>
            Listings Used:{" "}
            <span className="font-medium">
              {priceData.listingCount}
            </span>
          </p>

        </div>
      )}

      {/* NO DATA */}
      {!loading && priceData && !priceData.marketRange && (
        <p className="mt-3 text-gray-600">
          {priceData.message || "Not enough data"}
        </p>
      )}
    </div>
  );
}

export default PriceEstimateCard;