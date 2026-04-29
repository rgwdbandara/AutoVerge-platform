import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../lib/api";
import ManualEntryForm from "../../components/seller/ManualEntryForm";

function EditCar() {
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 LOAD CAR DATA
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await api(`/api/vehicles/${id}`);
        setCar(data);
      } catch (err) {
        console.error("Error loading car:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, api]);

  // 🔹 UPDATE HANDLER
  const handleUpdate = async (updatedData) => {
    try {
      await api(`/api/vehicles/${id}`, {
        method: "PUT",
        body: updatedData,
      });

      alert("Car updated successfully ✅");
      navigate("/profile");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed ❌");
    }
  };

  if (loading) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  if (!car) {
    return <p className="p-10 text-center">Car not found</p>;
  }

  return (
    <div className="min-h-screen px-6 pt-20 bg-gray-100">

      <div className="max-w-4xl mx-auto">

        {/* 🔥 ONLY FORM */}
        <ManualEntryForm
          initialData={car}
          onSubmit={handleUpdate}
          isEdit={true}
        />

      </div>

    </div>
  );
}

export default EditCar;