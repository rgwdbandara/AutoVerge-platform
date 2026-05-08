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
    return <p className="p-10 text-center text-slate-600 dark:text-slate-300">Loading...</p>;
  }

  if (!car) {
    return <p className="p-10 text-center text-slate-600 dark:text-slate-300">Car not found</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-20 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white sm:px-6">

      <div className="mx-auto max-w-4xl">

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