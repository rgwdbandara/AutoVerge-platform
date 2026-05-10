import { Link } from "react-router-dom";
import { Heart, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const getMatchLabelColor = (label) => {
  const colors = {
    "Exact Match": "text-green-700 bg-green-50 border-green-200",
    "Similar Match": "text-emerald-600 bg-emerald-50 border-emerald-200",
    "Related Match": "text-blue-600 bg-blue-50 border-blue-200",
    "Partial Match": "text-amber-600 bg-amber-50 border-amber-200",
    "Low Match": "text-gray-600 bg-gray-50 border-gray-200",
    // Legacy support
    "Best Match": "text-green-700 bg-green-50 border-green-200",
    "Highly Similar": "text-emerald-600 bg-emerald-50 border-emerald-200",
    "Similar": "text-blue-600 bg-blue-50 border-blue-200",
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
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const showRankBadge = rank && rank <= 3;
  const matchLabelMap = {
    "Exact Match": t("searchResultCard.exactMatch", { defaultValue: "Exact Match" }),
    "Similar Match": t("searchResultCard.similarMatch", { defaultValue: "Similar Match" }),
    "Related Match": t("searchResultCard.relatedMatch", { defaultValue: "Related Match" }),
    "Partial Match": t("searchResultCard.partialMatch", { defaultValue: "Partial Match" }),
    "Low Match": t("searchResultCard.lowMatch", { defaultValue: "Low Match" }),
    // Legacy support for old labels
    "Best Match": t("searchResultCard.exactMatch", { defaultValue: "Exact Match" }),
    "Highly Similar": t("searchResultCard.similarMatch", { defaultValue: "Similar Match" }),
    "Similar": t("searchResultCard.relatedMatch", { defaultValue: "Related Match" }),
  };
  const featureLabelMap = {
    "front grille": t("features.frontGrille", { defaultValue: "Front grille" }),
    headlights: t("features.headlights", { defaultValue: "Headlights" }),
    "front bumper": t("features.frontBumper", { defaultValue: "Front bumper" }),
    "side profile": t("features.sideProfile", { defaultValue: "Side profile" }),
    "wheel arch": t("features.wheelArch", { defaultValue: "Wheel arch" }),
    "body line": t("features.bodyLine", { defaultValue: "Body line" }),
    "rear shape": t("features.rearShape", { defaultValue: "Rear shape" }),
    "tail lights": t("features.tailLights", { defaultValue: "Tail lights" }),
    "rear bumper": t("features.rearBumper", { defaultValue: "Rear bumper" }),
    "body shape": t("features.bodyShape", { defaultValue: "Body shape" }),
    "visible exterior features": t("features.visibleExteriorFeatures", { defaultValue: "Visible exterior features" }),
    "vehicle proportions": t("features.vehicleProportions", { defaultValue: "Vehicle proportions" }),
    "interior cabin": t("features.interiorCabin", { defaultValue: "Interior cabin" }),
    dashboard: t("features.dashboard", { defaultValue: "Dashboard" }),
    seats: t("features.seats", { defaultValue: "Seats" }),
  };

  const translatedMatchLabel = matchLabelMap[result.matchLabel] || result.matchLabel;

  return (
    <div
      onClick={() => onSelect && onSelect(result)}
      className="overflow-hidden transition-all duration-300 transform border shadow-xl cursor-pointer group bg-white/80 backdrop-blur-md border-white/30 rounded-3xl hover:-translate-y-3 hover:shadow-2xl hover:bg-white/95 dark:bg-slate-800/80 dark:border-slate-600/50 dark:hover:bg-slate-800/95 dark:hover:border-slate-500"
    >
      {/* Image Container with Rank Badge */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-200 to-gray-100 dark:from-slate-700 dark:to-slate-800">
        <img
          src={result.matchedImage}
          alt={result.title}
          className="object-cover w-full h-64 transition-transform duration-500 sm:h-56 lg:h-64 group-hover:scale-110"
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
      <div className="p-5 space-y-4 sm:p-4 md:p-5">
        {/* Title */}
        <div>
          <h3 className="text-lg font-black text-gray-900 transition sm:text-base md:text-lg line-clamp-2 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {result.title}
          </h3>
        </div>

        {/* Match Label & Percentage - Side by side */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`px-4 py-2 text-xs sm:text-xs md:text-sm font-bold rounded-full border shadow-sm transition ${getMatchLabelColor(
              result.matchLabel
            )}`}
          >
            {translatedMatchLabel}
          </span>
          <span className="text-base font-black text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-950/30 px-3 py-1.5 rounded-full">
            {result.matchPercentage}%
          </span>
        </div>

        {/* Match Reason / Explanation - Highlighted box */}
        <div className="p-4 border-l-4 border-blue-500 rounded-lg bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/50 dark:to-blue-950/20 dark:border-blue-700">
          <p className="text-xs leading-relaxed text-gray-700 sm:text-xs md:text-sm dark:text-blue-100 line-clamp-2">
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">✓ </span>
            {result.matchReason}
          </p>
        </div>

        {/* Matched Features (Chips) */}
        {result.matchedFeatures && result.matchedFeatures.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {result.matchedFeatures.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 text-xs font-semibold border rounded-full shadow-sm transition text-slate-700 bg-white/80 border-slate-200/80 dark:bg-slate-700/60 dark:text-slate-100 dark:border-slate-600/80 hover:bg-white dark:hover:bg-slate-700"
              >
                #{featureLabelMap[feature.toLowerCase()] || feature}
              </span>
            ))}
          </div>
        )}

        {/* Brand / Model match indicators */}
        <div className="flex flex-wrap gap-2 pt-3">
          <span
            className={`px-3 py-1.5 text-xs font-bold rounded-full ${
              result.brandMatch ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {result.brandMatch ? t("searchResultCard.brandMatch", { defaultValue: "Brand: match" }) : t("searchResultCard.brandMismatch", { defaultValue: "Brand: differs" })}
          </span>

          <span
            className={`px-3 py-1.5 text-xs font-bold rounded-full ${
              result.modelMatch ? "bg-green-50 text-green-800 border border-green-200" : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {result.modelMatch ? t("searchResultCard.modelMatch", { defaultValue: "Model: match" }) : t("searchResultCard.modelMismatch", { defaultValue: "Model: differs" })}
          </span>
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
          <p className="text-2xl font-black text-sky-600 dark:text-sky-400">
            LKR {Number(result.price || 0).toLocaleString()}
          </p>
        </div>

        {/* Vehicle Details */}
        <div className="flex flex-wrap gap-2">
          {result.year && (
            <span className="px-3 py-1.5 text-xs sm:text-xs md:text-sm font-bold text-slate-700 bg-slate-100 dark:bg-slate-700 dark:text-slate-100 rounded-lg">
              {result.year}
            </span>
          )}
          {result.bodyType && (
            <span className="px-3 py-1.5 text-xs sm:text-xs md:text-sm font-bold text-slate-700 bg-slate-100 dark:bg-slate-700 dark:text-slate-100 rounded-lg">
              {result.bodyType}
            </span>
          )}
        </div>

        {/* Trust Level & Grade */}
        {(result.trustLevel || result.autoTrustGrade) && (
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-50/50 dark:bg-green-950/30 border-green-200/50 dark:border-green-800/50">
            {result.autoTrustGrade && (
              <div className="flex items-center flex-1 gap-2">
                <BadgeCheck size={18} className="flex-shrink-0 text-green-600 dark:text-green-400" />
                <span className="text-xs font-bold text-green-700 sm:text-xs md:text-sm dark:text-green-400">
                  AutoTrust Grade: <span className="text-green-900 dark:text-green-200">{result.autoTrustGrade}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* View Details Button */}
        <Link
          to={`/cars/${result._id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 mt-2 text-xs font-bold text-center text-white transition duration-300 shadow-md sm:text-xs md:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 active:scale-95 hover:shadow-lg"
        >
          {t("searchResultCard.viewFullDetails", { defaultValue: "View Full Details →" })}
        </Link>
      </div>
    </div>
  );
}

export default ImageSearchResultCard;
