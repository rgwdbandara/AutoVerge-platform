
import { useState, useEffect } from "react";
import { useApi } from "../lib/api";
import CarCard from "../components/car/CarCard";
const makes = ["BMW","Ford","Honda","Hyundai","Land Rover","Mahindra","Mercedes-Benz","Rivian","Tata"];
const bodyTypes = ["Coupe","Hatchback","Sedan","SUV"];
const fuelTypes = ["Diesel","Electric","Gasoline","Hybrid","Petrol"];
const transmissions = ["Automatic","Manual","Semi-Automatic"];


function BrowseCars() {
  const api = useApi();

  // search state
  const [search, setSearch] = useState("");

  // filters state
  const [filters, setFilters] = useState({
    make: "",
    bodyType: "",
    fuelType: "",
    transmission: "",
    maxPrice: "",
  });

  // results state
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all cars on component mount
  useEffect(() => {
    const loadAllCars = async () => {
      setLoading(true);
      try {
        const data = await api("/api/vehicles");
        setCars(data);
      } catch (err) {
        console.error("Failed to load cars:", err);
      }
      setLoading(false);
    };
    loadAllCars();
  }, [api]);

  const clearAll = async () => {
    setSearch("");
    setFilters({
      make: "",
      bodyType: "",
      fuelType: "",
      transmission: "",
      maxPrice: "",
    });
    // Reload all cars
    setLoading(true);
    try {
      const data = await api("/api/vehicles");
      setCars(data);
    } catch {
      console.error("Failed to load cars");
    }
    setLoading(false);
  };

  const tagStyle = (active) =>
    `px-3 py-1 rounded-lg border cursor-pointer text-sm     ${active ? "bg-blue-100 border-blue-400" : "bg-gray-100"}`;

  // Fetch cars with dynamic query string
  const fetchCars = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (filters.make) params.append("make", filters.make);
      if (filters.bodyType) params.append("bodyType", filters.bodyType);
      if (filters.fuelType) params.append("fuelType", filters.fuelType);
      if (filters.transmission) params.append("transmission", filters.transmission);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const data = await api(`/api/vehicles?${params.toString()}`);
      setCars(data);
    } catch {
      console.error("Search failed");
    }

    setLoading(false);
  };

  return (
    <div className="px-6 py-10 mx-auto max-w-7xl">

      <h1 className="mb-8 text-4xl font-bold text-blue-600">Browse Cars</h1>

      {/* SEARCH BAR */}
      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchCars()}
          placeholder="Search by make, model, fuel, location..."
          className="w-full px-4 py-3 border rounded-xl"
        />

        <button
          onClick={fetchCars}
          className="px-6 py-3 text-white bg-black rounded-xl hover:bg-gray-900"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-4 gap-8">

        {/* FILTERS */}
        <div className="col-span-1 p-5 space-y-6 bg-white shadow rounded-xl">

          <div className="flex items-center justify-between">
            <h2 className="font-bold">Filters</h2>
            <button onClick={clearAll} className="text-sm text-gray-500">Clear All</button>
          </div>

          {/* PRICE */}
          <div>
            <p className="mb-4 font-semibold">Price Range</p>
            <input
              type="range"
              min="10000"
              max="10000000"
              value={filters.maxPrice || "10000000"}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full"
            />
            <div className="flex justify-between mt-3 text-sm text-gray-600">
              <span>LKR 10,000</span>
              <span>LKR {filters.maxPrice ? Number(filters.maxPrice).toLocaleString() : "10,000,000"}</span>
            </div>
          </div>

          {/* MAKE */}
          <div>
            <p className="mb-2 font-semibold">Make</p>
            <div className="flex flex-wrap gap-2">
              {makes.map(m => (
                <span
                  key={m}
                  className={tagStyle(filters.make === m)}
                  onClick={() => setFilters({ ...filters, make: filters.make === m ? "" : m })}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* BODY */}
          <div>
            <p className="mb-2 font-semibold">Body Type</p>
            <div className="flex flex-wrap gap-2">
              {bodyTypes.map(b => (
                <span
                  key={b}
                  className={tagStyle(filters.bodyType === b)}
                  onClick={() => setFilters({ ...filters, bodyType: filters.bodyType === b ? "" : b })}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* FUEL */}
          <div>
            <p className="mb-2 font-semibold">Fuel Type</p>
            <div className="flex flex-wrap gap-2">
              {fuelTypes.map(f => (
                <span
                  key={f}
                  className={tagStyle(filters.fuelType === f)}
                  onClick={() => setFilters({ ...filters, fuelType: filters.fuelType === f ? "" : f })}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* TRANSMISSION */}
          <div>
            <p className="mb-2 font-semibold">Transmission</p>
            <div className="flex flex-wrap gap-2">
              {transmissions.map(t => (
                <span
                  key={t}
                  className={tagStyle(filters.transmission === t)}
                  onClick={() => setFilters({ ...filters, transmission: filters.transmission === t ? "" : t })}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={fetchCars}
            className="w-full py-3 mt-6 font-semibold text-white transition bg-gray-900 rounded-lg shadow-sm hover:bg-black"
          >
            Apply Filters
          </button>
        </div>

        {/* RESULTS */}
        <div className="col-span-3">

          {loading && (
            <p className="py-10 text-center">Searching cars...</p>
          )}

          {!loading && cars.length === 0 && (
            <p className="py-10 text-center text-gray-500">
              No cars found
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map(car => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}

export default BrowseCars;