import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useApi } from "../../lib/api";

const skeletonCards = Array.from({ length: 4 });

const formatPrice = (price) => `LKR ${Number(price || 0).toLocaleString()}`;

const buildVehicleTitle = (vehicle) => {
  if (vehicle?.title) return vehicle.title;
  return [vehicle?.brand, vehicle?.model].filter(Boolean).join(" ") || "Vehicle";
};

function RelatedCars({ currentVehicleId }) {
  const api = useApi();
  const [relatedCars, setRelatedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let mounted = true;

    const loadRelatedCars = async () => {
      if (!currentVehicleId) return;

      try {
        setLoading(true);
        setFadeIn(false);

        const data = await api(`/api/vehicles/related/${currentVehicleId}`);

        if (!mounted) return;

        setRelatedCars(Array.isArray(data) ? data : []);
        setFadeIn(true);
      } catch (error) {
        console.error("FAILED TO LOAD RELATED VEHICLES:", error);
        if (mounted) setRelatedCars([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRelatedCars();

    return () => {
      mounted = false;
    };
  }, [api, currentVehicleId]);

  const toggleFavorite = (vehicleId, event) => {
    event.preventDefault();
    event.stopPropagation();

    setFavorites((prev) => {
      const next = prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId];

      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  };

  const visibleCars = useMemo(() => relatedCars.slice(0, 8), [relatedCars]);

  if (loading) {
    return (
      <section className="mt-12">
        <div className="mb-6">
          <div className="h-8 w-72 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-4 w-[520px] max-w-full rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="min-w-[85%] sm:min-w-[48%] lg:min-w-[24%] overflow-hidden rounded-3xl bg-white shadow-lg dark:bg-[#111827]"
            >
              <div className="h-56 animate-pulse bg-slate-200 dark:bg-slate-700" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-40 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-5 w-52 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!visibleCars.length) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Similar Cars You May Like
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
          Explore related vehicles based on price range, vehicle type, and brand.
        </p>
      </div>

      <div
        className={`flex gap-5 overflow-x-auto pb-3 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${fadeIn ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      >
        {visibleCars.map((vehicle) => {
          const firstImage =
            typeof vehicle.images?.[0] === "string"
              ? vehicle.images?.[0]
              : vehicle.images?.[0]?.url;
          const favoriteActive = favorites.includes(vehicle._id);

          return (
            <Link
              key={vehicle._id}
              to={`/cars/${vehicle._id}`}
              className="group min-w-[85%] sm:min-w-[48%] lg:min-w-[24%]"
            >
              <article className="overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-[#111827] dark:shadow-black/20">
                <div className="relative overflow-hidden">
                  <img
                    src={firstImage || "https://via.placeholder.com/800x500"}
                    alt={buildVehicleTitle(vehicle)}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    onClick={(event) => toggleFavorite(vehicle._id, event)}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:scale-110 hover:text-red-500"
                    aria-label="Toggle favorite"
                  >
                    <Heart
                      size={18}
                      className={favoriteActive ? "fill-red-500 text-red-500" : "text-slate-500"}
                    />
                  </button>
                </div>

                <div className="border-t border-slate-100 p-5 dark:border-white/5">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {vehicle.brand || vehicle.bodyType || "Vehicle"}
                  </p>

                  <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-slate-900 transition group-hover:text-blue-600 dark:text-white">
                    {buildVehicleTitle(vehicle)}
                  </h3>

                  <p className="mt-2 text-lg font-bold text-blue-600 dark:text-sky-400">
                    {formatPrice(vehicle.price)}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <span>{vehicle.year || "N/A"}</span>
                    <span>•</span>
                    <span>{vehicle.transmission || "N/A"}</span>
                    <span>•</span>
                    <span>{vehicle.fuelType || vehicle.bodyType || "N/A"}</span>
                  </div>

                  <div className="mt-5">
                    <span className="flex w-full items-center justify-center rounded-xl bg-[#0B1739] px-4 py-3 text-sm font-semibold text-white transition duration-300 group-hover:bg-blue-700">
                      View Car
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default RelatedCars;