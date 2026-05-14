import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../lib/api";

function AdminCars() {
  const api = useApi();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await api("/api/admin/all");
        setCars(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load admin cars", error);
      }
    };

    fetchCars();
  }, [api]);

  const filteredCars = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cars;

    return cars.filter((car) => {
      const name = `${car?.title || ""} ${car?.brand || ""} ${car?.model || ""}`.toLowerCase();
      return name.includes(q);
    });
  }, [cars, search]);

  const getImage = (car) => car?.images?.[0]?.url || car?.images?.[0] || "/no-car.png";

  const handleView = (id) => {
    navigate(`/admin/car/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this listing permanently?");
    if (!confirmed) return;

    try {
      await api(`/api/admin/delete/${id}`, { method: "DELETE" });
      setCars((prev) => prev.filter((car) => car._id !== id));
      setOpenMenuId(null);
    } catch {
      alert("Failed to delete listing");
    }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cars Management</h1>

        <input
          placeholder="Search cars..."
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 transition-colors duration-300 placeholder:text-slate-400 dark:border-white/10 dark:bg-slate-900 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="p-3 text-left">Car</th>
              <th>Year</th>
              <th>Price</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCars.map((car) => (
              <tr key={car._id} className="border-t border-slate-200 dark:border-white/10">
                <td className="flex items-center gap-3 p-3">
                  <img
                    src={getImage(car)}
                    alt={car.title || `${car.brand || ""} ${car.model || ""}`.trim()}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="text-slate-900 dark:text-white">{car.title || `${car.brand || ""} ${car.model || ""}`.trim()}</div>
                </td>

                <td>{car.year || "-"}</td>
                <td>LKR {car.price?.toLocaleString?.() || car.price || 0}</td>

                <td>
                  <span
                    className={`rounded px-2 py-1 text-sm ${
                      car.status === "active"
                        ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-300"
                        : car.status === "pending"
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-300"
                        : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                    }`}
                  >
                    {car.status}
                  </span>
                </td>

                <td>{car.featured ? "⭐" : "-"}</td>

                <td className="relative">
                  <button
                    onClick={() => setOpenMenuId((prev) => (prev === car._id ? null : car._id))}
                    className="rounded border border-slate-200 px-3 py-1 text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    ⋮
                  </button>

                  {openMenuId === car._id && (
                    <div className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-slate-900">
                      <button
                        onClick={() => handleView(car._id)}
                        className="block w-full px-4 py-2 text-left text-slate-900 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCars;
