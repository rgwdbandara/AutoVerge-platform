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
      <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
        My Account
      </h2>

      {/* STATS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 transition-colors duration-300 dark:border-blue-400/20 dark:bg-blue-500/10">
          <p className="text-sm text-slate-600 dark:text-slate-300">Total Ads</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-300">{totalAds}</h3>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-5 transition-colors duration-300 dark:border-green-400/20 dark:bg-green-500/10">
          <p className="text-sm text-slate-600 dark:text-slate-300">Active Ads</p>
          <h3 className="mt-2 text-3xl font-bold text-green-600 dark:text-green-300">{activeAds}</h3>
        </div>

        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 transition-colors duration-300 dark:border-orange-400/20 dark:bg-orange-500/10">
          <p className="text-sm text-slate-600 dark:text-slate-300">Expired Ads</p>
          <h3 className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-300">{expiredAds}</h3>
        </div>

      </div>

      {/* EMPTY STATE */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 sm:p-10">

        <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
          You don't have any ads yet.
        </h3>

        <p className="mb-5 text-slate-500 dark:text-slate-400">
          Start selling your vehicle today 🚗
        </p>

        <button
          onClick={() => navigate("/seller/add-car")}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Post Your Ad
        </button>

      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <button
          onClick={() => navigate("/seller/add-car")}
          className="rounded-lg bg-slate-100 p-4 transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          ➕ Add Vehicle
        </button>

        <button
          onClick={() => navigate("/profile/my-cars")}
          className="rounded-lg bg-slate-100 p-4 transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          📋 My Listings
        </button>

        <button
          onClick={() => navigate("/profile/manage")}
          className="rounded-lg bg-slate-100 p-4 transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          ⚙ Manage Profile
        </button>

      </div>

    </div>
  );
}

export default MyAccount;