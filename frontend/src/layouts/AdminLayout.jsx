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
    <div className="min-h-screen bg-slate-50 pt-20 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:py-10">
        <div className="h-fit w-full rounded-xl border border-slate-200 bg-white p-5 shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 lg:sticky lg:top-24 lg:w-64">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Admin Panel</h2>

          <div className="space-y-2">
            {menu.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition ${
                  location.pathname === item.path
                    ? "bg-blue-100 font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <span>{item.name}</span>
                <span>›</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => signOut(() => navigate("/"))}
            className="mt-6 w-full rounded-md border border-red-400 py-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>

        <div className="min-h-[calc(100vh-10rem)] flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
