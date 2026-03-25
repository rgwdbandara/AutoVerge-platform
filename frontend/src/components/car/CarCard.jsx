import { Link } from "react-router-dom";

function CarCard({ car }) {
  return (
    <Link to={`/cars/${car._id}`}>
      <div className="overflow-hidden transition bg-white shadow cursor-pointer rounded-xl hover:shadow-lg">
        {/* Image */}
        <img
          src={car.images?.[0] || "https://via.placeholder.com/400"}
          className="object-cover w-full h-52"
        />

        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold">{car.title}</h3>
          <p className="text-lg font-semibold text-blue-600">
            LKR {Number(car.price || 0).toLocaleString()}
          </p>

          <div className="flex gap-3 mt-2 text-sm text-gray-500">
            <span>{car.year}</span>
            <span>{car.transmission}</span>
            <span>{car.fuelType}</span>
          </div>

          <button className="w-full py-2 mt-4 text-white bg-black rounded-lg hover:bg-gray-800">
            View Car
          </button>
        </div>
      </div>
    </Link>
  );
}

export default CarCard;