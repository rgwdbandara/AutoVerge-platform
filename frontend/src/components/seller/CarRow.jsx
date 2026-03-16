import { useState } from "react";

function CarRow({ car }) {
  const [open, setOpen] = useState(false);
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="flex items-center gap-3 p-4">
        <img
          src={car.image}
          className="object-cover w-12 h-12 rounded"
        />
        <span>
          {car.make} {car.model}
        </span>
      </td>
      <td>{car.year}</td>
      <td>${car.price}</td>
      <td>
        <span className="px-2 py-1 text-sm text-green-700 bg-green-100 rounded">
          {car.status}
        </span>
      </td>
      <td>
        {car.featured ? "⭐" : "—"}
      </td>
      <td className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-xl"
        >
          ⋯
        </button>
        {open && (
          <div className="absolute right-0 w-40 mt-2 bg-white rounded shadow">
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
              👁 View
            </button>
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
              Set Available
            </button>
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
              Set Unavailable
            </button>
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
              Mark Sold
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default CarRow;