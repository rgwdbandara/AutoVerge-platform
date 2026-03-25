import { useState } from "react";
import { useApi } from "../../lib/api";
import { uploadToCloudinary } from "../../lib/cloudinary";

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

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e
    .target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      const uploadedImageUrls = [];

      for (const file of selectedImages) {
        const imageUrl = await uploadToCloudinary(file);
        uploadedImageUrls.push(imageUrl);
      }

      const payload = {
        title: `${form.make} ${form.model}`.trim(),
        brand: form.make,
        model: form.model,
        year: Number(form.year) || 0,
        price: Number(form.price) || 0,
        mileage: Number(form.mileage) || 0,
        fuelType: form.fuelType,
        transmission: form.transmission,
        description: form.description,
        images: uploadedImageUrls,
      };

      console.log("FINAL PAYLOAD:", payload);

      await api("/api/vehicles", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Car added successfully!");

      setForm({
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
        featured: false,
      });

      setSelectedImages([]);
    } catch (err) {
      console.error(err);
      alert("Failed to add car");
    } finally {
      setUploading(false);
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
        <div className="mt-4">
          <label className="block mb-2 font-medium">Images</label>

          <div className="p-6 text-center border-2 border-dashed rounded">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mb-3"
            />

            <p>Drag & drop or click to upload images</p>
            <p className="mt-1 text-sm text-gray-500">
              JPG, PNG, WEBP up to 5MB
            </p>
          </div>

          {selectedImages.length > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              {selectedImages.length} image(s) selected
            </div>
          )}
        </div>
        {/* Submit */}
        <button
          type="submit"
          disabled={uploading}
          className="px-6 py-2 text-white bg-black rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Add Car"}
        </button>
      </form>

    </div>

  );
}

export default ManualEntryForm;