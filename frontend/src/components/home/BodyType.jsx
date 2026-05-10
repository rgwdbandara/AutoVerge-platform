import suv from "../../assets/body-types/suv.png";
import sedan from "../../assets/body-types/sedan.png";
import hatchback from "../../assets/body-types/hatchback.png";
import convertible from "../../assets/body-types/convertible.png";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BodyType() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const types = [
    { name: "SUV", image: suv },
    { name: "Sedan", image: sedan },
    { name: "Hatchback", image: hatchback },
    { name: "Convertible", image: convertible },
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-24 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{t("home.bodyType.title", { defaultValue: "Browse by Body Type" })}</h2>

          <button
            onClick={() => navigate("/browse")}
            className="px-5 py-2 text-sm font-medium transition rounded-full border border-slate-200 text-slate-700 hover:border-slate-500 hover:bg-white dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t("home.bodyType.viewAll", { defaultValue: "View All" })}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {types.map((type) => (
            <button
              key={type.name}
              onClick={() => navigate("/browse")}
              className="group relative h-44 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
            >
              <img
                src={type.image}
                alt={type.name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

              <div className="absolute flex items-center justify-between text-white bottom-4 left-4 right-4">
                <h3 className="text-xl font-semibold">{type.name}</h3>
                <span className="px-3 py-1 text-xs rounded-full bg-white/20">{t("home.bodyType.explore", { defaultValue: "Explore" })}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}