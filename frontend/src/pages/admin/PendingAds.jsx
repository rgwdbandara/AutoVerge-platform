import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../lib/api";

function PendingAds() {
  const api = useApi();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAds = async () => {
    try {
      const res = await api("/api/admin/pending-ads");
      setAds(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleApprove = async (id) => {
    await api(`/api/admin/approve/${id}`, { method: "PUT" });
    setAds((prev) => prev.filter((ad) => ad._id !== id));
  };

  const handleReject = async (id) => {
    await api(`/api/admin/reject/${id}`, { method: "PUT" });
    setAds((prev) => prev.filter((ad) => ad._id !== id));
  };

  const getImage = (ad) => ad?.images?.[0]?.url || ad?.images?.[0] || "/no-car.png";

  if (loading) {
    return <div className="p-6">Loading pending ads...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Pending Ads</h1>

      {ads.length === 0 ? (
        <p>No pending ads</p>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div
              key={ad._id}
              onClick={() => navigate(`/admin/car/${ad._id}`)}
              className="flex items-center justify-between p-4 transition bg-white shadow cursor-pointer rounded-xl hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <img
                  src={getImage(ad)}
                  alt={ad.title}
                  className="object-cover w-24 h-20 rounded-lg"
                />

                <div>
                  <h2 className="text-lg font-semibold">{ad.title || `${ad.brand} ${ad.model}`}</h2>
                  <p className="text-sm text-gray-500">Seller: {ad.sellerClerkId}</p>
                  <p className="font-bold text-blue-600">LKR {ad.price?.toLocaleString?.() || ad.price}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(ad._id);
                  }}
                  className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                >
                  Approve
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(ad._id);
                  }}
                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingAds;
