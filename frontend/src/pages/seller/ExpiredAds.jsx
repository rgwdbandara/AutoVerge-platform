import { useEffect, useState } from "react";
import { useApi } from "../../lib/api";

function ExpiredAds() {
  const api = useApi();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadExpiredAds = async () => {
    try {
      const data = await api("/api/vehicles/my/expired");
      setAds(data);
    } catch (err) {
      console.error("Failed to load expired ads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpiredAds();
  }, []);

  const handleReactivate = async (id) => {
    try {
      await api(`/api/vehicles/${id}/reactivate`, {
        method: "PATCH",
      });

      alert("Ad reactivated for another 30 days ✅");
      loadExpiredAds();
    } catch (err) {
      console.error(err);
      alert("Failed to reactivate ad");
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading expired ads...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Expired Ads</h1>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Vehicle Name</th>
              <th className="p-4 text-left">Expire Date</th>
              <th className="p-4 text-left">Options</th>
              <th className="p-4 text-left">Reactivate Ad</th>
            </tr>
          </thead>

          <tbody>
            {ads.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No expired ads found
                </td>
              </tr>
            ) : (
              ads.map((car, index) => (
                <tr key={car._id} className="border-b">
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4">
                    <img
                      src={car.images?.[0]?.url || car.images?.[0] || "/no-car.png"}
                      alt={car.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                  </td>

                  <td className="p-4 font-medium">
                    {car.title || `${car.brand} ${car.model}`}
                  </td>

                  <td className="p-4">
                    {car.expiresAt
                      ? new Date(car.expiresAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="p-4 text-gray-600">
                    Expired
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleReactivate(car._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Reactivate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpiredAds;
