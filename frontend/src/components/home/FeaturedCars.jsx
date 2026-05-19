import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "../../lib/api";
import CarCard from "../car/CarCard";

function FeaturedCars() {
  const { t } = useTranslation();
  const api = useApi();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await api("/api/vehicles?status=active");
        // load up to 12 featured cards (two rows)
        setCars(data.slice(0, 12));
      } catch (err) {
        console.error("Failed to load cars", err);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [api]);

  if (loading) return <p className="py-10 text-center">{t("home.featuredCars.loading", { defaultValue: "Loading cars..." })}</p>;

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-24 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t("home.featuredCars.title", { defaultValue: "Featured Cars" })}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("home.featuredCars.subtitle", { defaultValue: "Popular picks curated by AutoVerge" })}</p>
        </div>

        {/* First horizontal row */}
        <div className="overflow-x-auto -mx-6 py-4">
          <div className="flex gap-6 px-6">
            {cars.slice(0, 6).map((car) => (
              <div key={car._id} className="min-w-[260px] sm:min-w-[320px] snap-start">
                <div className="transform transition hover:-translate-y-2">
                  <CarCard car={car} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second horizontal row (if available) */}
        {cars.length > 6 && (
          <div className="overflow-x-auto -mx-6 py-4 mt-2">
            <div className="flex gap-6 px-6">
              {cars.slice(6, 12).map((car) => (
                <div key={car._id} className="min-w-[260px] sm:min-w-[320px] snap-start opacity-95">
                  <div className="transform transition hover:-translate-y-2">
                    <CarCard car={car} />
                  </div>
                </div>
              ))}
              {/* View more card */}
              <div className="min-w-[260px] sm:min-w-[320px] snap-start">
                <div className="flex h-full items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm p-6">
                  <div className="text-center">
                    <div className="text-lg font-bold mb-2">See more cars</div>
                    <a href="/browse" className="inline-block px-5 py-2 rounded-2xl bg-slate-900 text-white">View more</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedCars;