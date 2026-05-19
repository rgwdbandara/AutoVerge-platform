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
  ];

  return (
    <div className="min-h-screen pt-6 transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white sm:pt-8">
      <div className="flex flex-col gap-4 px-4 py-2 mx-auto max-w-7xl sm:px-6 lg:flex-row lg:gap-6 lg:py-3">

        {/* LEFT SIDEBAR */}
        <div className="w-full p-5 transition-colors duration-300 bg-white border shadow h-fit rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900 lg:sticky lg:top-20 lg:w-64">

          <div className="flex items-center gap-3 p-3 mb-5 border rounded-2xl border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-white/5">
            <span className="flex w-12 h-12 overflow-hidden border rounded-full shadow-sm shrink-0 border-white/60 bg-slate-200">
              {userImage ? (
                <img src={userImage} alt={userName} className="object-cover w-full h-full" />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-base font-semibold text-white bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500">
                  {avatarLetter}
                </span>
              )}
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{userName}</p>
              <p className="text-xs truncate text-slate-500 dark:text-slate-400">{userEmail || "Signed in user"}</p>
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
            className="w-full py-2 mt-6 text-red-500 transition border border-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10">
            {t("dashboard.logout", { defaultValue: "Logout" })}
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 p-4 transition-colors duration-300 bg-white border shadow rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900 sm:p-6 md:p-8">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default DashboardLayout;
