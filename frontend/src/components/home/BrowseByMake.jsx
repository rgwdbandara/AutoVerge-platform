
import { Link } from "react-router-dom";

import honda from "../../assets/logos/bmw.webp";
import bmw from "../../assets/logos/ford.webp";
import hyundai from "../../assets/logos/honda.webp";
import ford from "../../assets/logos/hyundai.webp";
import tesla from "../../assets/logos/mahindra.webp";
import toyota from "../../assets/logos/tata.webp";

const makes = [
  { name: "Toyota", image: toyota },
  { name: "Honda", image: honda },
  { name: "BMW", image: bmw },
  { name: "Hyundai", image: hyundai },
  { name: "Ford", image: ford },
  { name: "Tesla", image: tesla },
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