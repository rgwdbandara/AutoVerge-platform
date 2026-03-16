
import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerHeader from "../../components/seller/SellerHeader";
import CarRow from "../../components/seller/CarRow";
import { useState } from "react";


function MyCars() {
  const [cars] = useState([
    {
      id:1,
      image:"https://cdn.motor1.com/images/mgl/Bx6p0/s1/range-rover.jpg",
      make:"Land Rover",
      model:"Range Rover",
      year:2023,
      price:150000,
      status:"Available",
      featured:false
    },
    {
      id:2,
      image:"https://imgd.aeplcdn.com/664x374/n/cw/ec/124839/thar-exterior-right-front-three-quarter.jpeg",
      make:"Mahindra",
      model:"Thar",
      year:2023,
      price:25000,
      status:"Available",
      featured:false
    }
  ]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SellerSidebar />
      <div className="flex-1">
        <SellerHeader />
        <div className="p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <button className="px-4 py-2 text-white bg-black rounded">
              + Add Car
            </button>
            <input
              type="text"
              placeholder="Search cars..."
              className="w-64 px-3 py-2 border rounded"
            />
          </div>
          {/* Table */}
          <table className="w-full overflow-hidden bg-white rounded-lg shadow">
            <thead className="border-b bg-gray-50">
              <tr className="text-sm text-left text-gray-600">
                <th className="p-4">Make & Model</th>
                <th>Year</th>
                <th>Price</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <CarRow key={car.id} car={car} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyCars;