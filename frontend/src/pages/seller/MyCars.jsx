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
    return <p className="text-center">Loading...</p>;
  }

  // ❌ Empty
  if (!cars.length) {
    return (
      <div className="mt-20 text-center">
        <p className="mb-2 text-lg font-medium">
          You don't have any ads yet.
        </p>

        <button
          onClick={() => navigate("/seller/add-car")}
          className="px-6 py-3 text-white bg-gray-800 rounded-lg hover:bg-black"
        >
          POST YOUR AD
        </button>
      </div>
    );
  }

  // ✅ LIST VIEW
  return (
    <div className="w-full space-y-6">

      <h2 className="text-2xl font-semibold">My Listings</h2>

      {cars.map((car) => (
        <div
          key={car._id}
          onClick={() => navigate(`/cars/${car._id}`)}
          className="flex items-center justify-between w-full gap-6 p-6 transition bg-white border border-gray-100 shadow-sm cursor-pointer rounded-2xl hover:shadow-md"
        >

          {/* 🔹 LEFT - IMAGE */}
          <div className="flex items-center flex-1 min-w-0 gap-5">

            <img
              src={getPrimaryImage(car)}
              alt={car.model}
              className="object-cover w-40 bg-gray-100 h-28 rounded-xl"
            />

            {/* 🔹 DETAILS */}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold">
                {car.brand} {car.model}
              </h3>

              <p className="text-sm text-gray-500">
                {car.year} • {car.fuelType} • {car.transmission}
              </p>

              <p className="mt-1 font-bold text-blue-600">
                LKR {car.price?.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {car.location?.city}, {car.location?.district}
              </p>
            </div>

          </div>

          {/* 🔹 RIGHT - ACTIONS */}
          <div className="flex gap-3 shrink-0">

            <button
              onClick={(e) => handleEdit(e, car._id)}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Edit
            </button>

            <button
              onClick={(e) => handleDelete(e, car._id)}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
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
          className="w-full px-6 py-3 font-medium text-white transition bg-gray-800 rounded-lg hover:bg-black"
        >
          + POST NEW AD
        </button>
      </div>

    </div>
  );
}

export default MyCars;