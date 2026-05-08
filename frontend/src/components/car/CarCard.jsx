import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

function CarCard({ car }) {
  const firstImage =
    typeof car.images?.[0] === "string"
      ? car.images?.[0]
      : car.images?.[0]?.url;

  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.includes(car._id);
  });

  // Toggle favorite
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (isFavorite) {
      // Remove from favorites
      const updated = favorites.filter(id => id !== car._id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      // Add to favorites
      favorites.push(car._id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  return (
    <Link to={`/cars/${car._id}`}>
      <div className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg dark:bg-slate-900">
        {/* Image Container */}
        <div className="relative">
          <img
            src={firstImage || "https://via.placeholder.com/400"}
            className="object-cover w-full h-52"
          />

          {/* Heart Icon */}
          <button
            onClick={toggleFavorite}
            className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-md transition hover:shadow-lg dark:bg-slate-950"
          >
            <Heart
              size={20}
              className={`transition ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500 dark:text-slate-400"}`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{car.title}</h3>
          <p className="text-lg font-semibold text-blue-600 dark:text-sky-400">
            LKR {Number(car.price || 0).toLocaleString()}
          </p>

          <div className="mt-2 flex gap-3 text-sm text-gray-500 dark:text-slate-400">
            <span>{car.year}</span>
            <span>{car.transmission}</span>
            <span>{car.fuelType}</span>
          </div>

          <button className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-100">
            View Car
          </button>
        </div>
      </div>
    </Link>
  );
}

export default CarCard;