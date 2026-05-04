import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import SourceBadge from "./SourceBadge";

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
      <div className="overflow-hidden transition bg-white shadow cursor-pointer rounded-xl hover:shadow-lg">
        {/* Image Container */}
        <div className="relative">
          <img
            src={firstImage || "https://via.placeholder.com/400"}
            className="object-cover w-full h-52"
          />

          <div className="absolute top-3 left-3 z-10">
            <SourceBadge source={car.source} />
          </div>

          {/* Heart Icon */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
          >
            <Heart
              size={20}
              className={`transition ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold">{car.title}</h3>
          <p className="text-lg font-semibold text-blue-600">
            LKR {Number(car.price || 0).toLocaleString()}
          </p>

          <div className="flex gap-3 mt-2 text-sm text-gray-500">
            <span>{car.year}</span>
            <span>{car.transmission}</span>
            <span>{car.fuelType}</span>
          </div>

          <button className="w-full py-2 mt-4 text-white bg-black rounded-lg hover:bg-gray-800">
            View Car
          </button>
        </div>
      </div>
    </Link>
  );
}

export default CarCard;