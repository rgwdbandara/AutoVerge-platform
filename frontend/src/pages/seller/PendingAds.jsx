import { useEffect, useState } from "react";
import { useApi } from "../../lib/api";

function PendingAds() {
  const api = useApi();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingCars = async () => {
    try {
      const data = await api("/api/vehicles/my/pending");
      setCars(data);
    } catch (err) {
      console.error("Failed to fetch pending cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCars();
  }, []);

  if (loading) {
    return <p className="py-10 text-center">Loading pending ads...</p>;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Pending Ads</h2>

      <div className="overflow-hidden border rounded-xl">
        <table className="w-full">
          <thead className="text-white bg-slate-900">
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
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No pending ads.
                </td>
              </tr>
            ) : (
              cars.map((car, index) => {
                const imageSrc = car.images?.[0]?.url || car.images?.[0] || "/no-car.png";
                return (
                  <tr key={car._id} className="border-b">
                    <td className="p-4">{index + 1}</td>

                    <td className="p-4">
                      <img
                        src={imageSrc}
                        alt={car.title || `${car.brand} ${car.model}`}
                        className="object-cover w-20 h-14 rounded"
                      />
                    </td>

                    <td className="p-4 font-medium">
                      {car.title || `${car.brand} ${car.model}`}
                    </td>

                    <td className="p-4">
                      {new Date(car.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 text-xs text-yellow-700 bg-yellow-100 rounded-full">
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
