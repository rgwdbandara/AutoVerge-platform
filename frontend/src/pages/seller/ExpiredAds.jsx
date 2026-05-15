import { useEffect, useState } from "react";
import { useApi } from "../../lib/api";
import { useTranslation } from "react-i18next";

function ExpiredAds() {
  const api = useApi();
  const { t } = useTranslation();
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

      alert(t("seller.expiredAds.reactivated", { defaultValue: "Ad reactivated for another 30 days ✅" }));
      loadExpiredAds();
    } catch (err) {
      console.error(err);
      alert(t("seller.expiredAds.reactivateFailed", { defaultValue: "Failed to reactivate ad" }));
    }
  };

  if (loading) {
    return <p className="py-10 text-center text-slate-600 dark:text-slate-300">{t("seller.expiredAds.loading", { defaultValue: "Loading expired ads..." })}</p>;
  }

  return (
    <div className="text-slate-900 dark:text-white">
      <h1 className="mb-6 text-2xl font-semibold">{t("seller.expiredAds.title", { defaultValue: "Expired Ads" })}</h1>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors duration-300 dark:border-white/10 dark:bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-900 text-white dark:bg-slate-800">
            <tr>
              <th className="p-4 text-left">{t("common.no", { defaultValue: "No" })}</th>
              <th className="p-4 text-left">{t("common.image", { defaultValue: "Image" })}</th>
              <th className="p-4 text-left">{t("seller.expiredAds.vehicleName", { defaultValue: "Vehicle Name" })}</th>
              <th className="p-4 text-left">{t("seller.expiredAds.expireDate", { defaultValue: "Expire Date" })}</th>
              <th className="p-4 text-left">{t("common.options", { defaultValue: "Options" })}</th>
              <th className="p-4 text-left">{t("seller.expiredAds.reactivateAd", { defaultValue: "Reactivate Ad" })}</th>
            </tr>
          </thead>

          <tbody>
            {ads.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500 dark:text-slate-400">
                  {t("seller.expiredAds.none", { defaultValue: "No expired ads found" })}
                </td>
              </tr>
            ) : (
              ads.map((car, index) => (
                <tr key={car._id} className="border-b border-slate-200 dark:border-white/10">
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4">
                    <img
                      src={car.images?.[0]?.url || car.images?.[0] || "/no-car.png"}
                      alt={car.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                  </td>

                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    {car.title || `${car.brand} ${car.model}`}
                  </td>

                  <td className="p-4">
                    {car.expiresAt
                      ? new Date(car.expiresAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    Expired
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleReactivate(car._id)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                    >
                      {t("seller.expiredAds.reactivate", { defaultValue: "Reactivate" })}
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
