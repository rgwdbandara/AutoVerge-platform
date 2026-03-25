import { Link } from "react-router-dom";

function SellerSidebar() {
  return (
    <div className="w-64 min-h-screen bg-white shadow-md">

      <div className="p-6 text-xl font-bold">
        Seller Panel
      </div>

      <nav className="flex flex-col gap-2 px-4">

        <Link to="/seller/dashboard" className="p-2 rounded hover:bg-gray-100">
          Dashboard
        </Link>

        <Link to="/seller/cars" className="p-2 rounded hover:bg-gray-100">
          My Cars
        </Link>

        <Link to="/seller/add-car" className="p-2 rounded hover:bg-gray-100">
          Add Car
        </Link>

        <Link to="/seller/settings" className="p-2 rounded hover:bg-gray-100">
          Settings
        </Link>

      </nav>

    </div>
  );
}

export default SellerSidebar;