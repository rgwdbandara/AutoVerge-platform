import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useApi } from "../../lib/api";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { useSearchParams } from "react-router-dom";
import axios from "axios";





function ManualEntryForm({ initialData, onSubmit, isEdit }) {
  const api = useApi();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const importId = searchParams.get("importId");

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
    condition: "",
    serviceHistory: "",
    accidentHistory: "No",
    previousOwners: "",
    extraFeatures: "",
    description: "",
    featured: false,
    contactName: "",
    contactEmail: "",
    phone: "",
    city: "",
    district: "",
  });


  const fetchImportedData = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5005/api/imported/${importId}`
      );

      const data = res.data;

      setForm((prev) => ({
        ...prev,

        make: data.brand || "",
        model: data.model || "",
        year: data.year || "",
        price: data.price || "",
        mileage: data.mileage || "",

        fuelType: data.fuelType || "",
        transmission: data.transmission || "",
        description: data.description || "",

        // defaults (user can edit)
        condition: "Good",
        serviceHistory: "Partial Service History",
        accidentHistory: "No",
      }));
    } catch (err) {
      console.error("Import fetch error:", err);
    }
  }, [importId]);

  useEffect(() => {
  if (initialData) {
    setForm({
      make: initialData.brand || "",
      model: initialData.model || "",
      year: initialData.year || "",
      price: initialData.price || "",
      mileage: initialData.mileage || "",
      color: initialData.color || "",
      fuelType: initialData.fuelType || "",
      transmission: initialData.transmission || "",
      bodyType: initialData.bodyType || "",
      seats: initialData.seats || "",
      condition: initialData.condition || "",
      serviceHistory: initialData.serviceHistory || "",
      accidentHistory: initialData.accidentHistory ? "Yes" : "No",
      previousOwners: initialData.previousOwners || "",
      extraFeatures: initialData.extraFeatures || "",
      description: initialData.description || "",
      featured: initialData.featured || false,

      contactName: initialData.contact?.name || "",
      contactEmail: initialData.contact?.email || "",
      phone: initialData.contact?.phone || "",

      city: initialData.location?.city || "",
      district: initialData.location?.district || "",
    });
  } else if (importId) {
    // 🔥 NEW: import flow
    fetchImportedData();
  } else if (user) {
    setForm((prev) => ({
      ...prev,
      contactName: prev.contactName || user.firstName || user.fullName || "",
      contactEmail:
        prev.contactEmail ||
        user.primaryEmailAddress?.emailAddress ||
        "",
    }));
  }
}, [initialData, user, importId, fetchImportedData]);

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
    const files = Array.from(e.target.files || []);

    const validFiles = files
      .filter((file) => {
        const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024;

        if (!isValidType) {
          alert(`${file.name} is not a supported image type.`);
          return false;
        }

        if (!isValidSize) {
          alert(`${file.name} is larger than 5MB.`);
          return false;
        }

        return true;
      })
      .map((file) => ({
        file,
        tag: "other",
      }));

    setSelectedImages((prev) => [...prev, ...validFiles].slice(0, 6));
    e.target.value = "";
  };

  const handleTagChange = (index, value) => {
    setSelectedImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, tag: value } : img
      )
    );
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedImages.length < 2) {
      alert("Please upload at least 2 images.");
      return;
    }

    try {
      setUploading(true);

      const uploadedImages = [];

      for (const image of selectedImages) {
        const imageUrl = await uploadToCloudinary(image.file);
        uploadedImages.push({
          url: imageUrl,
          tag: image.tag,
        });
      }

      if (importId) {
  await axios.post(
    `http://localhost:5005/api/imported/ignore/${importId}`
  );
}

      const payload = {
        title: `${form.make} ${form.model}`.trim(),
        brand: form.make,
        model: form.model,
        year: Number(form.year) || 0,
        price: Number(form.price) || 0,
        mileage: Number(form.mileage) || 0,
        color: form.color,
        bodyType: form.bodyType,
        seats: Number(form.seats) || 0,
        fuelType: form.fuelType,
        transmission: form.transmission,
        description: form.description,
        condition: form.condition,
        serviceHistory: form.serviceHistory,
        accidentHistory: form.accidentHistory === "Yes",
        previousOwners: form.previousOwners
          ? Number(form.previousOwners)
          : undefined,
        extraFeatures: form.extraFeatures,
        images: uploadedImages,
        contact: {
        name: form.contactName,
        email: form.contactEmail,
        phone: form.phone,
},
location: {
  city: form.city,
  district: form.district,
},
      };

      console.log("FINAL PAYLOAD:", payload);

      if (isEdit && onSubmit) {
        await onSubmit(payload);
      } else {
        await api("/api/vehicles", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

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
        condition: "",
        serviceHistory: "",
        accidentHistory: "No",
        previousOwners: "",
        extraFeatures: "",
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

    <div className="p-6 bg-white shadow-md rounded-xl">

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
            placeholder="Make (Brand)"
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
            <option value="Hybrid">Hybrid</option>
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
            <option value="Convertible">Convertible</option>
            <option value="Coupe">Coupe</option>
            <option value="Wagon">Wagon</option>
            <option value="Liftback">Liftback</option>
          </select>
          <input
            name="seats"
            value={form.seats}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Seats"
          />
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Brand New</option>
            <option value="Excellent">Used</option>
            
          </select>
          <select
            name="serviceHistory"
            value={form.serviceHistory}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Service History</option>
            <option value="Full Service History">Full Service History</option>
            <option value="Partial Service History">Partial Service History</option>
            <option value="No Service History">No Service History</option>
          </select>
          <select
            name="accidentHistory"
            value={form.accidentHistory}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="No">Accident History: No</option>
            <option value="Yes">Accident History: Yes</option>
          </select>
          <input
            name="previousOwners"
            value={form.previousOwners}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Previous Owners (optional)"
          />
        </div>
        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 mt-4 border rounded"
        />
        <textarea
          name="extraFeatures"
          value={form.extraFeatures}
          onChange={handleChange}
          placeholder="Extra Features"
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



    {/* 🔹 Contact Details */}
<div className="mt-8">
  <h3 className="mb-3 text-lg font-semibold">Contact Details</h3>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

    <input
      name="contactName"
      value={form.contactName}
      onChange={handleChange}
      className="p-2 border rounded"
      placeholder="Your Name"
    />

    <input
      name="contactEmail"
      value={form.contactEmail}
      onChange={handleChange}
      className="p-2 border rounded"
      placeholder="Email Address"
    />

    <input
      name="phone"
      value={form.phone}
      onChange={handleChange}
      className="p-2 border rounded md:col-span-2"
      placeholder="Phone Number (e.g. 0771234567)"
    />

  </div>
</div>


{/* 🔹 Location */}
<div className="mt-8">
  <h3 className="mb-3 text-lg font-semibold">Location</h3>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

    <input
      name="city"
      value={form.city}
      onChange={handleChange}
      className="p-2 border rounded"
      placeholder="City (e.g. Negombo)"
    />

    <select
      name="district"
      value={form.district}
      onChange={handleChange}
      className="p-2 border rounded"
    >
      <option value="">Select District</option>
      <option value="Colombo">Colombo</option>
      <option value="Gampaha">Gampaha</option>
      <option value="Kalutara">Kalutara</option>
      <option value="Kandy">Kandy</option>
      <option value="Galle">Galle</option>
      <option value="Kurunegala">Kurunegala</option>
      <option value="Jaffna">Jaffna</option>
      <option value="Anuradhapura">Anuradhapura</option>
      <option value="Matara">Matara</option>
      <option value="Ratnapura">Ratnapura</option>
      <option value="Kegalle">Kegalle</option>
    </select>

  </div>
</div>    


        {/* Image Upload */}
        <div className="mt-4">
          <label className="block mb-2 font-medium">
            Images <span className="text-red-500">*</span>
          </label>
          <p className="mb-2 text-sm text-gray-500">
            Upload at least 2 images. Best results come with 4 or more images.
          </p>

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
              JPG, PNG, WEBP up to 5MB (max 6 images)
            </p>
          </div>

          {selectedImages.length > 0 && selectedImages.length < 4 && (
            <p className="mt-2 text-sm text-yellow-600">
              For a better trust rating, upload at least 4 images.
            </p>
          )}

          {selectedImages.length > 0 && (
            <>
              <div className="mt-3 text-sm text-gray-600">
                {selectedImages.length} image(s) selected
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3 md:grid-cols-6">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image.file)}
                      alt={`preview-${index}`}
                      className="object-cover w-24 h-20 border rounded-lg"
                    />

                    <select
                      value={image.tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="w-full p-1 mt-2 text-sm border rounded"
                    >
                      <option value="front">Front</option>
                      <option value="rear">Rear</option>
                      <option value="side">Side</option>
                      <option value="interior">Interior</option>
                      <option value="dashboard">Dashboard</option>
                      <option value="other">Other</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="px-2 py-1 mt-2 text-xs text-white bg-red-500 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Submit */}
        <button
  type="submit"
  disabled={uploading}
  className="w-full py-3 mt-6 text-white transition bg-black rounded-xl hover:bg-gray-800 disabled:opacity-50"
>
  {uploading
    ? "Uploading images..."
    : isEdit
    ? "Update Car"
    : "🚀 Post Your Car"}
</button>
      </form>

    </div>

  );
}

export default ManualEntryForm;