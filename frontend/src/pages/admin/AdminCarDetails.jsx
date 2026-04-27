import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../lib/api";

function AdminCarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await api(`/api/vehicles/${id}`);
        setCar(data);
      } catch {
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [api, id]);

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      await api(`/api/admin/approve/${id}`, { method: "PUT" });
      alert("Approved!");
      navigate("/admin/pending");
    } catch {
      alert("Failed to approve listing");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    setSubmitting(true);
    try {
      await api(`/api/admin/reject/${id}`, { method: "PUT" });
      alert("Rejected!");
      navigate("/admin/pending");
    } catch {
      alert("Failed to reject listing");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (error || !car) {
    return <p className="p-6 text-red-500">{error || "Listing not found"}</p>;
  }

  const images = Array.isArray(car.images) ? car.images : [];
  const sellerPhone = car?.contact?.phone || "N/A";
  const location = [car?.location?.city, car?.location?.district]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h1 className="mb-2 text-2xl font-bold">{car.title || `${car.brand} ${car.model}`}</h1>
      <p className="mb-6 text-sm text-gray-500">Status: {car.status}</p>

      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
        {images.length > 0 ? (
          images.map((img, i) => (
            <img
              key={i}
              src={img?.url || img}
              alt={`Car ${i + 1}`}
              className="object-cover w-full rounded-lg h-60"
            />
          ))
        ) : (
          <div className="p-6 text-gray-500 bg-gray-100 rounded-lg">No images available</div>
        )}
      </div>

      <div className="space-y-2">
        <p><b>Price:</b> LKR {car.price?.toLocaleString?.() || car.price}</p>
        <p><b>Year:</b> {car.year}</p>
        <p><b>Mileage:</b> {car.mileage}</p>
        <p><b>Fuel:</b> {car.fuelType}</p>
        <p><b>Transmission:</b> {car.transmission}</p>
        <p><b>Location:</b> {location || "N/A"}</p>
        <p><b>Description:</b> {car.description || "N/A"}</p>
      </div>

      <div className="p-4 mt-6 bg-gray-100 rounded-lg">
        <h3 className="font-semibold">Seller Info</h3>
        <p>Seller ID: {car.sellerClerkId}</p>
        <p>Phone: {sellerPhone}</p>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleApprove}
          disabled={submitting}
          className="px-6 py-2 text-white bg-green-500 rounded-lg disabled:opacity-60"
        >
          Approve
        </button>

        <button
          onClick={handleReject}
          disabled={submitting}
          className="px-6 py-2 text-white bg-red-500 rounded-lg disabled:opacity-60"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default AdminCarDetails;