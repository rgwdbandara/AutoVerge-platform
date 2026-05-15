import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../lib/api";

function PendingAds() {
  const api = useApi();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingCars = useCallback(async () => {
    try {
      const data = await api("/api/vehicles/my/pending");
      setCars(data);
    } catch (err) {
      console.error("Failed to fetch pending cars:", err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchPendingCars();
  }, [fetchPendingCars]);

  if (loading) {
    return <p className="py-10 text-center text-slate-600 dark:text-slate-300">Loading pending ads...</p>;
  }

  return (
    <div className="text-slate-900 dark:text-white">
      <h2 className="mb-6 text-2xl font-semibold">Pending Ads</h2>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors duration-300 dark:border-white/10 dark:bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-900 text-white dark:bg-slate-800">
            <tr>
              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Vehicle Name</th>
              <th className="p-4 text-left">Published Date</th>
              <th className="p-4 text-left">Options</th>
            </tr>
          </thead>

          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No pending ads.
                </td>
              </tr>
            ) : (
              cars.map((car, index) => {
                const imageSrc = car.images?.[0]?.url || car.images?.[0] || "/no-car.png";
                return (
                  <tr key={car._id} className="border-b border-slate-200 dark:border-white/10">
                    <td className="p-4">{index + 1}</td>

                    <td className="p-4">
                      <img
                        src={imageSrc}
                        alt={car.title || `${car.brand} ${car.model}`}
                        className="object-cover w-20 h-14 rounded"
                      />
                    </td>

                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                      {car.title || `${car.brand} ${car.model}`}
                    </td>

                    <td className="p-4">
                      {new Date(car.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300">
                        Waiting for approval
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PendingAds;
