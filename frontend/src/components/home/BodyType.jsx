import suv from "../../assets/body-types/suv.png";
import sedan from "../../assets/body-types/sedan.png";
import hatchback from "../../assets/body-types/hatchback.png";
import convertible from "../../assets/body-types/convertible.png";

import { useNavigate } from "react-router-dom";

export default function BodyType() {
  const navigate = useNavigate();

  const types = [
    { name: "SUV", image: suv },
    { name: "Sedan", image: sedan },
    { name: "Hatchback", image: hatchback },
    { name: "Convertible", image: convertible },
  ];

  return (
    <section className="bg-slate-50 py-14">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-semibold text-slate-900">Browse by Body Type</h2>

          <button
            onClick={() => navigate("/browse")}
            className="px-5 py-2 text-sm font-medium transition border rounded-full border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-white"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {types.map((type) => (
            <button
              key={type.name}
              onClick={() => navigate("/browse")}
              className="relative overflow-hidden text-left transition duration-300 bg-white border shadow-sm group h-44 rounded-2xl border-slate-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={type.image}
                alt={type.name}
                className="object-cover w-full h-full transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute flex items-center justify-between text-white bottom-4 left-4 right-4">
                <h3 className="text-xl font-semibold">{type.name}</h3>
                <span className="px-3 py-1 text-xs rounded-full bg-white/20">Explore</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}