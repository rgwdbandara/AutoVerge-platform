import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useUser } from "@clerk/clerk-react";
import { MapPin } from "lucide-react";
import { useParams } from "react-router-dom";
import { useApi } from "../lib/api";
import EMIModal from "../components/finance/EMIModal";
import PriceEstimateCard from "../components/price/PriceEstimateCard";
import RelatedCars from "../components/cars/RelatedCars";
import SellerContactCard from "../components/cars/SellerContactCard";

const getGradeColor = (grade) => {
  if (grade === "A") return "bg-green-100 text-green-700";
  if (grade === "B") return "bg-blue-100 text-blue-700";
  if (grade === "C") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

const getTrustColor = (trust) => {
  if (trust === "High") return "bg-green-100 text-green-700";
  if (trust === "Medium") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

// eslint-disable-next-line no-unused-vars
const buildDefaultInquiryMessage = (vehicle, listingId) => {
  return `Hello,\n\nI am very interested in the ${vehicle?.year || ""} ${vehicle?.title || "vehicle"} listed on AutoVerge.\n\nCould you please provide more information about the vehicle's condition, service history, and any available financing options?\n\nI look forward to hearing from you soon.\n\nThank you!`;
};

function CarDetails() {
  const { id } = useParams();
  const { user, isLoaded } = useUser();
  const api = useApi();
  const [car, setCar] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [showEMI, setShowEMI] = useState(false);
  const [showFinanceInfo, setShowFinanceInfo] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    hasTradeIn: false,
    message: "",
    budget: "",
    consentToUpdates: true,
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [shareSuccess, setShareSuccess] = useState("");
  const fallbackImage = "https://via.placeholder.com/800x500";

  useEffect(() => {
    if (!isLoaded || !user) return;

    const userName = user.fullName || user.firstName || user.username || "";

    if (userName) {
      setInquiryForm((prev) => ({
        ...prev,
        name: prev.name || userName,
      }));
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const loadCar = async () => {
      const data = await api(`/api/vehicles/${id}`);
      console.log("CAR DETAILS DATA:", data);
      const firstImage = data?.images?.[0];
      const firstImageUrl =
        typeof firstImage === "string" ? firstImage : firstImage?.url;
      setCar(data);
      setActiveImage(firstImageUrl || fallbackImage);
      setInquiryForm((prev) => ({
        ...prev,
        message: prev.message || buildDefaultInquiryMessage(data, id),
      }));
    };
    loadCar();
  }, [id, api]);

  const submitInquiry = async () => {
    try {
      setInquiryError("");
      setInquirySuccess("");

      if (!inquiryForm.name.trim() || !inquiryForm.email.trim() || !inquiryForm.phone.trim()) {
        setInquiryError("Please fill name, email and phone.");
        return;
      }

      const finalMessage = inquiryForm.message.trim() || buildDefaultInquiryMessage(car, id);

      if (!finalMessage) {
        setInquiryError("Please add your message.");
        return;
      }

      setInquirySubmitting(true);

      await api(`/api/vehicles/${id}/inquiries`, {
        method: "POST",
        body: JSON.stringify({
          name: inquiryForm.name.trim(),
          email: inquiryForm.email.trim(),
          phone: inquiryForm.phone.trim(),
          budget: inquiryForm.budget ? Number(String(inquiryForm.budget).replace(/,/g, "")) : null,
          hasTradeIn: inquiryForm.hasTradeIn,
          consentToUpdates: inquiryForm.consentToUpdates,
          message: finalMessage,
          source: "car-details-modal",
        }),
      });

      setInquirySuccess("Inquiry sent successfully. We will contact you soon.");
      setInquiryForm({
        name: "",
        email: "",
        phone: "",
        hasTradeIn: false,
        message: buildDefaultInquiryMessage(car, id),
        budget: "",
        consentToUpdates: true,
      });

      setTimeout(() => {
        setShowInquiry(false);
      }, 1000);
    } catch (error) {
      console.error("INQUIRY SUBMIT ERROR:", error);
      setInquiryError("Failed to send inquiry. Please try again.");
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Could integrate with backend favorites list here
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/cars/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareSuccess("Link copied to clipboard!");
      setTimeout(() => setShareSuccess(""), 3000);
    }).catch(() => {
      alert("Could not copy to clipboard. Please try again.");
    });
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-white">
        <div className="px-6 py-12 mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-10 w-72 rounded-xl bg-slate-200" />
            <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
              <div className="h-[420px] rounded-3xl bg-slate-200" />
              <div className="h-[420px] rounded-3xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sellerPhone = car?.contact?.phone || "";
  const sellerName = car?.sellerName || car?.contact?.name || "Seller";
  const sellerEmail = car?.sellerEmail || car?.contact?.email || "";
  const safePhone = sellerPhone.replace(/\D/g, "");
  const whatsappPhone = safePhone ? `94${safePhone.replace(/^0/, "")}` : "";
  const canCall = Boolean(safePhone);
  const locationLabel = [car?.location?.city, car?.location?.district]
    .filter(Boolean)
    .join(", ") || "Location not available";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-white">
      <div className="px-4 py-8 mx-auto max-w-7xl md:px-6 lg:py-10">
        <div className="overflow-hidden border shadow-sm bg-white/80 dark:bg-slate-800/60 rounded-3xl border-slate-200 dark:border-white/10">
          <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-12 md:p-7">
            <section className="lg:col-span-7">
              <div className="overflow-hidden border shadow-sm rounded-2xl border-slate-200">
                <img
                  src={activeImage || fallbackImage}
                  className="h-[360px] w-full object-cover md:h-[460px]"
                  alt={car.title || "Car image"}
                />
              </div>

              <div className="grid grid-cols-4 gap-2 mt-3 sm:grid-cols-6 md:grid-cols-7">
                {car.images?.map((img, index) => {
                  const imageUrl = img?.url || img;
                  const isActive = activeImage === imageUrl;

                  return (
                    <button
                      key={index}
                      onClick={() => setActiveImage(imageUrl)}
                      className={`overflow-hidden border rounded-xl transition ${
                        isActive
                            ? "border-slate-900 ring-2 ring-slate-300 dark:border-white/20 dark:ring-white/20"
                              : "border-slate-200 hover:border-slate-400 dark:border-white/10 dark:hover:border-white/20"
                      }`}
                      type="button"
                    >
                      <img
                        src={imageUrl}
                        className="object-cover w-full h-14 md:h-16"
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className={`py-3 font-medium transition border rounded-xl ${
                    isSaved
                      ? "border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-300"
                      : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-slate-800"
                  }`}
                >
                  {isSaved ? "❤ Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="py-3 font-medium transition border rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-slate-800"
                >
                  {shareSuccess ? "✓ Copied" : "Share"}
                </button>
              </div>

              {shareSuccess && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">{shareSuccess}</p>
              )}
            </section>

            <section className="lg:col-span-5">
              <div className="space-y-4 lg:sticky lg:top-24">
                <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200 dark:bg-slate-800 dark:border-white/10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-slate-900 text-slate-100">
                      {car.brand || "Car"}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {car.year || "Year N/A"}
                    </span>
                  </div>

                  <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-900 md:text-3xl dark:text-white">
                    {car.title}
                  </h1>

                  <p className="mt-3 text-3xl font-bold text-blue-700 md:text-4xl">
                    LKR {car.price?.toLocaleString()}
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 mt-3 text-sm font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <MapPin size={16} />
                    <span>{locationLabel}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-5 text-center">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-300">Mileage</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                        {car.mileage || "N/A"}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-300">Fuel</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                        {car.fuelType || "N/A"}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-300">Gearbox</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                        {car.transmission || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border rounded-2xl border-emerald-500 bg-emerald-50">
                  <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-[30px] font-bold leading-tight text-slate-900">Financing options available</h3>
                      <p className="mt-3 text-base text-slate-600">
                        Find out what the best financing options available to you are.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowFinanceInfo(true)}
                        className="px-6 py-3 mt-5 text-lg font-semibold transition bg-white shadow-sm rounded-2xl text-slate-900 hover:bg-slate-100"
                      >
                        Show me
                      </button>
                    </div>

                    <div className="hidden sm:block">
                      <div className="flex items-center justify-center w-56 h-40 mx-auto rounded-2xl bg-white/60">
                        <svg viewBox="0 0 260 170" className="w-48 h-32 text-emerald-500" fill="none">
                          <rect x="30" y="40" width="70" height="45" rx="8" stroke="currentColor" strokeWidth="4" opacity="0.4" />
                          <rect x="130" y="35" width="85" height="55" rx="8" stroke="currentColor" strokeWidth="4" opacity="0.35" />
                          <path d="M45 120C55 104 75 100 110 100H165C190 100 205 106 216 120" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                          <circle cx="82" cy="122" r="14" stroke="currentColor" strokeWidth="8" />
                          <circle cx="184" cy="122" r="14" stroke="currentColor" strokeWidth="8" />
                          <circle cx="232" cy="40" r="20" fill="currentColor" opacity="0.2" />
                          <path d="M224 40H240M232 32V48" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInquiryError("");
                      setInquirySuccess("");
                      setShowInquiry(true);
                    }}
                    className="px-5 py-4 text-lg font-semibold text-black transition rounded-2xl bg-emerald-400 hover:bg-emerald-500"
                  >
                    Make an Inquiry
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowContactModal(true);
                    }}
                    className="px-5 py-4 text-lg font-semibold text-center transition bg-white border rounded-2xl border-slate-300 text-slate-900 hover:bg-slate-100"
                  >
                    Contact Seller
                  </button>
                </div>

                {showEMI && <EMIModal price={car.price} onClose={() => setShowEMI(false)} />}

                {showFinanceInfo && createPortal(
                  <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/55">
                    <div className="relative w-full max-w-3xl p-6 bg-white shadow-2xl rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setShowFinanceInfo(false)}
                        className="absolute text-4xl leading-none right-4 top-3 text-slate-500 hover:text-slate-800"
                      >
                        ×
                      </button>

                      <h3 className="mt-6 text-4xl font-bold text-center text-slate-900">Financing options to suit your needs</h3>

                      <div className="flex items-center justify-center w-56 mx-auto mt-4 h-36 rounded-2xl bg-emerald-50">
                        <svg viewBox="0 0 260 170" className="h-28 w-44 text-emerald-500" fill="none">
                          <rect x="30" y="40" width="70" height="45" rx="8" stroke="currentColor" strokeWidth="4" opacity="0.4" />
                          <rect x="130" y="35" width="85" height="55" rx="8" stroke="currentColor" strokeWidth="4" opacity="0.35" />
                          <path d="M45 120C55 104 75 100 110 100H165C190 100 205 106 216 120" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                          <circle cx="82" cy="122" r="14" stroke="currentColor" strokeWidth="8" />
                          <circle cx="184" cy="122" r="14" stroke="currentColor" strokeWidth="8" />
                        </svg>
                      </div>

                      <p className="max-w-2xl mx-auto mt-4 text-lg leading-8 text-center text-slate-700">
                        At AutoVerge, we understand that purchasing a vehicle is a significant investment.
                      </p>
                      <p className="max-w-2xl mx-auto mt-3 text-lg leading-8 text-center text-slate-700">
                        That&apos;s why we offer a range of flexible financing solutions to make your car ownership journey smoother and more affordable.
                      </p>

                      <div className="max-w-2xl p-4 mx-auto mt-6 text-center rounded-xl bg-emerald-100">
                        <p className="text-base text-slate-700">
                          Try our payment calculator to see what payment plan works best for you.
                          For any further clarifications and inquiries, we would love to help you out.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setShowFinanceInfo(false);
                            setShowEMI(true);
                          }}
                          className="px-6 py-3 mt-4 text-lg font-semibold text-white transition rounded-xl bg-emerald-500 hover:bg-emerald-600"
                        >
                          Payment calculator →
                        </button>
                      </div>

                      <div className="flex justify-center mt-5">
                        <button
                          type="button"
                          onClick={() => {
                            setShowFinanceInfo(false);
                            setInquiryError("");
                            setInquirySuccess("");
                            setShowInquiry(true);
                          }}
                          className="px-6 py-3 text-lg font-semibold transition border rounded-xl border-slate-300 text-slate-900 hover:bg-slate-100"
                        >
                          Make an Inquiry
                        </button>
                      </div>
                    </div>
                  </div>, document.body
                )}

                {showContactModal && createPortal(
                  <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl">
                      <button
                        type="button"
                        onClick={() => setShowContactModal(false)}
                        className="absolute z-10 flex items-center justify-center w-10 h-10 text-2xl leading-none transition bg-white rounded-full shadow-lg -right-1 -top-1 text-slate-500 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300"
                      >
                        ×
                      </button>

                      <SellerContactCard
                        sellerName={sellerName}
                        sellerPhone={sellerPhone}
                        sellerEmail={sellerEmail}
                        locationLabel={locationLabel}
                        telLink={canCall ? `tel:${safePhone}` : "#"}
                        whatsappLink={canCall ? `https://wa.me/${whatsappPhone}` : "#"}
                      />

                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setShowContactModal(false);
                            setInquiryError("");
                            setInquirySuccess("");
                            setShowInquiry(true);
                          }}
                          className="px-5 py-3 text-sm font-semibold transition bg-white border rounded-xl border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        >
                          Make an inquiry instead
                        </button>
                      </div>
                    </div>
                  </div>, document.body
                )}

                {showInquiry && createPortal(
                  <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/55">
                    <div className="relative w-full max-w-3xl p-6 bg-white shadow-2xl rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setShowInquiry(false)}
                        className="absolute text-4xl leading-none right-4 top-3 text-slate-500 hover:text-slate-800"
                      >
                        ×
                      </button>

                      <h3 className="text-4xl font-bold text-center text-slate-900">Make an Inquiry</h3>

                      <div className="grid grid-cols-1 gap-3 mt-6 md:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Name*"
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="px-4 py-3 rounded-lg outline-none bg-slate-100"
                        />
                        <input
                          type="email"
                          placeholder="Email*"
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm((prev) => ({ ...prev, email: e.target.value }))}
                          className="px-4 py-3 rounded-lg outline-none bg-slate-100"
                        />
                        <input
                          type="text"
                          placeholder="Phone*"
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm((prev) => ({ ...prev, phone: e.target.value }))}
                          className="px-4 py-3 rounded-lg outline-none bg-slate-100 md:col-span-1"
                        />
                      </div>

                      <label className="flex items-center gap-2 mt-4 text-slate-700">
                        <input
                          type="checkbox"
                          checked={inquiryForm.hasTradeIn}
                          onChange={(e) => setInquiryForm((prev) => ({ ...prev, hasTradeIn: e.target.checked }))}
                          className="w-4 h-4"
                        />
                        I have a vehicle to trade in.
                      </label>

                      <textarea
                        rows={5}
                        className="w-full px-4 py-3 mt-4 rounded-lg outline-none bg-slate-100"
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm((prev) => ({ ...prev, message: e.target.value }))}
                      />

                      <div className="flex px-4 py-3 mt-4 rounded-lg bg-slate-100">
                        <span className="mr-3 text-slate-500">LKR</span>
                        <input
                          type="text"
                          placeholder="What is your budget?"
                          value={inquiryForm.budget}
                          onChange={(e) => setInquiryForm((prev) => ({ ...prev, budget: e.target.value }))}
                          className="w-full bg-transparent outline-none"
                        />
                      </div>

                      <label className="flex items-center gap-2 mt-4 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={inquiryForm.consentToUpdates}
                          onChange={(e) => setInquiryForm((prev) => ({ ...prev, consentToUpdates: e.target.checked }))}
                          className="w-4 h-4"
                        />
                        AutoVerge can send me updates, offers and surveys for this and similar cars.
                      </label>

                      {inquiryError && (
                        <p className="mt-3 text-sm font-medium text-red-600">{inquiryError}</p>
                      )}
                      {inquirySuccess && (
                        <p className="mt-3 text-sm font-medium text-emerald-600">{inquirySuccess}</p>
                      )}

                      <div className="flex justify-center mt-5">
                        <button
                          type="button"
                          onClick={submitInquiry}
                          disabled={inquirySubmitting}
                          className={`px-8 py-3 text-lg font-semibold text-white transition rounded-xl ${
                            inquirySubmitting ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"
                          }`}
                        >
                          {inquirySubmitting ? "Sending..." : "Send Message"}
                        </button>
                      </div>
                    </div>
                  </div>, document.body
                )}

                <PriceEstimateCard car={car} />
              </div>
            </section>
          </div>
        </div>

        <section className="p-6 mt-8 bg-white border shadow-sm rounded-2xl border-slate-200 dark:bg-slate-800 dark:border-white/10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Description</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
            {car.description || "No description available."}
          </p>

          <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">Key Highlights</h3>
          <ul className="grid grid-cols-1 gap-2 mt-3 text-sm text-slate-700 md:grid-cols-2 dark:text-slate-300">
            <li className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/5">Transmission: {car.transmission || "N/A"}</li>
            <li className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/5">Fuel Type: {car.fuelType || "N/A"}</li>
            <li className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/5">Brand: {car.brand || "N/A"}</li>
            <li className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/5">Model: {car.model || "N/A"}</li>
          </ul>
        </section>

        <section className="p-6 mt-6 bg-white border shadow-sm rounded-2xl border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Specifications</h2>
          <div className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-xl bg-slate-100">
              <p className="text-xs text-slate-500">Brand</p>
              <p className="mt-1 font-semibold text-slate-900">{car.brand || "N/A"}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100">
              <p className="text-xs text-slate-500">Model</p>
              <p className="mt-1 font-semibold text-slate-900">{car.model || "N/A"}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100">
              <p className="text-xs text-slate-500">Year</p>
              <p className="mt-1 font-semibold text-slate-900">{car.year || "N/A"}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100">
              <p className="text-xs text-slate-500">Mileage</p>
              <p className="mt-1 font-semibold text-slate-900">{car.mileage || "N/A"}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100">
              <p className="text-xs text-slate-500">Fuel Type</p>
              <p className="mt-1 font-semibold text-slate-900">{car.fuelType || "N/A"}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100">
              <p className="text-xs text-slate-500">Transmission</p>
              <p className="mt-1 font-semibold text-slate-900">{car.transmission || "N/A"}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100">
              <p className="text-xs text-slate-500">Condition</p>
              <p className="mt-1 font-semibold text-slate-900">{car.condition || "N/A"}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100">
              <p className="text-xs text-slate-500">Service History</p>
              <p className="mt-1 font-semibold text-slate-900">{car.serviceHistory || "N/A"}</p>
            </div>
          </div>
        </section>

        <section className="p-6 mt-6 bg-white border shadow-sm rounded-2xl border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Trust Evaluation</h2>
          <p className="mt-1 text-sm text-slate-500">Based on listing quality and vehicle data</p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div
              className={`px-4 py-2 rounded-xl font-bold text-sm ${getGradeColor(
                car.autoTrustGrade
              )}`}
            >
              Grade {car.autoTrustGrade || "N/A"}
            </div>

            <div
              className={`px-4 py-2 rounded-xl font-semibold text-sm ${getTrustColor(
                car.trustLevel
              )}`}
            >
              {car.trustLevel || "N/A"} Trust
            </div>
          </div>

          {car.gradeReason && (
            <div className="p-4 mt-4 border rounded-xl bg-slate-50 border-slate-200">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Why this grade?</span> {car.gradeReason}
              </p>
            </div>
          )}

          {car.autoTrustCheckResults && (
            <div className="grid grid-cols-1 gap-3 mt-5 md:grid-cols-2 xl:grid-cols-3">
              <div className="p-4 border rounded-xl border-slate-200">
                <h3 className="font-semibold text-slate-900">Listing Completeness</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {car.autoTrustCheckResults.completeness?.reason || "No data"}
                </p>
              </div>

              <div className="p-4 border rounded-xl border-slate-200">
                <h3 className="font-semibold text-slate-900">Visual Evidence</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {car.autoTrustCheckResults.visual?.reason || "No data"}
                </p>
              </div>

              <div className="p-4 border rounded-xl border-slate-200">
                <h3 className="font-semibold text-slate-900">Usage Reality</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {car.autoTrustCheckResults.usage?.reason || "No data"}
                </p>
              </div>

              <div className="p-4 border rounded-xl border-slate-200">
                <h3 className="font-semibold text-slate-900">Maintenance</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {car.autoTrustCheckResults.maintenance?.reason || "No data"}
                </p>
              </div>

              <div className="p-4 border rounded-xl border-slate-200 md:col-span-2 xl:col-span-2">
                <h3 className="font-semibold text-slate-900">Listing Stability</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {car.autoTrustCheckResults.stability?.reason || "No data"}
                </p>
              </div>
            </div>
          )}
        </section>

        <RelatedCars currentVehicleId={id} />
      </div>
    </div>
  );
}

export default CarDetails;