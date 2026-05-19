import { useNavigate } from "react-router-dom";
import { useApi } from "../lib/api";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Bell,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  History,
  ImageOff,
  List,
  Plus,
  Sparkles,
  Timer,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

function MyAccount() {
  const navigate = useNavigate();
  const api = useApi();
  const { userId } = useAuth();
  const [cars, setCars] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCars = async () => {
      try {
        const data = await api("/api/vehicles/my");
        const myCars = Array.isArray(data) ? data : [];
        setCars(myCars);

        const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavoriteIds(Array.isArray(favs) ? favs : []);

        if (Array.isArray(favs) && favs.length) {
          const limited = favs.slice(0, 4);
          const favoriteResults = await Promise.all(
            limited.map((id) => api(`/api/vehicles/${id}`).catch(() => null))
          );
          setFavoriteCars(favoriteResults.filter(Boolean));
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchMyCars();
  }, [api, userId]);

  const getPrimaryImage = (car) => {
    const first = car?.images?.[0];
    if (!first) return null;
    return typeof first === "string" ? first : first.url;
  };

  const recentActivity = useMemo(
    () => [...cars]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
      .slice(0, 4),
    [cars]
  );

  const totalListings = cars.length;
  const pendingListings = cars.filter((car) => car.status === "pending").length;
  const soldVehicles = cars.filter((car) => car.status === "sold").length;
  const totalViews = cars.reduce((sum, car) => sum + Number(car.viewCount || 0), 0);
  const favoritesCount = favoriteIds.length;
  const pieData = [
    { name: "Pending Listings", value: pendingListings, color: "#f59e0b" },
    { name: "Favorites", value: favoritesCount, color: "#ec4899" },
  ].filter((item) => item.value > 0);

  const statCards = [
    { title: "Total Listings", value: totalListings, icon: List, gradient: "from-blue-500 to-indigo-600" },
    { title: "Pending Listings", value: pendingListings, icon: Clock, gradient: "from-amber-400 to-orange-500" },
    { title: "Favorites", value: favoritesCount, icon: Heart, gradient: "from-pink-500 to-rose-500" },
    { title: "Sold Vehicles", value: soldVehicles, icon: CheckCircle2, gradient: "from-emerald-400 to-green-600" },
    { title: "Total Views", value: totalViews, icon: Eye, gradient: "from-slate-500 to-slate-700" },
  ];

  const statusBadge = (car) => {
    if (car.status === "sold") return { label: "Sold", classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" };
    if (car.status === "pending") return { label: "Pending", classes: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" };
    return { label: "Active", classes: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300" };
  };

  const formatPrice = (price) => `LKR ${Number(price || 0).toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
            <Sparkles size={12} /> Marketplace Overview
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">My Account</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/seller/add-car")}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus size={16} /> Post Vehicle
          </button>
          <button
            onClick={() => navigate("/profile/my-cars")}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            <List size={16} /> Manage Listings
          </button>
          <button
            onClick={() => navigate("/profile/favorites")}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Heart size={16} /> View Favorites
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl`}>
              <div className="absolute inset-0 transition opacity-0 bg-white/5 group-hover:opacity-100" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white/85">{card.title}</p>
                  <p className="mt-2 text-3xl font-semibold leading-none">{card.value}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm">
                  <Icon size={20} />
                </div>
              </div>
              <div className="absolute rounded-full pointer-events-none -right-8 -top-8 h-28 w-28 bg-white/10 blur-2xl" />
            </div>
          );
        })}
      </section>

      {loading ? (
        <div className="p-6 bg-white border shadow-lg rounded-3xl border-slate-200 dark:border-white/10 dark:bg-slate-900/90">
          <div className="w-48 h-6 rounded-full animate-pulse bg-slate-200 dark:bg-slate-700" />
          <div className="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-2">
            <div className="h-36 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-36 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="p-5 border shadow-lg rounded-3xl border-slate-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/90 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
                    <PieChart size={12} /> Listing Overview
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Favorites vs Pending</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="relative h-[280px] rounded-3xl bg-slate-50 p-3 dark:bg-white/5">
                  {pieData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={78}
                          outerRadius={110}
                          paddingAngle={4}
                          strokeWidth={0}
                        >
                          {pieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm border border-dashed rounded-3xl border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-400">
                      No pending or favorite data yet.
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Overview</p>
                      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{pendingListings + favoritesCount}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Pending + Favorites</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Pending Listings</p>
                    <p className="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-300">{pendingListings}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Favorites</p>
                    <p className="mt-1 text-2xl font-semibold text-pink-600 dark:text-pink-300">{favoritesCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border shadow-lg rounded-3xl border-slate-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/90 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
                    <Heart size={12} /> Favorite Vehicles Preview
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Saved vehicles at a glance</h3>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-pink-700 bg-pink-100 rounded-full dark:bg-pink-500/10 dark:text-pink-300">{favoritesCount} saved</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {favoriteCars.length ? favoriteCars.map((car) => {
                  const image = getPrimaryImage(car);
                  const title = car.title || `${car.brand || "Vehicle"} ${car.model || ""}`.trim();

                  return (
                    <div key={car._id} className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5">
                      <div className="h-20 overflow-hidden w-28 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800">
                        {image ? <img src={image} alt={title} className="object-cover w-full h-full" /> : <div className="flex items-center justify-center w-full h-full text-slate-400"><ImageOff size={18} /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate text-slate-900 dark:text-white">{title}</h4>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatPrice(car.price)}</p>
                        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                          <Heart size={12} className="text-pink-500" /> Saved
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="p-6 text-sm border border-dashed rounded-2xl border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 sm:col-span-2">
                    No favorites yet. Add vehicles to your favorites list to preview them here.
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="p-5 border shadow-lg rounded-3xl border-slate-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
                    <Timer size={12} /> Recent Activity
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Latest dashboard activity</h3>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {recentActivity.length ? recentActivity.map((car) => {
                  const badge = statusBadge(car);
                  const title = car.title || `${car.brand || "Vehicle"} ${car.model || ""}`.trim();

                  return (
                    <div key={car._id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5">
                      <div className="flex items-center justify-center w-10 h-10 bg-white shadow-sm shrink-0 rounded-xl dark:bg-slate-900">
                        <TrendingUp size={16} className="text-slate-500 dark:text-slate-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate text-slate-900 dark:text-white">{title}</p>
                          <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${badge.classes}`}>{badge.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Updated {car.updatedAt ? new Date(car.updatedAt).toLocaleDateString() : "recently"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="rounded-full bg-white px-2.5 py-1 dark:bg-slate-900">{car.viewCount || 0} views</span>
                          <span className="rounded-full bg-white px-2.5 py-1 dark:bg-slate-900">{car.inquiryCount || 0} inquiries</span>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="p-6 text-sm border border-dashed rounded-2xl border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                    No recent activity yet.
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border shadow-lg rounded-3xl border-slate-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
              <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
                <Bell size={12} /> Quick Actions
              </p>
              <div className="mt-4 space-y-3">
                <button
                  onClick={() => navigate("/seller/add-car")}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-left text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Post Vehicle
                </button>
                <button
                  onClick={() => navigate("/profile/my-cars")}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  Manage Listings
                </button>
                <button
                  onClick={() => navigate("/profile/favorites")}
                  className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-left text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  View Favorites
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default MyAccount;