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
    return <div className="p-6 text-slate-600 dark:text-slate-300">Loading pending ads...</div>;
  }

  return (
    <div className="p-6 text-slate-900 dark:text-white">
      <h1 className="mb-6 text-2xl font-bold">Pending Ads</h1>

      {ads.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No pending ads</p>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div
              key={ad._id}
              onClick={() => navigate(`/admin/car/${ad._id}`)}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow transition-colors duration-300 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-4">
                <img
                  src={getImage(ad)}
                  alt={ad.title}
                  className="object-cover w-24 h-20 rounded-lg"
                />

                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{ad.title || `${ad.brand} ${ad.model}`}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Seller: {ad.sellerClerkId}</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">LKR {ad.price?.toLocaleString?.() || ad.price}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(ad._id);
                  }}
                  className="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                >
                  Approve
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(ad._id);
                  }}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
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
