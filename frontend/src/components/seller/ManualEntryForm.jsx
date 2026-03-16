import { useState } from "react";
import { useApi } from "../../lib/api";

function ManualEntryForm() {
  const api = useApi();


  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    color: "",
    fuelType: "",
    transmission: "",
    bodyType: "",
    seats: "",
    status: "Available",
    description: "",
    featured: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED", form);
    try {
      await api("/api/vehicles", {
        method: "POST",
        body: JSON.stringify({
          title: `${form.make} ${form.model}`,
          brand: form.make,
          model: form.model,
          year: Number(form.year) || 0,
          price: Number(form.price) || 0,
          mileage: Number(form.mileage) || 0,
          fuelType: form.fuelType,
          transmission: form.transmission,
          description: form.description
        })
      });
      alert("Car added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add car");
    }
  };



  return (

    <div className="p-6 bg-white rounded shadow">

      <h3 className="mb-4 text-lg font-semibold">
        Car Details
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          <input
            name="make"
            value={form.make}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Make"
          />
          <input
            name="model"
            value={form.model}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Model"
          />
          <input
            name="year"
            value={form.year}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Year"
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Price"
          />
          <input
            name="mileage"
            value={form.mileage}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Mileage"
          />
          <input
            name="color"
            value={form.color}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Color"
          />
          <select
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
            className="p-2 border rounded"
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
            className="p-2 border rounded"
          >
            <option value="">Transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
          <select
            name="bodyType"
            value={form.bodyType}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Body Type</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
          </select>
          <input
            name="seats"
            value={form.seats}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Seats"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 mt-4 border rounded"
        />
        {/* Feature */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          <span>
            Feature this car
          </span>
        </div>
        {/* Image Upload */}
        <div className="p-10 mt-4 text-center border-2 border-dashed">
          Drag & drop or click to upload images
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-2 text-white bg-black rounded"
        >
          Add Car
        </button>
      </form>

    </div>

  );
}

export default ManualEntryForm;