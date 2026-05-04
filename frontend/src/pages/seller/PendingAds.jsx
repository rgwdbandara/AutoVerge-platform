import { useEffect, useState } from "react";
import axios from "axios";

function PendingAdsSection() {
  const [listings, setListings] = useState([]);

  const fetchImported = async () => {
    try {
      const res = await axios.get("http://localhost:5005/api/imported");
      setListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImported();
  }, []);

  const handleApprove = (id) => {
    // 👉 redirect to add-car (auto-fill)
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = `/seller/add-car?importId=${id}`;
  };

  const handleIgnore = async (id) => {
    try {
      await axios.post(
        `http://localhost:5005/api/imported/ignore/${id}`
      );
      fetchImported();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl">
      <h3 className="mb-4 text-lg font-semibold">
        Pending Ads (Imported)
      </h3>

      <div className="space-y-3">

        {listings.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">

              <img
                src={item.images?.[0]?.url || "https://via.placeholder.com/80"}
                className="object-cover w-16 h-16 rounded"
              />

              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">
                  {item.year} • LKR {item.price?.toLocaleString()}
                </p>

                <span className="text-xs text-blue-500">
                  Source: {item.source}
                </span>
              </div>
            </div>

            <div className="flex gap-2">

              <button
                onClick={() => handleApprove(item._id)}
                className="px-3 py-1 text-white bg-green-500 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => handleIgnore(item._id)}
                className="px-3 py-1 text-white bg-red-500 rounded"
              >
                Ignore
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default PendingAdsSection;