import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../lib/api";

function CarRow({ car, onRefresh }) {
  const [open, setOpen] = useState(false);
  const api = useApi();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkSold = async () => {
    try {
      const res = await api(`/api/vehicles/${car._id || car.id}/sold`, {
        method: "PATCH",
      });

      if (res.message === "Not authorized") {
        alert("You are not allowed to update this car");
        return;
      }

      alert("Marked as sold");
      setOpen(false);
      onRefresh();
    } catch (error) {
      console.error("Mark sold error:", error);
      alert("Failed to update status");
    }
  };

  const handleSetAvailable = async () => {
    try {
      const res = await api(`/api/vehicles/${car._id || car.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "active" }),
      });

      if (res.message === "Not authorized") {
        alert("You are not allowed to update this car");
        return;
      }

      alert("Marked as available");
      setOpen(false);
      onRefresh();
    } catch (error) {
      console.error("Set available error:", error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this car?");

    if (!confirmed) return;

    try {
      const res = await api(`/api/vehicles/${car._id || car.id}`, {
        method: "DELETE",
      });

      if (res.message === "Not authorized") {
        alert("You are not allowed to delete this car");
        return;
      }

      alert("Car deleted successfully");
      setOpen(false);
      onRefresh();

    } catch (error) {
      console.error(error);
      alert("Failed to delete car");
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={car.images?.[0] || "https://via.placeholder.com/80"}
            alt={`${car.brand} ${car.model}`}
            className="object-cover w-10 h-10 rounded-lg"
          />

          <span className="font-medium text-gray-900">
            {car.brand} {car.model}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-gray-700">{car.year}</td>

      <td className="px-6 py-4 text-gray-700">
        LKR {Number(car.price || 0).toLocaleString()}
      </td>

      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
            car.status?.toLowerCase() === "sold"
              ? "bg-blue-100 text-blue-700"
              : car.status?.toLowerCase() === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {car.status?.toLowerCase() === "sold" ? "Sold" : "Available"}
        </span>
      </td>

      <td className="px-6 py-4 text-gray-500">
        {car.featured ? "⭐" : "✩"}
      </td>

      <td ref={menuRef} className="relative px-6 py-4 text-right">
        <button
          onClick={() => setOpen(!open)}
          className="text-xl font-bold text-gray-700 hover:text-black"
        >
          ...
        </button>

        {open && (
          <div className="absolute z-20 w-48 overflow-hidden text-left bg-white border border-gray-200 shadow-lg right-6 top-14 rounded-xl">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-900">Actions</p>
            </div>

            <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50">
              👁 View
            </button>

            <Link
              to={`/seller/edit-car/${car._id}`}
              className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
            >
              ✏️ Edit
            </Link>

            <div className="px-4 py-3 border-t border-gray-100">
              <p className="mb-2 font-semibold text-gray-900">Status</p>

              <button
                onClick={handleSetAvailable}
                className="block w-full py-2 text-left text-gray-400"
              >
                Set Available
              </button>

              <button
                onClick={handleMarkSold}
                className="block w-full py-2 text-left text-gray-700 hover:text-black"
              >
                Mark Sold
              </button>

              <button
                onClick={handleDelete}
                className="block w-full py-2 text-left text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}

export default CarRow;