import { useNavigate } from "react-router-dom";
import { useApi } from "../lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { BadgeCheck, Eye, Fuel, Gauge, ImageOff, MessageSquareText, Plus, Sparkles } from "lucide-react";

function MyAccount() {
  const navigate = useNavigate();
  const api = useApi();
  const { userId } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCars = async () => {
      try {
        const data = await api("/api/vehicles/my-listings");
        const myCars = Array.isArray(data)
          ? data.filter((car) => car.sellerClerkId === userId)
          : [];
        setCars(myCars);
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
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

  const getStatusMeta = (car) => {
    const expired = car.expiresAt && new Date(car.expiresAt) <= new Date();
    if (expired) {
      return { label: "Expired", classes: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300" };
    }

    if (car.status === "pending") {
      return { label: "Pending", classes: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300" };
    }

    return { label: "Active", classes: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300" };
  };

  const getPrimaryImage = (car) => {
    const first = car?.images?.[0];
    if (!first) return null;
    return typeof first === "string" ? first : first.url;
  };

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

      {/* RECENT LISTINGS / EMPTY STATE */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 sm:p-8">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                <div className="h-24 w-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="h-5 w-56 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                  <div className="h-4 w-36 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : cars.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/90 sm:p-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
                <Sparkles size={12} /> Recent Listings
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                Your latest ads at a glance
              </h3>
            </div>

            <button
              onClick={() => navigate("/profile/my-cars")}
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200 md:inline-flex"
            >
              View all
            </button>
          </div>

          <div className="space-y-4">
            {cars.slice(0, 6).map((car) => {
              const primaryImage = getPrimaryImage(car);
              const statusMeta = getStatusMeta(car);
              const year = car.year || "N/A";
              const fuelType = car.fuelType || "N/A";
              const title = car.title || `${car.brand || "Vehicle"} ${car.model || ""}`.trim();

              return (
                <button
                  key={car._id}
                  type="button"
                  onClick={() => navigate(`/cars/${car._id}`)}
                  className="group w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-[#111827]"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5 sm:w-40">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <ImageOff size={18} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                              {car.brand || "Vehicle"}
                            </p>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusMeta.classes}`}>
                              {statusMeta.label}
                            </span>
                          </div>

                          <h4 className="mt-1 truncate text-lg font-semibold text-slate-900 dark:text-white">
                            {title}
                          </h4>

                          <p className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-300">
                            LKR {Number(car.price || 0).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/5">{year}</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/5">{fuelType}</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/5">{car.transmission || "N/A"}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-2 dark:bg-white/5">
                          <Eye size={12} /> Views: <span className="font-semibold text-slate-900 dark:text-white">{car.viewCount || 0}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-2 dark:bg-white/5">
                          <MessageSquareText size={12} /> Inquiries: <span className="font-semibold text-slate-900 dark:text-white">{car.inquiryCount || 0}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-2 dark:bg-white/5">
                          <Gauge size={12} /> Status: <span className="font-semibold text-slate-900 dark:text-white">{car.status || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex justify-end md:hidden">
            <button
              onClick={() => navigate("/profile/my-cars")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              View all listings
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-lg transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 sm:p-10">

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
      )}

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