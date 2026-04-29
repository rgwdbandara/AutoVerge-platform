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
    <div className="min-h-screen px-4 pt-20 bg-gray-100 md:px-6">

      <div className="flex mx-auto bg-white shadow max-w-[1500px] rounded-xl">

        {/* LEFT SIDEBAR */}
        <div className="hidden w-1/5 p-6 border-r lg:block">

          <h2 className="mb-6 text-lg font-semibold">Dashboard</h2>

          <div className="space-y-4 text-gray-700">

            <button
              type="button"
              onClick={() => setActiveSection("my-account")}
              className={`flex items-center justify-between w-full cursor-pointer transition ${
                activeSection === "my-account" ? "text-blue-600 font-medium" : "hover:text-blue-600"
              }`}
            >
              <span>My Account</span>
              <span>›</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile/manage")}
              className="flex items-center justify-between w-full transition hover:text-blue-600"
            >
              <span>Manage Profile</span>
              <span>›</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("my-favorites")}
              className={`flex items-center justify-between w-full cursor-pointer transition ${
                activeSection === "my-favorites" ? "text-blue-600 font-medium" : "hover:text-blue-600"
              }`}
            >
              <span>❤️ My Favorites</span>
              <span>›</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile/expired-ads")}
              className="flex items-center justify-between w-full transition hover:text-blue-600"
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
            className="px-4 py-2 mt-10 text-red-500 transition border border-red-500 rounded-lg hover:bg-red-50"
          >
            Logout
          </button>

        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full p-6 md:p-8 lg:w-4/5 lg:p-10">

          {/* USER NAME */}
          <h1 className="mb-6 text-2xl font-semibold">
            {user?.fullName}
          </h1>

          <hr className="mb-10" />

          {activeSection === "my-account" && <MyCars />}
          {activeSection === "my-favorites" && <MyFavorites />}
        </div>

      </div>

    </div>
  );
}

export default Profile;