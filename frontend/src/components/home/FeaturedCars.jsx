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
        const data = await api("/api/vehicles");
        setCars(data.slice(0, 6)); // show first 6
      } catch (err) {
        console.error("Failed to load cars", err);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [api]);

  if (loading) {
    return <p className="py-10 text-center">Loading cars...</p>;
  }

  return (
    <section className="py-12 overflow-hidden">
      <div className="px-6 mx-auto max-w-7xl">

        <div className="flex justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Cars</h2>
        </div>

        {/* SCROLL CONTAINER */}
        <div className="relative w-full overflow-hidden">

          <div className="flex gap-6 animate-scroll whitespace-nowrap">
            {cars.map((car) => (
              <div key={car._id} className="min-w-[320px]">
                <CarCard car={car} />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

export default FeaturedCars;