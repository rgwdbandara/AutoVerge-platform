import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";

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
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const runAutoFill = async (file) => {
    if (!file) return;

    setIsAnalyzing(true);
    setError("");
    setStatus("Running visual similarity analysis...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5003/api/vehicles/search-by-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Image analysis failed.");
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

      setStatus("Details extracted and applied to Manual Entry form.");
    } catch (err) {
      setError(err.message || "Failed to extract details from image.");
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
      <h3 className="mb-2 text-lg font-semibold">AI-Powered Car Details Extraction</h3>
      <p className="mb-4 text-gray-500">
        Upload a car image and the Manual Entry form will auto-fill detected details.
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
        <p className="font-medium">Drag & drop or click to upload car image</p>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-500">Selected: {selectedFile.name}</p>
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
        <h4 className="mb-2 font-semibold">How it works</h4>
        <ol className="space-y-1 text-sm text-gray-600">
          <li>1 Upload car image</li>
          <li>2 Visual feature analysis runs on the image</li>
          <li>3 Brand, model, and body type are detected when available</li>
          <li>4 Manual Entry form auto-fills automatically</li>
          <li>5 Review and complete remaining fields</li>
        </ol>
      </div>
    </div>
  );
}

export default AIUpload;