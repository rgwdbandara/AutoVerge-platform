import { useAuth } from "@clerk/clerk-react";
import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { useTranslation } from "react-i18next";

const normalizeBodyType = (type) => {
  const clean = (type || "").toLowerCase();
  if (clean.includes("suv")) return "SUV";
  if (clean.includes("sedan")) return "Sedan";
  if (clean.includes("hatch")) return "Hatchback";
  if (clean.includes("convert")) return "Convertible";
  if (clean.includes("coupe")) return "Coupe";
  if (clean.includes("wagon")) return "Wagon";
  if (clean.includes("liftback")) return "Liftback";
  return "";
};

function AIUpload({ onAutoFill }) {
  const { t } = useTranslation();
  const { getToken } = useAuth();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const runAutoFill = async (file) => {
    if (!file) return;

    setIsAnalyzing(true);
    setError("");
    setStatus(t("aiUpload.analyzing"));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = await getToken();

      const response = await fetch("http://localhost:5000/api/vehicles/search-by-image", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Image analysis failed.");
      }

      if (data.isVehicle === false) {
        setError(t("aiUpload.noVehicle"));
        setStatus("");
        return;
      }

      const detected = data?.detected || {};
      const mappedData = {
        brand: detected.brand || "",
        model: detected.model || "",
        bodyType: normalizeBodyType(detected.type),
        description: detected.description || "",
      };

      if (onAutoFill) {
        onAutoFill(mappedData);
      }

      setStatus(t("aiUpload.success"));
    } catch (err) {
      setError(err.message || t("aiUpload.noVehicle"));
      setStatus("");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    runAutoFill(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    runAutoFill(file);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="mb-2 text-lg font-semibold">{t("aiUpload.title")}</h3>
      <p className="mb-4 text-gray-500">
        {t("aiUpload.description")}
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="p-16 text-center border-2 border-dashed rounded cursor-pointer hover:bg-gray-50"
      >
        <UploadCloud className="w-8 h-8 mx-auto mb-3 text-gray-500" />
        <p className="font-medium">{t("aiUpload.dropzone")}</p>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-500">{t("aiUpload.selected", { name: selectedFile.name })}</p>
        )}
      </div>

      {isAnalyzing && (
        <div className="flex items-center gap-2 mt-4 text-sm text-blue-700">
          <Loader2 className="w-4 h-4 animate-spin" />
          {status}
        </div>
      )}

      {!isAnalyzing && status && (
        <div className="mt-4 text-sm font-medium text-green-700">{status}</div>
      )}

      {error && <div className="mt-4 text-sm font-medium text-red-600">{error}</div>}

      <div className="p-4 mt-6 rounded bg-gray-50">
        <h4 className="mb-2 font-semibold">{t("aiUpload.howItWorks")}</h4>
        <ol className="space-y-1 text-sm text-gray-600">
          <li>1 {t("aiUpload.step1")}</li>
          <li>2 {t("aiUpload.step2")}</li>
          <li>3 {t("aiUpload.step3")}</li>
          <li>4 {t("aiUpload.step4")}</li>
          <li>5 {t("aiUpload.step5")}</li>
        </ol>
      </div>
    </div>
  );
}

export default AIUpload;