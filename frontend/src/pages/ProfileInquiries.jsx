import { useEffect, useState } from "react";
import { useApi } from "../lib/api";

function ProfileInquiries() {
  const api = useApi();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch seller's inquiries
        const data = await api("/api/vehicles/my/inquiries");
        if (Array.isArray(data)) {
          setInquiries(data);
        } else if (data && Array.isArray(data.items)) {
          setInquiries(data.items);
        } else {
          setInquiries([]);
        }

        await api("/api/vehicles/my/inquiries/read", {
          method: "PATCH",
        });
      } catch (err) {
        console.error("FETCH INQUIRIES ERROR:", err);
        setError("Failed to load inquiries. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [api]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Received Inquiries</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {inquiries.length} total
        </span>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-slate-600">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Vehicle</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2">Source</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-slate-500">No inquiries received yet.</td>
                </tr>
              )}

              {inquiries.map((inq) => (
                <tr key={inq._id || inq.id} className="border-t">
                  <td className="px-3 py-3 text-sm text-slate-700">{inq.createdAt ? new Date(inq.createdAt).toLocaleString("en-LK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{inq.vehicleTitle || inq.vehicle?.title || (inq.vehicleId ? inq.vehicleId : "-")}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{inq.name || "-"}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{inq.phone || "-"}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{inq.email || "-"}</td>
                  <td className="px-3 py-3 text-sm text-slate-700 max-w-[24rem] truncate">{inq.message || "-"}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{inq.source || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProfileInquiries;
