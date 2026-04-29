
import { Link } from "react-router-dom";

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
  return (
    <section className="py-12 bg-gray-50">
      <div className="px-6 mx-auto max-w-7xl">

        <div className="flex justify-between mb-8">
          <h2 className="text-2xl font-bold">Browse by Make</h2>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {makes.map((make) => (
            <Link
              key={make.name}
              to={`/browse?make=${make.name}`}
              className="flex flex-col items-center p-6 transition bg-white shadow rounded-xl hover:shadow-lg"
            >
              <img
                src={make.image}
                alt={make.name}
                className="object-contain h-12 mb-3"
              />
              <p className="font-medium">{make.name}</p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default BrowseByMake;