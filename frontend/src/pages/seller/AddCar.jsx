import { useState } from "react";
import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerHeader from "../../components/seller/SellerHeader";
import ManualEntryForm from "../../components/seller/ManualEntryForm";
import AIUpload from "../../components/seller/AIUpload";

function AddCar() {

  const [tab,setTab] = useState("manual");

  return (
    <div className="flex min-h-screen bg-gray-100">

      <SellerSidebar />

      <div className="flex-1">

        <SellerHeader />

        <div className="p-6">

          <h2 className="text-2xl font-bold mb-6">
            Add New Car
          </h2>

          {/* Tabs */}

          <div className="flex bg-gray-200 rounded mb-6">

            <button
              onClick={()=>setTab("manual")}
              className={`flex-1 p-2 rounded ${
                tab==="manual" ? "bg-white shadow" : ""
              }`}
            >
              Manual Entry
            </button>

            <button
              onClick={()=>setTab("ai")}
              className={`flex-1 p-2 rounded ${
                tab==="ai" ? "bg-white shadow" : ""
              }`}
            >
              AI Upload
            </button>

          </div>

          {/* Content */}

          {tab==="manual" && <ManualEntryForm />}
          {tab==="ai" && <AIUpload />}

        </div>

      </div>

    </div>
  );
}

export default AddCar;