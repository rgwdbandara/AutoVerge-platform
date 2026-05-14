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
    <div className="text-slate-900 dark:text-white">
      {/* TITLE */}
      <h2 className="mb-6 text-2xl font-semibold">My Favorites</h2>

      {loading && <p className="text-center text-slate-500 dark:text-slate-400">Loading favorites...</p>}

      {!loading && favoritesCars.length === 0 && (
        <div className="rounded-xl bg-slate-50 py-12 text-center transition-colors duration-300 dark:bg-slate-900">
          <Heart size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <p className="mb-4 text-slate-600 dark:text-slate-300">No favorite cars yet</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Browse cars and click the heart icon to add them to favorites</p>
        </div>
      )}

      {!loading && favoritesCars.length > 0 && (
        <div className="space-y-4">
          {favoritesCars.map((car) => (
            <div key={car._id} className="rounded-xl border border-slate-200 bg-white p-5 transition-colors duration-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Image */}
                <div className="md:col-span-1">
                  <img
                    src={
                      typeof car.images?.[0] === "string"
                        ? car.images?.[0]
                        : car.images?.[0]?.url || "https://via.placeholder.com/200"
                    }
                    className="h-40 w-full rounded-lg object-cover"
                  />
                </div>

                {/* Details */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{car.title}</h3>
                  <p className="mt-1 text-xl font-semibold text-blue-600 dark:text-blue-400">
                    LKR {Number(car.price || 0).toLocaleString()}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
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

                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    📍 {car.location?.city}, {car.location?.district}
                  </p>
                </div>

                {/* Contact & Actions */}
                <div className="md:col-span-1 flex flex-col justify-between">
                  {/* Seller Contact */}
                  <div className="rounded-lg bg-slate-50 p-4 transition-colors duration-300 dark:bg-slate-800">
                    <p className="text-sm font-semibold mb-2">Seller Contact</p>

                    {car.contact?.name && (
                      <p className="mb-2 text-sm text-slate-700 dark:text-slate-200">
                        <span className="font-medium">Name:</span> {car.contact.name}
                      </p>
                    )}

                    {car.contact?.phone && (
                      <a
                        href={`tel:${car.contact.phone}`}
                        className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                      >
                        <Phone size={16} />
                        {car.contact.phone}
                      </a>
                    )}

                    {car.contact?.email && (
                      <p className="mt-2 break-all text-xs text-slate-600 dark:text-slate-400">
                        {car.contact.email}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 mt-3">
                    <Link
                      to={`/cars/${car._id}`}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => removeFavorite(car._id)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
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
