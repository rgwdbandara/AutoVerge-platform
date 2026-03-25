import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerHeader from "../../components/seller/SellerHeader";
import { useApi } from "../../lib/api";

function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await api(`/api/vehicles/${id}`);
        setForm({
          brand: data.brand || "",
          model: data.model || "",
          year: data.year || "",
          price: data.price || "",
          mileage: data.mileage || "",
          fuelType: data.fuelType || "",
          transmission: data.transmission || "",
          description: data.description || "",
        });
      } catch (error) {
        console.error("Failed to fetch car:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
    // Re-fetch only when route id changes; otherwise form input edits get reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await api(`/api/vehicles/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      if (res?.message === "Not authorized" || res?.message === "Failed to update listing") {
        alert("Failed to update car");
        return;
      }

      alert("Car updated successfully");
      navigate("/seller/cars");
    } catch (error) {
      console.error("Failed to update car:", error);
      alert("Failed to update car");
    }
  };

  if (loading || !form) {
    return <p className="p-6">Loading car...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SellerSidebar />

      <div className="flex-1">
        <SellerHeader />

        <div className="p-6">
          <h2 className="mb-6 text-3xl font-bold">Edit Car</h2>

          <form onSubmit={handleUpdate} className="p-6 bg-white border border-gray-200 rounded-2xl">
            <div className="grid grid-cols-2 gap-4">

              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="p-3 border rounded-xl"
                placeholder="Brand"
              />

              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                className="p-3 border rounded-xl"
                placeholder="Model"
              />

              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                className="p-3 border rounded-xl"
                placeholder="Year"
              />

              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                className="p-3 border rounded-xl"
                placeholder="Price"
              />

              <input
                name="mileage"
                value={form.mileage}
                onChange={handleChange}
                className="p-3 border rounded-xl"
                placeholder="Mileage"
              />

              <select
                name="fuelType"
                value={form.fuelType}
                onChange={handleChange}
                className="p-3 border rounded-xl"
              >
                <option value="">Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>

              <select
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
                className="p-3 border rounded-xl"
              >
                <option value="">Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>

            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 mt-4 border rounded-xl"
              rows="5"
              placeholder="Description"
            />

            <button
              type="submit"
              className="px-6 py-3 mt-6 text-white bg-black rounded-xl hover:bg-gray-800"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCar;