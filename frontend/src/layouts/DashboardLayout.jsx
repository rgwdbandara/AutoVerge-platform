import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { t } = useTranslation();
  const userName = user?.fullName || user?.firstName || user?.username || "Account";
  const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "";
  const userImage = user?.imageUrl || "";
  const avatarLetter = (user?.fullName || user?.firstName || user?.username || "A")
    .trim()
    .charAt(0)
    .toUpperCase();

  const menu = [
    { name: t("dashboard.menu.myAccount", { defaultValue: "My Account" }), path: "/profile" },
    { name: t("dashboard.menu.manageProfile", { defaultValue: "Manage Profile" }), path: "/profile/manage" },
    { name: t("dashboard.menu.myListings", { defaultValue: "My Listings" }), path: "/profile/my-cars" },
    { name: t("dashboard.menu.favorites", { defaultValue: "My Favorites" }), path: "/profile/favorites" },
    { name: t("dashboard.menu.pendingAds", { defaultValue: "Pending Ads" }), path: "/profile/pending" },
    { name: t("dashboard.menu.expiredAds", { defaultValue: "Expired Ads" }), path: "/profile/expired" },
    { name: t("dashboard.menu.phoneNumbers", { defaultValue: "Phone Numbers" }), path: "/profile/phone" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-16 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:flex-row lg:gap-6 lg:py-6">

        {/* LEFT SIDEBAR */}
        <div className="h-fit w-full rounded-xl border border-slate-200 bg-white p-5 shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 lg:sticky lg:top-20 lg:w-64">

          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/5">
            <span className="flex h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/60 bg-slate-200 shadow-sm">
              {userImage ? (
                <img src={userImage} alt={userName} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-base font-semibold text-white">
                  {avatarLetter}
                </span>
              )}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{userName}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{userEmail || "Signed in user"}</p>
            </div>
          </div>

          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">{t("dashboard.title", { defaultValue: "Dashboard" })}</h2>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {menu.map((item) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex justify-between items-center cursor-pointer px-3 py-2 rounded-md transition
                  ${
                    location.pathname === item.path
                        ? "bg-blue-100 font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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
            className="mt-6 w-full rounded-md border border-red-400 py-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10">
            {t("dashboard.logout", { defaultValue: "Logout" })}
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 sm:p-6 md:p-8">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default DashboardLayout;
