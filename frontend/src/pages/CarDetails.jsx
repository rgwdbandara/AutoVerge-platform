import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Flag,
  Heart,
  MapPin,
  Share2,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  Phone,
  MessageSquareText,
  Gauge,
  Fuel,
  CalendarDays,
  GaugeCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useApi } from "../lib/api";
import EMIModal from "../components/finance/EMIModal";
import PriceEstimateCard from "../components/price/PriceEstimateCard";
import RelatedCars from "../components/cars/RelatedCars";
import SellerContactCard from "../components/cars/SellerContactCard";
import { formatConditionLabel, formatMileageValue } from "../lib/carDetails";

// eslint-disable-next-line no-unused-vars
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

const getCheckTone = (level) => {
  if (level === "Strong") return "bg-emerald-100 text-emerald-700 ring-emerald-200";
  if (level === "Moderate") return "bg-amber-100 text-amber-700 ring-amber-200";
  return "bg-rose-100 text-rose-700 ring-rose-200";
};

const getCheckLabel = (level) => {
  if (level === "Strong") return "Excellent";
  if (level === "Moderate") return "Good";
  return "Needs review";
};

const getGradeGuide = (grade) => {
  if (grade === "A") return "High Trust";
  if (grade === "B") return "Good Trust";
  if (grade === "C") return "Moderate Trust";
  return "Low Trust";
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
  const [reportSuccess, setReportSuccess] = useState("");
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

  const handleReport = () => {
    setReportSuccess("Report submitted. Our team will review it shortly.");
    setTimeout(() => setReportSuccess(""), 3000);
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
  const galleryImages = Array.isArray(car.images) ? car.images : [];
  const specCards = [
    { label: "Mileage", value: formatMileageValue(car.condition, car.mileage), icon: GaugeCircle },
    { label: "Fuel", value: car.fuelType || "N/A", icon: Fuel },
    { label: "Transmission", value: car.transmission || "N/A", icon: Gauge },
    { label: "Year", value: car.year || "N/A", icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-white">
      <div className="px-4 py-6 mx-auto max-w-7xl md:px-6 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-600 dark:text-blue-300">Home</span>
            <span>›</span>
            <span className="font-medium text-blue-600 dark:text-blue-300">Browse Cars</span>
            <span>›</span>
            <span className="truncate text-slate-500 dark:text-slate-300">{car.title || "Car details"}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              <Share2 size={15} /> Share
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                isSaved
                  ? "border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
                  : "border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              }`}
            >
              <Heart size={15} className={isSaved ? "fill-current" : ""} /> {isSaved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              <Flag size={15} /> Report
            </button>
          </div>
        </div>

        {reportSuccess && (
          <div className="px-4 py-3 mb-4 text-sm font-medium border rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            {reportSuccess}
          </div>
        )}

        <div className="overflow-hidden border shadow-sm bg-white/80 dark:bg-slate-800/60 rounded-3xl border-slate-200 dark:border-white/10">
          <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-12 md:p-6">
            <section className="space-y-4 lg:col-span-7">
              <div className="overflow-hidden border shadow-sm rounded-3xl border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-800">
                <div className="relative">
                  <img
                    src={activeImage || fallbackImage}
                    className="h-[360px] w-full object-cover md:h-[470px]"
                    alt={car.title || "Car image"}
                  />

                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                    <Sparkles size={12} /> Featured
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const index = galleryImages.findIndex((img) => (img?.url || img) === activeImage);
                      const next = galleryImages[(index + 1) % galleryImages.length];
                      const nextUrl = next?.url || next;
                      if (nextUrl) setActiveImage(nextUrl);
                    }}
                    className="absolute p-3 transition -translate-y-1/2 rounded-full shadow-lg right-4 top-1/2 bg-white/90 text-slate-700 hover:bg-white dark:bg-slate-900/90 dark:text-white"
                    aria-label="Next image"
                  >
                    <ArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const index = galleryImages.findIndex((img) => (img?.url || img) === activeImage);
                      const prev = galleryImages[index - 1] || galleryImages[galleryImages.length - 1];
                      const prevUrl = prev?.url || prev;
                      if (prevUrl) setActiveImage(prevUrl);
                    }}
                    className="absolute p-3 transition -translate-y-1/2 rounded-full shadow-lg left-4 top-1/2 bg-white/90 text-slate-700 hover:bg-white dark:bg-slate-900/90 dark:text-white"
                    aria-label="Previous image"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <div className="absolute px-3 py-1 text-xs font-semibold text-white rounded-full bottom-4 right-4 bg-slate-900/70 backdrop-blur">
                    {galleryImages.length ? `${galleryImages.findIndex((img) => (img?.url || img) === activeImage) + 1} / ${galleryImages.length}` : "1 / 1"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7">
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

              {/* Market Price Estimate - placed below thumbnails */}
              <div className="mt-4">
                <div className="max-w-md">
                  <PriceEstimateCard car={car} />
                </div>
              </div>

              {shareSuccess && <p className="mt-2 text-sm text-green-600 dark:text-green-400">{shareSuccess}</p>}
            </section>

            <section className="lg:col-span-5">
              <div className="space-y-4 lg:sticky lg:top-24">
                <div className="p-5 bg-white border shadow-sm rounded-3xl border-slate-200 dark:border-white/10 dark:bg-slate-800 lg:-mt-12">
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

                  <div className="grid grid-cols-2 gap-3 mt-5 text-center sm:grid-cols-4">
                    {specCards.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="p-3 text-left shadow-sm rounded-2xl bg-slate-50 dark:bg-slate-700/40">
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                            <Icon size={14} /> {item.label}
                          </div>
                          <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-white">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 border shadow-sm rounded-3xl border-emerald-500 bg-emerald-50">
                  <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-[26px] font-bold leading-tight text-slate-900 md:text-[30px]">Financing options available</h3>
                      <p className="mt-3 text-base text-slate-600">
                        Find out what the best financing options available to you are.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowFinanceInfo(true)}
                        className="px-6 py-3 mt-5 text-base font-semibold transition bg-white shadow-sm rounded-2xl text-slate-900 hover:bg-slate-100"
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
                    className="px-5 py-4 text-lg font-semibold text-white transition bg-blue-500 rounded-2xl hover:bg-blue-600"
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
              </div>
            </section>
          </div>
        </div>

        <section className="p-6 mt-8">
          <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Description</h2>
            <p className="mt-3 text-lg leading-7 text-slate-600">
              {car.description || "No description available."}
            </p>

            <h3 className="mt-6 text-sm font-semibold text-slate-900">Key Highlights</h3>
            <div className="grid grid-cols-1 gap-3 mt-3 sm:grid-cols-3">
              {(
                car.highlights && Array.isArray(car.highlights) ? car.highlights : [
                  "First Owner",
                  "Well Maintained",
                  "Lady Driven",
                  "Negotiable",
                  "Accident Free",
                  "Good Condition"
                ]
              ).map((h, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f7f9fc]">
                  <div className="flex items-center justify-center w-6 h-6 text-blue-600 rounded-full bg-blue-50">
                    <CheckCircle size={14} />
                  </div>
                  <div className="text-sm text-slate-700">{h}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-6 mt-6 bg-white border shadow-sm rounded-3xl border-slate-200">
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
              <p className="mt-1 font-semibold text-slate-900">
                {formatMileageValue(car.condition, car.mileage)}
              </p>
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
              <p className="mt-1 font-semibold text-slate-900">
                {formatConditionLabel(car.condition)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100">
              <p className="text-xs text-slate-500">Service History</p>
              <p className="mt-1 font-semibold text-slate-900">{car.serviceHistory || "N/A"}</p>
            </div>
          </div>
        </section>

        <section className="p-6 mt-6 bg-white border shadow-sm rounded-3xl border-slate-200">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Trust Evaluation</h2>
              <p className="mt-1 text-sm text-slate-500">Rule-based score from listing quality and vehicle data</p>
            </div>
            <div className="text-sm font-medium text-slate-500">
              Guide: A {" "}(80 - 100) / B {" "}(60 - 79) / C {" "}(40 - 59) / D {" "}(0 - 39)
            </div>
          </div>

          <div className="grid gap-5 mt-5 lg:grid-cols-[1.15fr_1.35fr]">
            <div className="p-5 border shadow-sm bg-gradient-to-br from-emerald-50 via-white to-slate-50 rounded-3xl border-emerald-100">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex items-center justify-center text-white rounded-full shadow-lg w-28 h-28 bg-emerald-600 shadow-emerald-200">
                  <div className="text-center">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] opacity-90">Grade</div>
                    <div className="text-5xl font-black leading-none">{car.autoTrustGrade || "N/A"}</div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className={`px-4 py-2 rounded-full font-semibold text-sm ${getTrustColor(
                        car.trustLevel
                      )}`}
                    >
                      {car.trustLevel || "N/A"} Trust
                    </div>
                    <div className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-slate-900">
                      {getGradeGuide(car.autoTrustGrade)}
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
                    <img
                      src={activeImage || fallbackImage}
                      alt={car.title || "Vehicle"}
                      className="object-cover w-full h-44"
                    />
                  </div>
                </div>
              </div>

              {car.gradeReason && (
                <div className="p-4 mt-5 bg-white border rounded-2xl border-emerald-100">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">Why this grade?</span> {car.gradeReason}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-5 sm:grid-cols-4">
                <div className="p-3 bg-white border rounded-2xl border-slate-200">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Listing quality</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Complete score mix</p>
                </div>
                <div className="p-3 bg-white border rounded-2xl border-slate-200">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Vehicle data</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Year, mileage, price</p>
                </div>
                <div className="p-3 bg-white border rounded-2xl border-slate-200">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Visual proof</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Image evidence</p>
                </div>
                <div className="p-3 bg-white border rounded-2xl border-slate-200">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Stability</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Listing consistency</p>
                </div>
              </div>
            </div>

            {car.autoTrustCheckResults && (
              <div className="p-5 border rounded-3xl bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">AutoTrust Check Results</h3>
                  <span className="px-3 py-1 text-xs font-semibold bg-white border rounded-full text-slate-600 border-slate-200">
                    How the grade was built
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    ["Listing Completeness", car.autoTrustCheckResults.completeness],
                    ["Visual Evidence (Images)", car.autoTrustCheckResults.visual],
                    ["Usage Reality (Mileage Check)", car.autoTrustCheckResults.usage],
                    ["Maintenance Confidence", car.autoTrustCheckResults.maintenance],
                    ["Listing Stability", car.autoTrustCheckResults.stability],
                  ].map(([label, result]) => (
                    <div key={label} className="p-4 bg-white border shadow-sm rounded-2xl border-slate-200">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{label}</p>
                          <p className="mt-1 text-sm text-slate-500">{result?.reason || "No data"}</p>
                        </div>
                        <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-full ring-1 ${getCheckTone(result?.level)}`}>
                          {getCheckLabel(result?.level)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-2 mt-4 sm:grid-cols-3">
                  <div className="px-3 py-2 text-xs font-semibold border text-emerald-700 bg-emerald-50 rounded-xl border-emerald-100">
                    Strong = fully supported
                  </div>
                  <div className="px-3 py-2 text-xs font-semibold border text-amber-700 bg-amber-50 rounded-xl border-amber-100">
                    Moderate = acceptable but needs caution
                  </div>
                  <div className="px-3 py-2 text-xs font-semibold border text-rose-700 bg-rose-50 rounded-xl border-rose-100">
                    Weak = missing or inconsistent data
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <RelatedCars currentVehicleId={id} />
      </div>
    </div>
  );
}

export default CarDetails;