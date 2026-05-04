import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Pending Ads", path: "/admin/pending" },
    { name: "Cars", path: "/admin/cars" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10">
        <div className="sticky top-24 h-fit w-64 rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">Admin Panel</h2>

          <div className="space-y-2">
            {menu.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition ${
                  location.pathname === item.path
                    ? "bg-blue-100 font-medium text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <span>{item.name}</span>
                <span>›</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => signOut(() => navigate("/"))}
            className="mt-6 w-full rounded-md border border-red-400 py-2 text-red-500 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>

        <div className="min-h-[calc(100vh-10rem)] flex-1 rounded-xl bg-white p-6 shadow md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
