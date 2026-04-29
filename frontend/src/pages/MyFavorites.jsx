import { useState, useEffect } from "react";
import { useApi } from "../lib/api";
import { Heart, Phone } from "lucide-react";
import { Link } from "react-router-dom";

function MyFavorites() {
  const api = useApi();
  const [favoritesCars, setFavoritesCars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        // Get favorite IDs from localStorage
        const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");

        if (favoriteIds.length === 0) {
          setFavoritesCars([]);
          setLoading(false);
          return;
        }

        // Fetch all cars and filter by favorites
        const allCars = await api("/api/vehicles");
        const favoritedCars = allCars.filter((car) => favoriteIds.includes(car._id));
        setFavoritesCars(favoritedCars);
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
      setLoading(false);
    };

    loadFavorites();
  }, [api]);

  const removeFavorite = (carId) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = favorites.filter((id) => id !== carId);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavoritesCars(favoritesCars.filter((car) => car._id !== carId));
  };

  return (
    <div>
      {/* TITLE */}
      <h2 className="mb-6 text-2xl font-semibold">My Favorites</h2>

      {loading && <p className="text-center text-gray-500">Loading favorites...</p>}

      {!loading && favoritesCars.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Heart size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600 mb-4">No favorite cars yet</p>
          <p className="text-gray-500 text-sm">Browse cars and click the heart icon to add them to favorites</p>
        </div>
      )}

      {!loading && favoritesCars.length > 0 && (
        <div className="space-y-4">
          {favoritesCars.map((car) => (
            <div key={car._id} className="p-5 bg-white border rounded-xl hover:shadow-md transition">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Image */}
                <div className="md:col-span-1">
                  <img
                    src={
                      typeof car.images?.[0] === "string"
                        ? car.images?.[0]
                        : car.images?.[0]?.url || "https://via.placeholder.com/200"
                    }
                    className="object-cover w-full h-40 rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold">{car.title}</h3>
                  <p className="text-xl font-semibold text-blue-600 mt-1">
                    LKR {Number(car.price || 0).toLocaleString()}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Year:</span> {car.year}
                    </p>
                    <p>
                      <span className="font-medium">Mileage:</span> {car.mileage || "N/A"} km
                    </p>
                    <p>
                      <span className="font-medium">Fuel:</span> {car.fuelType}
                    </p>
                    <p>
                      <span className="font-medium">Transmission:</span> {car.transmission}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    📍 {car.location?.city}, {car.location?.district}
                  </p>
                </div>

                {/* Contact & Actions */}
                <div className="md:col-span-1 flex flex-col justify-between">
                  {/* Seller Contact */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Seller Contact</p>

                    {car.contact?.name && (
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Name:</span> {car.contact.name}
                      </p>
                    )}

                    {car.contact?.phone && (
                      <a
                        href={`tel:${car.contact.phone}`}
                        className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                      >
                        <Phone size={16} />
                        {car.contact.phone}
                      </a>
                    )}

                    {car.contact?.email && (
                      <p className="text-xs text-gray-600 mt-2 break-all">
                        {car.contact.email}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 mt-3">
                    <Link
                      to={`/cars/${car._id}`}
                      className="py-2 px-3 bg-blue-600 text-white rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => removeFavorite(car._id)}
                      className="py-2 px-3 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition flex items-center justify-center gap-2"
                    >
                      <Heart size={16} className="fill-red-500 text-red-500" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyFavorites;
