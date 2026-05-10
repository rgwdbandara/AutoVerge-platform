import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../lib/api";
import EMIModal from "../components/finance/EMIModal";
import PriceEstimateCard from "../components/price/PriceEstimateCard";

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

const calculateQuickEMI = (price) => {
  const P = Number(price);
  const r = 4.5 / 12 / 100;
  const n = 60;

  if (!P) return 0;

  return Math.round(
    (P * r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1)
  );
};

const formatLKR = (value) => {
  return new Intl.NumberFormat("en-LK").format(value);
};

function CarDetails() {
  const { id } = useParams();
  const api = useApi();
  const [car, setCar] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [showEMI, setShowEMI] = useState(false);
  const fallbackImage = "https://via.placeholder.com/800x500";

  useEffect(() => {
    const loadCar = async () => {
      const data = await api(`/api/vehicles/${id}`);
      console.log("CAR DETAILS DATA:", data);
      const firstImage = data?.images?.[0];
      const firstImageUrl =
        typeof firstImage === "string" ? firstImage : firstImage?.url;
      setCar(data);
      setActiveImage(firstImageUrl || fallbackImage);
    };
    loadCar();
  }, [id, api]);

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

  const emi = calculateQuickEMI(car.price);
  const sellerPhone = car?.contact?.phone || "";
  const safePhone = sellerPhone.replace(/\D/g, "");
  const whatsappPhone = safePhone ? `94${safePhone.replace(/^0/, "")}` : "";
  const canCall = Boolean(safePhone);

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
                  className="py-3 font-medium transition border rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-slate-800"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="py-3 font-medium transition border rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-slate-800"
                >
                  Share
                </button>
              </div>
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

                <div
                  onClick={() => setShowEMI(true)}
                  className="p-5 transition border border-blue-100 shadow-sm cursor-pointer rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md dark:bg-slate-800/40 dark:border-white/10"
                >
                  <h3 className="text-lg font-semibold text-slate-900">EMI Calculator</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Estimated Monthly Payment</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">LKR {formatLKR(emi)}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">Based on 4.5% interest for 60 months</p>
                </div>

                {showEMI && (
                  <EMIModal
                    price={car.price}
                    onClose={() => setShowEMI(false)}
                  />
                )}

                <PriceEstimateCard car={car} />
              </div>
            </section>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-12">
          <section className="p-6 bg-white border shadow-sm lg:col-span-7 rounded-2xl border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Description</h2>
            <p className="mt-3 leading-7 text-slate-600">
              {car.description || "No description available."}
            </p>

            <h3 className="mt-8 text-lg font-semibold text-slate-900">Key Highlights</h3>
            <ul className="grid grid-cols-1 gap-2 mt-3 text-sm text-slate-700 md:grid-cols-2">
              <li className="px-3 py-2 rounded-lg bg-slate-100">Transmission: {car.transmission || "N/A"}</li>
              <li className="px-3 py-2 rounded-lg bg-slate-100">Fuel Type: {car.fuelType || "N/A"}</li>
              <li className="px-3 py-2 rounded-lg bg-slate-100">Brand: {car.brand || "N/A"}</li>
              <li className="px-3 py-2 rounded-lg bg-slate-100">Model: {car.model || "N/A"}</li>
            </ul>
          </section>

          <section className="p-6 bg-white border shadow-sm lg:col-span-5 rounded-2xl border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Seller Information</h2>

            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Name:</span> {car?.contact?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Phone:</span> {car?.contact?.phone || "Not provided"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Location:</span> {car?.location?.city || "N/A"}
                {car?.location?.district ? `, ${car.location.district}` : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-5 sm:grid-cols-2">
              <a
                href={canCall ? `tel:${safePhone}` : "#"}
                className={`py-3 text-center rounded-xl font-medium transition ${
                  canCall
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-slate-200 text-slate-500 pointer-events-none"
                }`}
              >
                Call Now
              </a>

              <a
                href={canCall ? `https://wa.me/${whatsappPhone}` : "#"}
                target="_blank"
                rel="noreferrer"
                className={`py-3 text-center rounded-xl font-medium transition ${
                  canCall
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-slate-200 text-slate-500 pointer-events-none"
                }`}
              >
                WhatsApp
              </a>
            </div>
          </section>
        </div>

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
      </div>
    </div>
  );
}

export default CarDetails;