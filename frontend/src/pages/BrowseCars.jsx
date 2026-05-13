
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "../lib/api";
import { useSearchParams } from "react-router-dom";
import CarCard from "../components/car/CarCard";
const makes = ["BMW","Ford","Honda","Hyundai","Land Rover","Mahindra","Mercedes-Benz","Rivian","Tata"];
const bodyTypes = ["Coupe","Convertible","Hatchback","Sedan","SUV","Wagon","Crossover","Pickup","Van","Minivan"];
const fuelTypes = ["Diesel","Electric","Gasoline","Hybrid","Petrol"];
const transmissions = ["Automatic","Manual","Semi-Automatic"];


function BrowseCars() {
  const { t } = useTranslation();
  const api = useApi();
  const [searchParams] = useSearchParams();

  // search state
  const [search, setSearch] = useState("");

  // filters state - initialize bodyType from URL query param
  const [filters, setFilters] = useState({
    make: "",
    bodyType: searchParams.get("bodyType") || "",
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

  // Auto-fetch when filters or search change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search || filters.make || filters.bodyType || filters.fuelType || filters.transmission || filters.maxPrice) {
        setLoading(true);
        const fetchFiltered = async () => {
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
          } catch (err) {
            console.error("Auto-filter failed:", err);
          } finally {
            setLoading(false);
          }
        };
        fetchFiltered();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [search, filters, api]);

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
    `px-3 py-1 rounded-lg border cursor-pointer text-sm     ${active ? "bg-blue-100 border-blue-400 dark:bg-blue-900" : "bg-gray-100 dark:bg-slate-700"}`;

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
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 sm:py-10">

      <h1 className="mb-6 text-3xl font-bold text-blue-600 sm:mb-8 sm:text-4xl">{t("browse.title")}</h1>

      {/* SEARCH BAR */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchCars()}
          placeholder={t("browse.searchPlaceholder")}
          className="w-full px-4 py-3 bg-white border rounded-xl dark:bg-slate-900 dark:text-white dark:border-white/10"
        />

        <button
          onClick={fetchCars}
          className="w-full px-6 py-3 text-white bg-black rounded-xl hover:bg-gray-900 sm:w-auto dark:bg-slate-800"
        >
          {t("buttons.search")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">

        {/* FILTERS */}
        <div className="p-4 space-y-6 bg-white shadow rounded-xl sm:p-5 lg:col-span-1 dark:bg-slate-800 dark:text-white">

          <div className="flex items-center justify-between">
            <h2 className="font-bold">{t("browse.filters")}</h2>
            <button onClick={clearAll} className="text-sm text-gray-500 dark:text-slate-300">{t("browse.clearAll")}</button>
          </div>

          {/* PRICE */}
          <div>
            <p className="mb-4 font-semibold">{t("browse.priceRange")}</p>
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
            <p className="mb-2 font-semibold">{t("browse.make")}</p>
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
            <p className="mb-2 font-semibold">{t("browse.bodyType")}</p>
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
            <p className="mb-2 font-semibold">{t("browse.fuelType")}</p>
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
            <p className="mb-2 font-semibold">{t("browse.transmission")}</p>
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
            className="w-full py-3 mt-6 font-semibold text-white transition bg-gray-900 rounded-lg shadow-sm hover:bg-black dark:bg-slate-700"
          >
            {t("browse.applyFilters")}
          </button>
        </div>

        {/* RESULTS */}
        <div className="lg:col-span-3">

          {loading && (
            <p className="py-10 text-center">{t("browse.searchingCars")}</p>
          )}

          {!loading && cars.length === 0 && (
            <p className="py-10 text-center text-gray-500">
              {t("browse.noCarsFound")}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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