import { useNavigate } from "react-router-dom";
import { useApi } from "../lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

function MyAccount() {
  const navigate = useNavigate();
  const api = useApi();
  const { userId } = useAuth();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchMyCars = async () => {
      try {
        const data = await api("/api/vehicles/my");
        const myCars = Array.isArray(data)
          ? data.filter((car) => car.sellerClerkId === userId)
          : [];
        setCars(myCars);
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    };

    if (userId) {
      fetchMyCars();
    }
  }, [api, userId]);

  const totalAds = cars.length;
  const activeAds = cars.filter(
    (car) => car.status === "active" && (!car.expiresAt || new Date(car.expiresAt) > new Date())
  ).length;
  const expiredAds = cars.filter(
    (car) => car.expiresAt && new Date(car.expiresAt) <= new Date()
  ).length;

  return (
    <div>

      {/* TITLE */}
      <h2 className="mb-6 text-2xl font-semibold">
        My Account
      </h2>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">

        <div className="p-5 border border-blue-200 bg-blue-50 rounded-xl">
          <p className="text-sm text-gray-600">Total Ads</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600">{totalAds}</h3>
        </div>

        <div className="p-5 border border-green-200 bg-green-50 rounded-xl">
          <p className="text-sm text-gray-600">Active Ads</p>
          <h3 className="mt-2 text-3xl font-bold text-green-600">{activeAds}</h3>
        </div>

        <div className="p-5 border border-orange-200 bg-orange-50 rounded-xl">
          <p className="text-sm text-gray-600">Expired Ads</p>
          <h3 className="mt-2 text-3xl font-bold text-orange-600">{expiredAds}</h3>
        </div>

      </div>

      {/* EMPTY STATE */}
      <div className="p-10 text-center bg-white shadow rounded-xl">

        <h3 className="mb-2 text-lg font-semibold">
          You don't have any ads yet.
        </h3>

        <p className="mb-5 text-gray-500">
          Start selling your vehicle today 🚗
        </p>

        <button
          onClick={() => navigate("/seller/add-car")}
          className="px-6 py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Post Your Ad
        </button>

      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-3 gap-4 mt-8">

        <button
          onClick={() => navigate("/seller/add-car")}
          className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          ➕ Add Vehicle
        </button>

        <button
          onClick={() => navigate("/profile/my-cars")}
          className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          📋 My Listings
        </button>

        <button
          onClick={() => navigate("/profile/manage")}
          className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          ⚙ Manage Profile
        </button>

      </div>

    </div>
  );
}

export default MyAccount;