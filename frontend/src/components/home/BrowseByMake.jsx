
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import bmw from "../../assets/logos/bmw.webp";
import ford from "../../assets/logos/ford.webp";
import honda from "../../assets/logos/honda.webp";
import hyundai from "../../assets/logos/hyundai.webp";
import mahindra from "../../assets/logos/mahindra.webp";
import tata from "../../assets/logos/tata.webp";

const makes = [
  { name: "BMW", image: bmw },
  { name: "Ford", image: ford },
  { name: "Honda", image: honda },
  { name: "Hyundai", image: hyundai },
  { name: "Mahindra", image: mahindra },
  { name: "Tata", image: tata },
];


function BrowseByMake() {
  const { t } = useTranslation();
  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-24 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t("home.browseByMake.title", { defaultValue: "Browse by Make" })}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t("home.browseByMake.subtitle", { defaultValue: "Popular brands" })}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {makes.map((make) => (
            <Link
              key={make.name}
              to={`/browse?make=${make.name}`}
              className="group flex flex-col items-center rounded-xl bg-white dark:bg-slate-900 p-6 shadow transition hover:-translate-y-2 hover:shadow-lg border border-slate-200 dark:border-white/10"
            >
              <img
                src={make.image}
                alt={make.name}
                className="object-contain h-12 mb-3 transition-transform duration-300 group-hover:scale-105"
              />
              <p className="font-medium text-slate-900 dark:text-white">{make.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrowseByMake;