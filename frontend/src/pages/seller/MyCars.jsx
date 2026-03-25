
import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerHeader from "../../components/seller/SellerHeader";
import CarRow from "../../components/seller/CarRow";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "../../lib/api";


function MyCars() {
  const api = useApi();
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const data = await api("/api/vehicles/my");
      setCars(data);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchCars();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const filteredCars = cars.filter((car) => {
    const search = searchTerm.toLowerCase();

    return (
      car.brand?.toLowerCase().includes(search) ||
      car.model?.toLowerCase().includes(search) ||
      car.title?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return <p className="p-6">Loading cars...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SellerSidebar />
      <div className="flex-1">
        <SellerHeader />
        <div className="p-6">
          <h2 className="mb-8 text-4xl font-bold">Cars Management</h2>

          <div className="flex items-center justify-between mb-6">
            <Link
              to="/seller/add-car"
              className="inline-block px-5 py-3 font-medium text-white bg-black rounded-xl hover:bg-gray-800"
            >
              + Add Car
            </Link>

            <div className="w-64">
              <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 outline-none rounded-xl"
              />
            </div>
          </div>
          <div className="overflow-visible bg-white border border-gray-200 rounded-2xl">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200">
                <tr className="text-sm text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Make & Model</th>
                  <th className="px-6 py-4 font-medium">Year</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Featured</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCars.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No cars found
                    </td>
                  </tr>
                )}

                {filteredCars.map((car) => (
                  <CarRow key={car._id || car.id} car={car} onRefresh={fetchCars} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCars;