import { useEffect, useState } from "react";
import { useApi } from "../../lib/api";
import CarCard from "../car/CarCard";

function FeaturedCars() {
  const api = useApi();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await api("/api/vehicles?status=active");
        setCars(data.slice(0, 6)); // show first 6
      } catch (err) {
        console.error("Failed to load cars", err);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [api]);

  if (loading) return <p className="py-10 text-center">Loading cars...</p>;

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-24 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Cars</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Popular picks curated by AutoVerge</p>
        </div>

        <div className="overflow-x-auto -mx-6 py-4">
          <div className="flex gap-6 px-6">
            {cars.map((car) => (
              <div key={car._id} className="min-w-[260px] sm:min-w-[320px] snap-start">
                <div className="transform transition hover:-translate-y-2">
                  <CarCard car={car} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCars;