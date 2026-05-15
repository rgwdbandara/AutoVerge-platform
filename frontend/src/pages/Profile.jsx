import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MyCars from "./seller/MyCars";
import MyFavorites from "./MyFavorites";

function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("my-account");

  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-20 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white md:px-6">

      <div className="mx-auto flex max-w-[1500px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 lg:flex-row">

        {/* LEFT SIDEBAR */}
        <div className="w-full border-r border-slate-200 p-4 dark:border-white/10 lg:block lg:w-1/5 lg:p-6">

          <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Dashboard</h2>

          <div className="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300 sm:grid-cols-3 lg:flex lg:flex-col lg:space-y-4 lg:gap-0">

            <button
              type="button"
              onClick={() => setActiveSection("my-account")}
              className={`flex items-center justify-between w-full cursor-pointer transition ${
                activeSection === "my-account" ? "text-blue-600 font-medium dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <span>My Account</span>
              <span>›</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile/manage")}
              className="flex w-full items-center justify-between transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              <span>Manage Profile</span>
              <span>›</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("my-favorites")}
              className={`flex items-center justify-between w-full cursor-pointer transition ${
                activeSection === "my-favorites" ? "text-blue-600 font-medium dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <span>❤️ My Favorites</span>
              <span>›</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile/expired-ads")}
              className="flex w-full items-center justify-between transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              <span>Expired Ads</span>
              <span>›</span>
            </button>

            <div className="flex items-center justify-between transition cursor-pointer hover:text-blue-600">
              <span>Pending Ads</span>
              <span>›</span>
            </div>

           

          </div>

          {/* LOGOUT */}
          <button
            onClick={() => signOut(() => navigate("/"))}
            className="mt-10 rounded-lg border border-red-500 px-4 py-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            Logout
          </button>

        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full p-4 sm:p-6 md:p-8 lg:w-4/5 lg:p-10">

          {/* USER NAME */}
          <h1 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-white sm:mb-6">
            {user?.fullName}
          </h1>

          <hr className="mb-10 border-slate-200 dark:border-white/10" />

          {activeSection === "my-account" && <MyCars />}
          {activeSection === "my-favorites" && <MyFavorites />}
        </div>

      </div>

    </div>
  );
}

export default Profile;