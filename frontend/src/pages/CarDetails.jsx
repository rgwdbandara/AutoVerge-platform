import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "../lib/api";

function CarDetails() {
  const { id } = useParams();
  const api = useApi();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const loadCar = async () => {
      const data = await api(`/api/vehicles/${id}`);
      setCar(data);
    };
    loadCar();
  }, [id]);

  if (!car) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <img src={car.images?.[0]} className="w-full mb-6 rounded-xl" />
      <h1 className="text-3xl font-bold">{car.title}</h1>
      <p className="mt-2 text-2xl font-semibold text-blue-600">
        LKR {car.price?.toLocaleString()}
      </p>

      <div className="mt-6 space-y-2 text-gray-700">
        <p>Brand: {car.brand}</p>
        <p>Model: {car.model}</p>
        <p>Year: {car.year}</p>
        <p>Mileage: {car.mileage}</p>
        <p>Fuel: {car.fuelType}</p>
        <p>Transmission: {car.transmission}</p>
      </div>
    </div>
  );
}

export default CarDetails;