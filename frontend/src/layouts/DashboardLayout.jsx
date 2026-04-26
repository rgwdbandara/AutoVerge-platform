import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();

  const menu = [
    { name: "My Account", path: "/profile" },
    { name: "Manage Profile", path: "/profile/manage" },
    { name: "My Listings", path: "/profile/my-cars" },
    { name: "Pending Ads", path: "/profile/pending" },
    { name: "Expired Ads", path: "/profile/expired" },
    { name: "Phone Numbers", path: "/profile/phone" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">

        {/* LEFT SIDEBAR */}
        <div className="w-64 bg-white shadow rounded-xl p-5 h-fit sticky top-24">

          <h2 className="text-lg font-semibold mb-4">Dashboard</h2>

          <div className="space-y-2">
            {menu.map((item) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex justify-between items-center cursor-pointer px-3 py-2 rounded-md transition
                  ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : "hover:bg-gray-100"
                  }`}
              >
                <span>{item.name}</span>
                <span>›</span>
              </div>
            ))}
          </div>

          {/* Logout */}
          <button 
            onClick={() => signOut(() => navigate("/"))}
            className="mt-6 w-full border border-red-400 text-red-500 py-2 rounded-md hover:bg-red-50 transition">
            Logout
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 bg-white rounded-xl shadow p-6 md:p-8">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default DashboardLayout;
