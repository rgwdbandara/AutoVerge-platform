import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, BadgeCheck, Ban, CarFront, Clock3, ImageOff, Loader } from "lucide-react";

function ImportedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState(null);

  const fetchListings = async () => {
    try {
      const response = await axios.get("http://localhost:5005/api/imported");
      setListings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch imported listings", error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handlePublish = async (id) => {
    try {
      setPublishingId(id);
      const response = await axios.post(`http://localhost:5005/api/imported/publish/${id}`);
      
      // Remove the published card from the list
      setListings((prev) => prev.filter((listing) => listing._id !== id));
      
      alert(`✅ Car published successfully!\n${response.data?.vehicle?.title}`);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to publish listing";
      alert(`❌ ${errorMsg}`);
      console.error("Failed to publish imported listing", error);
    } finally {
      setPublishingId(null);
    }
  };

  const handleIgnore = async (id) => {
    try {
      await axios.post(`http://localhost:5005/api/imported/ignore/${id}`);
      await fetchListings();
    } catch (error) {
      console.error("Failed to ignore imported listing", error);
    }
  };

  const getImage = (listing) => listing?.images?.[0]?.url || listing?.images?.[0] || "";

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center text-slate-500">
        Loading imported cars...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-semibold tracking-tight text-slate-900">
          Imported Cars
        </h1>
        <p className="text-sm text-slate-500">
          Review scraped listings, publish approved cars, or ignore duplicates.
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[18px] border border-dashed border-slate-200 bg-slate-50 text-center text-slate-500">
          <Clock3 className="w-8 h-8 mb-3 text-slate-400" />
          <p className="text-lg font-medium text-slate-700">No imported cars yet</p>
          <p className="max-w-sm mt-1 text-sm">
            New scraped listings will appear here for review before you publish them to the marketplace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <article
              key={listing._id}
              className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="relative aspect-[16/10] bg-slate-100">
                {getImage(listing) ? (
                  <img
                    src={getImage(listing)}
                    alt={listing.title || `${listing.brand || ""} ${listing.model || ""}`.trim() || "Imported car"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-slate-400">
                    <ImageOff className="w-8 h-8" />
                  </div>
                )}

                <div className="absolute px-3 py-1 text-xs font-medium rounded-full left-4 top-4 bg-white/90 text-slate-700 backdrop-blur">
                  Imported
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold line-clamp-2 text-slate-900">
                    {listing.title || `${listing.brand || ""} ${listing.model || ""}`.trim() || "Untitled Listing"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {listing.brand || "Brand"} {listing.model ? `• ${listing.model}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CarFront className="w-4 h-4 text-slate-400" />
                  <span>
                    {listing.year || "-"} • {listing.mileage ? `${Number(listing.mileage).toLocaleString()} km` : "Mileage N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-[14px] bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Price</span>
                  <span className="text-lg font-semibold text-slate-900">
                    LKR {Number(listing.price || 0).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handlePublish(listing._id)}
                    disabled={publishingId === listing._id}
                    className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#2563eb] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {publishingId === listing._id ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="w-4 h-4" />
                        Publish
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleIgnore(listing._id)}
                    disabled={publishingId === listing._id}
                    className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#ff5a5f] px-4 py-3 text-sm font-medium text-[#ff5a5f] transition hover:bg-[#fff5f5] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Ban className="w-4 h-4" />
                    Ignore
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{listing.source || "Imported listing"}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImportedListings;