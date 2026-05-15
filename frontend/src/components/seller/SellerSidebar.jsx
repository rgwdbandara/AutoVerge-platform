import { Link } from "react-router-dom";

function SellerSidebar() {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-md transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 lg:min-h-screen lg:w-64 lg:rounded-none">

      <div className="p-4 text-xl font-bold text-slate-900 dark:text-white lg:p-6">
        Seller Panel
      </div>

      <nav className="grid grid-cols-2 gap-2 px-4 pb-4 lg:flex lg:flex-col">

        <Link to="/seller/dashboard" className="rounded p-2 text-slate-700 transition-colors duration-300 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:p-2">
          Dashboard
        </Link>

        <Link to="/seller/cars" className="rounded p-2 text-slate-700 transition-colors duration-300 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:p-2">
          My Cars
        </Link>

        <Link to="/seller/add-car" className="rounded p-2 text-slate-700 transition-colors duration-300 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:p-2">
          Add Car
        </Link>

        <Link to="/seller/settings" className="rounded p-2 text-slate-700 transition-colors duration-300 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:p-2">
          Settings
        </Link>

      </nav>

    </div>
  );
}

export default SellerSidebar;