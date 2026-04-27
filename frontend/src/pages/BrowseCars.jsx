
import { useState, useEffect } from "react";
import { useApi } from "../lib/api";
import CarCard from "../components/car/CarCard";
const makes = ["BMW","Ford","Honda","Hyundai","Land Rover","Mahindra","Mercedes-Benz","Rivian","Tata"];
const bodyTypes = ["Coupe","Hatchback","Sedan","SUV"];
const fuelTypes = ["Diesel","Electric","Gasoline","Hybrid","Petrol"];
const transmissions = ["Automatic","Manual","Semi-Automatic"];


function BrowseCars() {
  const api = useApi();

  // filters state
  const [selectedMake, setSelectedMake] = useState([]);
  const [selectedBody, setSelectedBody] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState([]);
  const [selectedTransmission, setSelectedTransmission] = useState([]);
  const [price, setPrice] = useState(200000);

  // results state
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (value, list, setter) => {
    if (list.includes(value)) {
      setter(list.filter(v => v !== value));
    } else {
      setter([...list, value]);
    }
  };

  const clearAll = () => {
    setSelectedMake([]);
    setSelectedBody([]);
    setSelectedFuel([]);
    setSelectedTransmission([]);
    setPrice(200000);
  };


  const tagStyle = (active) =>
    `px-3 py-1 rounded-lg border cursor-pointer text-sm\n     ${active ? "bg-blue-100 border-blue-400" : "bg-gray-100"}`;


  // Fetch cars with dynamic query string
  const fetchCars = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (selectedMake.length)
        params.append("make", selectedMake.join(","));

      if (selectedBody.length)
        params.append("bodyType", selectedBody.join(","));

      if (selectedFuel.length)
        params.append("fuelType", selectedFuel.join(","));

      if (selectedTransmission.length)
        params.append("transmission", selectedTransmission.join(","));

      if (price)
        params.append("maxPrice", price);

      params.set("status", "active");

      const data = await api(`/api/vehicles?${params.toString()}`);
      setCars(data);
    } catch (err) {
      console.error("Search failed");
    }

    setLoading(false);
  };


  return (
    <div className="px-6 py-10 mx-auto max-w-7xl">

      <h1 className="mb-8 text-4xl font-bold text-blue-600">Browse Cars</h1>

      <div className="grid grid-cols-4 gap-8">

        {/* FILTERS */}
        <div className="col-span-1 p-5 space-y-6 bg-white shadow rounded-xl">

          <div className="flex items-center justify-between">
            <h2 className="font-bold">Filters</h2>
            <button onClick={clearAll} className="text-sm text-gray-500">Clear All</button>
          </div>

          {/* PRICE */}
          <div>
            <p className="mb-2 font-semibold">Price Range</p>
            <input
              type="range"
              min="10000"
              max="200000"
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-sm">
              <span>$10000</span>
              <span>${price}</span>
            </div>
          </div>

          {/* MAKE */}
          <div>
            <p className="mb-2 font-semibold">Make</p>
            <div className="flex flex-wrap gap-2">
              {makes.map(m => (
                <span
                  key={m}
                  className={tagStyle(selectedMake.includes(m))}
                  onClick={()=>toggle(m, selectedMake, setSelectedMake)}
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
                  className={tagStyle(selectedBody.includes(b))}
                  onClick={()=>toggle(b, selectedBody, setSelectedBody)}
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
                  className={tagStyle(selectedFuel.includes(f))}
                  onClick={()=>toggle(f, selectedFuel, setSelectedFuel)}
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
                  className={tagStyle(selectedTransmission.includes(t))}
                  onClick={()=>toggle(t, selectedTransmission, setSelectedTransmission)}
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