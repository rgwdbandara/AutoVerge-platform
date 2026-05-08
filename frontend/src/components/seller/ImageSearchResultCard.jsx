import { Link } from "react-router-dom";
import { Heart, BadgeCheck } from "lucide-react";
import { useState } from "react";

const getMatchLabelColor = (label) => {
  const colors = {
    "Best Match": "text-green-700 bg-green-50 border-green-200",
    "Highly Similar": "text-emerald-600 bg-emerald-50 border-emerald-200",
    "Similar": "text-blue-600 bg-blue-50 border-blue-200",
    "Partial Match": "text-amber-600 bg-amber-50 border-amber-200",
    "Low Match": "text-gray-600 bg-gray-50 border-gray-200",
  };
  return colors[label] || colors["Low Match"];
};

const getRankBadgeColor = (rank) => {
  const colors = {
    1: "bg-yellow-400 text-white",
    2: "bg-gray-400 text-white",
    3: "bg-orange-400 text-white",
  };
  return colors[rank] || "bg-blue-600 text-white";
};

function ImageSearchResultCard({ result, rank, onSelect }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const showRankBadge = rank && rank <= 3;

  return (
    <div
      onClick={() => onSelect && onSelect(result)}
      className="overflow-hidden transition cursor-pointer bg-white border border-gray-200 shadow rounded-xl hover:shadow-lg hover:border-blue-300"
    >
      {/* Image Container with Rank Badge */}
      <div className="relative">
        <img
          src={result.matchedImage}
          alt={result.title}
          className="object-cover w-full h-52"
        />

        {/* Rank Badge (Top Left) */}
        {showRankBadge && (
          <div
            className={`absolute top-3 left-3 w-9 h-9 rounded-full ${getRankBadgeColor(
              rank
            )} flex items-center justify-center font-bold shadow-lg`}
          >
            {rank}
          </div>
        )}

        {/* Heart Icon (Top Right) */}
        <button
          onClick={toggleFavorite}
          className="absolute p-2 transition bg-white rounded-full shadow-md top-3 right-3 hover:shadow-lg"
        >
          <Heart
            size={20}
            className={`transition ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {result.title}
        </h3>

        {/* Match Label & Percentage */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full border ${getMatchLabelColor(
              result.matchLabel
            )}`}
          >
            {result.matchLabel}
          </span>
          <span className="text-sm font-bold text-gray-700">
            {result.matchPercentage}%
          </span>
        </div>

        {/* Match Reason / Explanation */}
        <div className="p-3 mt-3 rounded-lg bg-blue-50 border border-blue-100">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-blue-700">Why recommended: </span>
            {result.matchReason}
          </p>
        </div>

        {/* Matched Features (Chips) */}
        {result.matchedFeatures && result.matchedFeatures.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {result.matchedFeatures.map((feature, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <p className="mt-4 text-lg font-bold text-blue-600">
          LKR {Number(result.price || 0).toLocaleString()}
        </p>

        {/* Vehicle Details */}
        <div className="flex gap-3 mt-2 text-sm text-gray-600">
          {result.year && <span>{result.year}</span>}
          {result.bodyType && <span>{result.bodyType}</span>}
        </div>

        {/* Trust Level & Grade */}
        {(result.trustLevel || result.autoTrustGrade) && (
          <div className="flex items-center gap-2 mt-3">
            {result.autoTrustGrade && (
              <div className="flex items-center gap-1">
                <BadgeCheck size={16} className="text-green-600" />
                <span className="text-xs font-semibold text-green-700">
                  Grade: {result.autoTrustGrade}
                </span>
              </div>
            )}
          </div>
        )}

        {/* View Details Button */}
        <Link
          to={`/cars/${result._id}`}
          onClick={(e) => e.stopPropagation()}
          className="block w-full py-2 mt-4 text-sm font-semibold text-center text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          View Full Details
        </Link>
      </div>
    </div>
  );
}

export default ImageSearchResultCard;
