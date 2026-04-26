import { useState } from "react";
import ManualEntryForm from "../../components/seller/ManualEntryForm";
import AIUpload from "../../components/seller/AIUpload";

function AddCar() {
  const [activeTab, setActiveTab] = useState("manual");

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100">

      <div className="max-w-6xl mx-auto">

        {/* 🔹 TAB SWITCH */}
        <div className="flex mb-6 overflow-hidden bg-white shadow rounded-xl">
          
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === "manual"
                ? "bg-gray-100 text-black"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Manual Entry
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === "ai"
                ? "bg-gray-100 text-black"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            AI Upload
          </button>

        </div>

        {/* 🔹 CONTENT SWITCH */}
        <div>
          {activeTab === "manual" && <ManualEntryForm />}
          {activeTab === "ai" && <AIUpload />}
        </div>

      </div>
    </div>
  );
}

export default AddCar;