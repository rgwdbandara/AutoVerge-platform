import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();
  const { t } = useTranslation();

  const menu = [
    { name: t("admin.menu.dashboard", { defaultValue: "Dashboard" }), path: "/admin/dashboard" },
    { name: t("admin.menu.pendingAds", { defaultValue: "Pending Ads" }), path: "/admin/pending" },
    { name: t("admin.menu.cars", { defaultValue: "Cars" }), path: "/admin/cars" },
    { name: t("admin.menu.aiArticles", { defaultValue: "AI Articles" }), path: "/admin/ai-articles" },
    { name: t("admin.menu.settings", { defaultValue: "Settings" }), path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-16 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:flex-row lg:gap-6 lg:py-6">
        <div className="h-fit w-full rounded-xl border border-slate-200 bg-white p-5 shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 lg:sticky lg:top-20 lg:w-64">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">{t("admin.title", { defaultValue: "Admin Panel" })}</h2>

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
            {t("admin.logout", { defaultValue: "Logout" })}
          </button>
        </div>

        <div className="min-h-[calc(100vh-9rem)] flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
