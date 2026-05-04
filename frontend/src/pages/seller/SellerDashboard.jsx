import { useState } from "react";
import ImportedListings from "../admin/ImportedListings";

function SellerDashboard() {

  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex">

      {/* SIDEBAR */}
      <div className="w-64 p-4 bg-white shadow rounded-xl">

        <h2 className="mb-4 text-lg font-semibold">
          Admin Panel
        </h2>

        <ul className="space-y-2">

          <li
            onClick={() => setActiveTab("dashboard")}
            className={`p-2 rounded cursor-pointer ${
              activeTab === "dashboard" ? "bg-blue-100" : ""
            }`}
          >
            Dashboard
          </li>

          <li
            onClick={() => setActiveTab("pending")}
            className="p-2 rounded cursor-pointer hover:bg-gray-100"
          >
            Pending Ads
          </li>

          <li
            onClick={() => setActiveTab("cars")}
            className="p-2 rounded cursor-pointer hover:bg-gray-100"
          >
            Cars
          </li>

          {/* 🔥 NEW TAB */}
          <li
            onClick={() => setActiveTab("imported")}
            className={`p-2 rounded cursor-pointer ${
              activeTab === "imported" ? "bg-blue-100" : ""
            }`}
          >
            Imported Listings
          </li>

          <li className="p-2 text-red-500 border border-red-300 rounded cursor-pointer">
            Logout
          </li>

        </ul>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">

        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            {/* existing dashboard UI */}
          </div>
        )}

        {activeTab === "pending" && (
          <div>
            <h2 className="text-xl font-semibold">Pending Ads</h2>
          </div>
        )}

        {activeTab === "cars" && (
          <div>
            <h2 className="text-xl font-semibold">Cars</h2>
          </div>
        )}

        {/* 🔥 IMPORTED LISTINGS SHOW HERE */}
        {activeTab === "imported" && (
          <ImportedListings />
        )}

      </div>
    </div>
  );
}

export default SellerDashboard;