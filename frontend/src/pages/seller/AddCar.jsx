import { useState } from "react";
import { useTranslation } from "react-i18next";
import ManualEntryForm from "../../components/seller/ManualEntryForm";
import AIUpload from "../../components/seller/AIUpload";

function AddCar() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("manual");
  const [aiPrefillData, setAiPrefillData] = useState(null);

  const handleAiAutoFill = (data) => {
    setAiPrefillData(data);
    setActiveTab("manual");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-6 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white sm:px-4 sm:py-10">

      <div className="max-w-6xl mx-auto">

        {/* 🔹 TAB SWITCH */}
        <div className="mb-6 flex flex-col overflow-hidden rounded-xl bg-white shadow transition-colors duration-300 dark:bg-slate-900 sm:flex-row">
          
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === "manual"
                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {t("addCar.manualEntry")}
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === "ai"
                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {t("addCar.aiUpload")}
          </button>

        </div>

        {/* 🔹 CONTENT SWITCH */}
        <div>
          {activeTab === "manual" && <ManualEntryForm initialData={aiPrefillData} />}
          {activeTab === "ai" && <AIUpload onAutoFill={handleAiAutoFill} />}
        </div>

      </div>
    </div>
  );
}

export default AddCar;