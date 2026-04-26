import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Loader2, Search, Sparkles, X } from "lucide-react";

function Hero() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [searchResponse, setSearchResponse] = useState(null);

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
    setSearchResponse(null);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setError("");
    setSearchResponse(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCardClick = (carId) => {
    navigate(`/cars/${carId}`);
  };

  const handleSearch = async () => {
    setError("");
    setSearchResponse(null);

    if (!selectedImage) {
      setError("Please upload a car image first.");
      return;
    }

    try {
      setIsSearching(true);

      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch(
        "http://localhost:5003/api/vehicles/search-by-image",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image search failed");
      }

      console.log("IMAGE SEARCH RESPONSE:", data);
      setSearchResponse(data);
    } catch (err) {
      console.error("IMAGE SEARCH ERROR:", err);
      setError(err.message || "Something went wrong while searching.");
    } finally {
      setIsSearching(false);
    }
  };

  const results = searchResponse?.matches || [];

  const getConfidenceBadgeClasses = (confidenceLevel) => {
    switch (confidenceLevel) {
      case "Very High":
        return "bg-emerald-100 text-emerald-700";
      case "High":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "Low":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSimilarityBadgeClasses = (similarityLabel) => {
    switch (similarityLabel) {
      case "Highly Similar":
        return "bg-blue-100 text-blue-700";
      case "Similar":
        return "bg-indigo-100 text-indigo-700";
      case "Partial Match":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
  <section className="relative flex items-center justify-center min-h-screen overflow-hidden text-white">

  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 object-cover w-full h-full"
  >
    <source src="public/videos/car-bg.mp4" type="video/mp4" />
  </video>

  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/30" />

  <div className="relative z-10 max-w-6xl px-6 mx-auto text-center">
      <div className="max-w-6xl px-6 mx-auto text-center">
        <span className="inline-block px-4 py-1 mb-6 text-sm bg-blue-600 rounded-full shadow-md">
          AI-Powered Smart Platform
        </span>

        <h1 className="mb-4 text-5xl font-bold leading-tight">
          Find Your Perfect Car with
          <span className="block text-green-400">AutoVerge AI</span>
        </h1>

        <p className="mb-10 text-lg text-gray-200">
          Explore your ideal car with AI-powered matching and quick results.
        </p>

        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="flex items-center w-full overflow-hidden bg-white rounded-full shadow-2xl ring-1 ring-white/20">
              <input
                type="text"
                placeholder="Enter make, model, or use our Image Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 px-6 py-4 text-black outline-none"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleImageButtonClick}
                className="px-4 py-4 text-black transition border-l border-gray-200 hover:bg-gray-100"
                title="Upload car image"
              >
                <ImagePlus size={20} />
              </button>

              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="flex items-center justify-center gap-2 px-8 py-4 text-white transition bg-black hover:bg-gray-800 disabled:opacity-70"
              >
                {isSearching ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Searching
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Search
                  </>
                )}
              </button>
            </div>

            {selectedImage && (
              <div className="flex items-center justify-center gap-3 mt-5">
                <div className="flex items-center gap-3 px-4 py-3 bg-white shadow-lg rounded-2xl">
                  <img
                    src={previewUrl}
                    alt="Selected preview"
                    className="object-cover w-14 h-14 rounded-xl ring-2 ring-blue-100"
                  />

                  <div className="text-left">
                    <p className="text-sm font-semibold text-black">
                      Image ready for search
                    </p>
                    <p className="max-w-[180px] truncate text-xs text-gray-500">
                      {selectedImage.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 text-red-500 transition rounded-full hover:bg-red-50"
                    title="Remove image"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl px-4 py-3 mx-auto mt-5 text-sm font-medium text-red-200 border border-red-300/30 bg-red-500/20 rounded-2xl">
                {error}
              </div>
            )}

            {isSearching && (
              <div className="max-w-xl px-4 py-4 mx-auto mt-5 border bg-white/10 border-white/20 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center justify-center gap-3 text-sm text-white">
                  <Loader2 size={18} className="animate-spin" />
                  AI is analyzing your image and finding similar cars...
                </div>
              </div>
            )}

            {searchResponse && !isSearching && (
              <div className="mt-5 text-sm text-gray-200">
                Found <span className="font-semibold text-white">{searchResponse.totalMatches || 0}</span> similar result(s)
              </div>
            )}

            <p className="mt-4 text-sm text-gray-200">
              Upload a car photo or even a visible part of a vehicle.
            </p>

            {results.length > 0 && (
              <div className="mt-12 text-left">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-green-300">
                      <Sparkles size={18} />
                      <span className="text-sm font-medium">Image Search Results</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Similar Cars Found
                    </h2>
                    <p className="mt-1 text-sm text-blue-100">
                      These results are based on visual similarity from your uploaded image.
                    </p>
                  </div>

                  {searchResponse?.queryAnalysis && (
                    <div className="hidden px-4 py-3 text-sm bg-white shadow-lg md:block rounded-2xl">
                      <p className="font-semibold text-gray-900">Query Analysis</p>
                      <p className="mt-1 text-gray-600">
                        View:{" "}
                        <span className="font-medium capitalize">
                          {searchResponse.queryAnalysis.detectedViewType || "Unknown"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((car) => (
                    <div
                      key={car._id}
                      onClick={() => handleCardClick(car._id)}
                      className="overflow-hidden transition-all duration-300 bg-white shadow-xl cursor-pointer rounded-3xl hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="relative">
                        <img
                          src={car.matchedImage}
                          alt={car.title}
                          className="object-cover w-full h-56"
                        />

                        <div className="absolute flex flex-wrap gap-2 top-4 left-4">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getConfidenceBadgeClasses(
                              car.confidenceLevel
                            )}`}
                          >
                            {car.confidenceLevel || "Match"}
                          </span>

                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getSimilarityBadgeClasses(
                              car.similarityLabel
                            )}`}
                          >
                            {car.similarityLabel}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {car.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {car.brand} {car.model} • {car.year}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                          <div className="p-3 rounded-2xl bg-gray-50">
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="mt-1 font-semibold text-gray-900">
                              Rs. {car.price?.toLocaleString?.() ?? car.price}
                            </p>
                          </div>

                          <div className="p-3 rounded-2xl bg-gray-50">
                            <p className="text-xs text-gray-500">Trust Level</p>
                            <p className="mt-1 font-semibold text-gray-900">
                              {car.trustLevel || "N/A"}
                            </p>
                          </div>

                          <div className="p-3 rounded-2xl bg-gray-50">
                            <p className="text-xs text-gray-500">Body Type</p>
                            <p className="mt-1 font-semibold text-gray-900">
                              {car.bodyType || "N/A"}
                            </p>
                          </div>

                          <div className="p-3 rounded-2xl bg-gray-50">
                            <p className="text-xs text-gray-500">Grade</p>
                            <p className="mt-1 font-semibold text-gray-900">
                              {car.autoTrustGrade || "N/A"}
                            </p>
                          </div>
                        </div>

                        {car.explanation && (
                          <div className="p-4 mt-5 border border-blue-100 bg-blue-50 rounded-2xl">
                            <p className="text-sm leading-6 text-gray-700">
                              {car.explanation}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-5">
                          {car.matchedViewType && (
                            <span className="px-3 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
                              View: {car.matchedViewType}
                            </span>
                          )}

                          {car.matchedBodyTypeHint && (
                            <span className="px-3 py-1 text-xs text-purple-700 bg-purple-100 rounded-full">
                              Hint: {car.matchedBodyTypeHint}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResponse && results.length === 0 && !error && !isSearching && (
              <div className="mt-10">
                <div className="px-6 py-10 bg-white shadow-2xl rounded-3xl">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-700 bg-blue-100 rounded-full">
                    <Search size={28} />
                  </div>

                  <p className="text-xl font-bold text-gray-800">
                    No similar cars found
                  </p>
                  <p className="max-w-md mx-auto mt-3 text-sm leading-6 text-gray-500">
                    Try uploading a clearer image, a larger visible vehicle part,
                    or a different angle for better AI matching results.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}

export default Hero;