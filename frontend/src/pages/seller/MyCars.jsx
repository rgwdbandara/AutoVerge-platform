import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

function MyCars() {
  const api = useApi();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCars = useCallback(async () => {
    try {
      const data = await api("/api/vehicles/my");
      const myCars = Array.isArray(data)
        ? data.filter((car) => car.sellerClerkId === userId)
        : [];
      setCars(myCars);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  }, [api, userId]);

  useEffect(() => {
    fetchMyCars();
  }, [fetchMyCars]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await api(`/api/vehicles/${id}`, {
        method: "DELETE",
      });
      fetchMyCars();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/seller/edit-car/${id}`);
  };

  const getPrimaryImage = (car) => {
    const first = car?.images?.[0];
    if (!first) return "https://via.placeholder.com/320x220";
    return typeof first === "string" ? first : first.url;
  };

  // 🔄 Loading
  if (loading) {
    return <p className="text-center text-slate-600 dark:text-slate-300">Loading...</p>;
  }

  // ❌ Empty
  if (!cars.length) {
    return (
      <div className="mt-20 text-center text-slate-900 dark:text-white">
        <p className="mb-2 text-lg font-medium">
          You don't have any ads yet.
        </p>

        <button
          onClick={() => navigate("/seller/add-car")}
          className="rounded-lg bg-slate-900 px-6 py-3 text-white transition hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          POST YOUR AD
        </button>
      </div>
    );
  }

  // ✅ LIST VIEW
  return (
    <div className="w-full space-y-6 text-slate-900 dark:text-white">

      <h2 className="text-2xl font-semibold">My Listings</h2>

      {cars.map((car) => (
        <div
          key={car._id}
          onClick={() => navigate(`/cars/${car._id}`)}
          className="flex w-full items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900"
        >

          {/* 🔹 LEFT - IMAGE */}
          <div className="flex items-center flex-1 min-w-0 gap-5">

            <img
              src={getPrimaryImage(car)}
              alt={car.model}
              className="h-28 w-40 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
            />

            {/* 🔹 DETAILS */}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold">
                {car.brand} {car.model}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                {car.year} • {car.fuelType} • {car.transmission}
              </p>

              <p className="mt-1 font-bold text-blue-600 dark:text-blue-400">
                LKR {car.price?.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                {car.location?.city}, {car.location?.district}
              </p>
            </div>

          </div>

          {/* 🔹 RIGHT - ACTIONS */}
          <div className="flex shrink-0 gap-3">

            <button
              onClick={(e) => handleEdit(e, car._id)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Edit
            </button>

            <button
              onClick={(e) => handleDelete(e, car._id)}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
            >
              Delete
            </button>

          </div>

        </div>
      ))}

      {/* ADD NEW AD BUTTON */}
      <div className="mt-8">
        <button
          onClick={() => navigate("/seller/add-car")}
          className="w-full rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          + POST NEW AD
        </button>
      </div>

    </div>
  );
}

export default MyCars;