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

  if (!car) return <p className="p-10">Loading...</p>;

  const emi = calculateQuickEMI(car.price);

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8 mx-auto max-w-7xl">

  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

    {/* Left Side - Gallery */}
    <div>
      <img
        src={activeImage || fallbackImage}
        className="w-full h-[350px] object-cover rounded-xl"
        alt={car.title || "Car image"}
      />

      <div className="flex gap-3 mt-4">
        {car.images?.map((img, index) => {
          const imageUrl = img?.url || img;
          return (
            <img
              key={index}
              src={imageUrl}
              onClick={() => setActiveImage(imageUrl)}
              className="object-cover w-20 h-16 transition border rounded-lg cursor-pointer hover:scale-105"
              alt={`Thumbnail ${index + 1}`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <button className="py-3 font-medium border rounded-xl">
          Save
        </button>
        <button className="py-3 font-medium border rounded-xl">
          Share
        </button>
      </div>
    </div>

    {/* Right Side - Summary */}
          <div>
            <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-black rounded-full">
              {car.brand || "Car"}
            </span>

            <h1 className="mt-4 text-4xl font-bold">{car.title}</h1>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              LKR {car.price?.toLocaleString()}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6 text-gray-700">
              <div className="p-3 border rounded-xl">
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="font-semibold">{car.mileage}</p>
              </div>

              <div className="p-3 border rounded-xl">
                <p className="text-sm text-gray-500">Fuel</p>
                <p className="font-semibold">{car.fuelType}</p>
              </div>

              <div className="p-3 border rounded-xl">
                <p className="text-sm text-gray-500">Transmission</p>
                <p className="font-semibold">{car.transmission}</p>
              </div>
            </div>

            <div
              onClick={() => setShowEMI(true)}
              className="p-6 mt-6 transition border border-gray-200 cursor-pointer rounded-2xl bg-gray-50 hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                💠 EMI Calculator
              </h3>

              <p className="mt-3 text-lg text-gray-700">
                Estimated Monthly Payment:{" "}
                <span className="font-bold text-black">
                  LKR {formatLKR(emi)}
                </span>{" "}
                for 60 months
              </p>

              <p className="mt-2 text-sm text-gray-500">
                *Based on 4.5% estimated interest
              </p>
            </div>

            {showEMI && (
              <EMIModal
                price={car.price}
                onClose={() => setShowEMI(false)}
              />
            )}

            <PriceEstimateCard car={car} />

            {/* Contact Card */}
            <div className="p-5 mt-5 border rounded-2xl">
              <h2 className="text-2xl font-semibold">Have Questions?</h2>
              <p className="mt-3 text-gray-600">
                Contact the seller for more information about this vehicle.
              </p>
              <button className="w-full py-3 mt-4 font-medium border rounded-xl">
                Request Info
              </button>
            </div>

            <button className="w-full py-4 mt-5 text-lg font-semibold text-white bg-black rounded-2xl">
              Book Test Drive
            </button>
          </div>
        </div>

        {/* Description + Features */}
        <div className="grid grid-cols-1 gap-8 pt-12 mt-12 border-t lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Description</h2>
            <p className="mt-4 leading-8 text-gray-600">
              {car.description || "No description available."}
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">Features</h2>
            <ul className="mt-4 space-y-3 text-gray-700 list-disc list-inside">
              <li>{car.transmission || "Transmission info not available"}</li>
              <li>{car.fuelType || "Fuel type not available"}</li>
              <li>{car.brand || "Brand info not available"}</li>
              <li>{car.model || "Model info not available"}</li>
            </ul>
          </div>
        </div>

        {/* Specifications */}
        <div className="pt-12 mt-12 border-t">
          <h2 className="text-3xl font-bold">Specifications</h2>

          <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
            <div className="p-4 border rounded-xl">
              <p className="text-sm text-gray-500">Brand</p>
              <p className="mt-1 font-semibold">{car.brand}</p>
            </div>

            <div className="p-4 border rounded-xl">
              <p className="text-sm text-gray-500">Model</p>
              <p className="mt-1 font-semibold">{car.model}</p>
            </div>

            <div className="p-4 border rounded-xl">
              <p className="text-sm text-gray-500">Year</p>
              <p className="mt-1 font-semibold">{car.year}</p>
            </div>

            <div className="p-4 border rounded-xl">
              <p className="text-sm text-gray-500">Mileage</p>
              <p className="mt-1 font-semibold">{car.mileage}</p>
            </div>

            <div className="p-4 border rounded-xl">
              <p className="text-sm text-gray-500">Fuel Type</p>
              <p className="mt-1 font-semibold">{car.fuelType}</p>
            </div>

            <div className="p-4 border rounded-xl">
              <p className="text-sm text-gray-500">Transmission</p>
              <p className="mt-1 font-semibold">{car.transmission}</p>
            </div>

            <div className="p-4 border rounded-xl">
              <p className="text-sm text-gray-500">Condition</p>
              <p className="mt-1 font-semibold">{car.condition || "N/A"}</p>
            </div>

            <div className="p-4 border rounded-xl">
              <p className="text-sm text-gray-500">Service History</p>
              <p className="mt-1 font-semibold">
                {car.serviceHistory || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* AutoTrust Section */}
        <div className="pt-12 mt-12 border-t">
          <h2 className="text-3xl font-bold">Trust Evaluation</h2>
          <p className="mt-1 text-sm text-gray-500">
            Based on listing quality and vehicle data
          </p>

          <div className="flex items-center gap-4 mt-6">
            <div
              className={`px-6 py-3 rounded-xl font-bold text-lg ${getGradeColor(
                car.autoTrustGrade
              )}`}
            >
              Grade {car.autoTrustGrade || "N/A"}
            </div>

            <div
              className={`px-5 py-3 rounded-xl font-semibold ${getTrustColor(
                car.trustLevel
              )}`}
            >
              {car.trustLevel || "N/A"} Trust
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            This rating reflects how complete and reliable this listing appears.
          </p>

          {car.autoTrustCheckResults && (
            <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
              <div className="p-5 border shadow-sm rounded-2xl">
                <h3 className="text-lg font-semibold">📋 Listing Completeness</h3>
                <p className="mt-2 text-gray-600">
                  {car.autoTrustCheckResults.completeness?.reason || "No data"}
                </p>
              </div>

              <div className="p-5 border shadow-sm rounded-2xl">
                <h3 className="text-lg font-semibold">📸 Visual Evidence</h3>
                <p className="mt-2 text-gray-600">
                  {car.autoTrustCheckResults.visual?.reason || "No data"}
                </p>
              </div>

              <div className="p-5 border shadow-sm rounded-2xl">
                <h3 className="text-lg font-semibold">📊 Usage Reality</h3>
                <p className="mt-2 text-gray-600">
                  {car.autoTrustCheckResults.usage?.reason || "No data"}
                </p>
              </div>

              <div className="p-5 border shadow-sm rounded-2xl">
                <h3 className="text-lg font-semibold">🛠 Maintenance</h3>
                <p className="mt-2 text-gray-600">
                  {car.autoTrustCheckResults.maintenance?.reason || "No data"}
                </p>
              </div>

              <div className="p-5 border shadow-sm rounded-2xl md:col-span-2">
                <h3 className="text-lg font-semibold">🔄 Listing Stability</h3>
                <p className="mt-2 text-gray-600">
                  {car.autoTrustCheckResults.stability?.reason || "No data"}
                </p>
              </div>
            </div>
          )}
        </div>

       {/* 🔹 Seller Contact Section */}
<div className="p-6 mt-10 bg-white shadow rounded-xl">

  <h2 className="mb-4 text-xl font-semibold">
    Seller Information
  </h2>

  <div className="space-y-2 text-gray-700">

    <p>
      <span className="font-medium">Name:</span>{" "}
      {car?.contact?.name || "N/A"}
    </p>

    <p>
      <span className="font-medium">Phone:</span>{" "}
      {car?.contact?.phone || "Not provided"}
    </p>

  </div>

  {/* 🔹 Buttons */}
  <div className="flex gap-4 mt-5">

    {/* Call */}
    <a
      href={`tel:${car?.contact?.phone}`}
      className="flex-1 py-3 text-center text-white transition bg-black rounded-lg hover:bg-gray-800"
    >
      📞 Call Now
    </a>

    {/* WhatsApp */}
    <a
      href={`https://wa.me/94${car?.contact?.phone?.replace(/^0/, "")}`}
      target="_blank"
      rel="noreferrer"
      className="flex-1 py-3 text-center text-white transition bg-green-500 rounded-lg hover:bg-green-600"
    >
      💬 WhatsApp
    </a>

  </div>

</div>

{/* 🔹 Location */}
<div className="p-6 mt-6 bg-white shadow rounded-xl">

  <h2 className="mb-2 text-xl font-semibold">
    Location
  </h2>

  <p className="text-gray-600">
    📍 {car?.location?.city || "N/A"},{" "}
    {car?.location?.district || ""}
  </p>

</div>    





      </div>
    </div>
  );
}

export default CarDetails;