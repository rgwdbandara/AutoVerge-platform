import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../lib/api";
import { ArrowRight, CircleAlert, CarFront, CircleCheckBig, Clock3 } from "lucide-react";

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

function AdminDashboard() {
  const api = useApi();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
  });

  const [pendingAds, setPendingAds] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, pendingData] = await Promise.all([
          api("/api/admin/stats"),
          api("/api/admin/pending"),
        ]);

        setStats({
          total: Number(statsData?.total) || 0,
          active: Number(statsData?.active) || 0,
          pending: Number(statsData?.pending) || 0,
          rejected: Number(statsData?.rejected) || 0,
        });

        const pendingList = Array.isArray(pendingData)
          ? pendingData
          : Array.isArray(pendingData?.vehicles)
          ? pendingData.vehicles
          : [];

        setPendingAds(pendingList);
      } catch (error) {
        console.error("Failed to load admin dashboard data", error);
      }
    };

    loadDashboard();
  }, [api]);

  const chartData = [
    { name: "Active", value: Number(stats.active) || 0 },
    { name: "Pending", value: Number(stats.pending) || 0 },
    { name: "Rejected", value: Number(stats.rejected) || 0 },
  ];

  const pendingList = Array.isArray(pendingAds) ? pendingAds : [];
  const chartTotal = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <CarFront className="h-4 w-4" />
            <p>Total Cars</p>
          </div>
          <h1 className="text-[32px] font-bold text-slate-900">{stats.total}</h1>
        </div>

        <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <CircleCheckBig className="h-4 w-4" />
            <p>Active</p>
          </div>
          <h1 className="text-[32px] font-bold text-[#16a34a]">{stats.active}</h1>
        </div>

        <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Clock3 className="h-4 w-4" />
            <p>Pending</p>
          </div>
          <h1 className="text-[32px] font-bold text-[#f59e0b]">{stats.pending}</h1>
        </div>

        <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <CircleAlert className="h-4 w-4" />
            <p>Rejected</p>
          </div>
          <h1 className="text-[32px] font-bold text-[#ef4444]">{stats.rejected}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Ad Distribution</h2>

          {chartTotal > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-slate-400">
              No data available yet
            </div>
          )}
        </div>

        <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Pending Ads (Quick Review)</h2>

          {pendingList.length === 0 ? (
            <div className="py-10 text-center text-slate-400">No pending ads</div>
          ) : (
            pendingList.slice(0, 5).map((car) => (
              <div
                key={car._id}
                onClick={() => navigate(`/admin/car/${car._id}`)}
                className="mb-3 flex cursor-pointer items-center justify-between rounded-[14px] border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={car.images?.[0]?.url || car.images?.[0] || "/no-car.png"}
                    alt={car.title || car.model || "Car"}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-slate-900">
                      {car.title || `${car.make || car.brand || ""} ${car.model || ""}`.trim()}
                    </p>
                    <p className="text-sm text-slate-500">
                      {car.year || "-"} • LKR {car.price?.toLocaleString?.() || car.price || 0}
                    </p>
                    <p className="text-xs text-slate-400">
                      {car.userName || "Seller"} • {car.status || "pending"}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;