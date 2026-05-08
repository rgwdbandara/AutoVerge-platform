import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Loader2, Search, Sparkles, X } from "lucide-react";
import ImageSearchResultCard from "./seller/ImageSearchResultCard";


import hero1 from "../assets/hero/hero1.jpg";
import hero2 from "../assets/hero/hero2.jpg";
import hero3 from "../assets/hero/hero3.jpg";
import hero4 from "../assets/hero/hero4.jpg";
import hero5 from "../assets/hero/hero5.jpg";
import hero6 from "../assets/hero/hero6.jpg";
import hero7 from "../assets/hero/hero7.jpg";

const slides = [hero1, hero2, hero3, hero4, hero5, hero6, hero7];

function Hero() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("autoverge_theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const fileInputRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [searchResponse, setSearchResponse] = useState(null);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [featuredCarIndex, setFeaturedCarIndex] = useState(0);

  useEffect(() => {
    const message = "Type a make, model, or upload a car image...";
    let index = 0;

    const interval = setInterval(() => {
      index += 1;
      setTypedText(message.slice(0, index));

      if (index >= message.length) {
        clearInterval(interval);
      }
    }, 34);

    return () => clearInterval(interval);
  }, []);

  // Fetch featured cars
  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await fetch("http://localhost:5003/api/vehicles?limit=6");
        const data = await response.json();
        if (data.vehicles) {
          setFeaturedCars(data.vehicles);
        }
      } catch (err) {
        console.error("Failed to fetch featured cars:", err);
      }
    };
    fetchFeaturedCars();
  }, []);

  // Featured cars carousel rotation
  useEffect(() => {
    if (featuredCars.length === 0) return;
    
    const interval = setInterval(() => {
      setFeaturedCarIndex((prev) => (prev + 1) % featuredCars.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [featuredCars.length]);

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

      const response = await fetch("http://localhost:5003/api/vehicles/search-by-image", {
        method: "POST",
        body: formData,
      });

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

  const results = (searchResponse?.results || []).slice(0, 3);
  const showNoVehicleMessage = Boolean(searchResponse && searchResponse.isVehicle === false);
  const showNoResultsMessage = Boolean(
    searchResponse && searchResponse.isVehicle !== false && results.length === 0 && !isSearching
  );
  const detectedAnalysis = searchResponse?.detected;
  const analysisDescription =
    detectedAnalysis?.description ||
    "The uploaded vehicle image was analyzed and the closest available matches are shown below.";

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background image - always renders */}
      <img
        src={slides[currentSlide]}
        alt="Hero Background"
        className="absolute inset-0 object-cover w-full h-full transition-all duration-1000"
      />

      {/* Overlay - adjusts based on theme */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20"
            : "bg-gradient-to-r  via-white/40 to-white/10"
        }`}
      />

      {/* Accent gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_40%)]" />

      <div className="relative z-10 w-full px-4 py-10 mx-auto max-w-7xl md:px-6 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium border rounded-full backdrop-blur-md transition-colors duration-300 ${
              theme === "dark"
                ? "bg-white/20 border-white/20 text-white"
                : "bg-black/20 border-black/20 text-white"
            }`}>
              <Sparkles size={16} className="text-amber-300" />
              AI-Powered Smart Platform
            </div>

            <h1 className={`text-4xl font-black leading-tight md:text-6xl lg:text-7xl transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-white"
            }`}>
              Find Your Perfect Car with
              <span className="block mt-2 text-transparent bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text">
                AutoVerge AI
              </span>
            </h1>

            <div className={`mt-5 text-base h-7 md:text-lg transition-colors duration-300 ${
              theme === "dark" ? "text-white/90" : "text-white/80"
            }`}>
              <span className={`pr-1 border-r-2 animate-pulse ${
                theme === "dark" ? "border-white/70" : "border-white/50"
              }`}>
                {typedText}
              </span>
            </div>

            <p className={`max-w-2xl mt-4 text-base leading-7 md:text-lg transition-colors duration-300 ${
              theme === "dark" ? "text-white/80" : "text-white/70"
            }`}>
              Explore your ideal car with AI-powered matching, quick results,
              and a clean search experience built for speed.
            </p>

            <div className="mt-8">
              <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-3xl ring-1 ring-white/15 md:flex-row">
                <input
                  type="text"
                  placeholder="Enter make, model, or use our Image Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="flex-1 px-6 py-4 text-black outline-none md:px-7"
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
                  className="flex items-center justify-center gap-2 px-5 py-4 text-black transition border-t border-gray-200 md:border-t-0 md:border-l hover:bg-gray-50"
                  title="Upload car image"
                >
                  <ImagePlus size={20} />
                  <span className="text-sm font-medium">Image</span>
                </button>

                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="flex items-center justify-center gap-2 px-8 py-4 text-white transition bg-slate-950 hover:bg-slate-800 disabled:opacity-70"
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

              <p className="mt-4 text-sm text-white/70">
                Upload a car photo or even a visible part of a vehicle.
              </p>

              {selectedImage && (
                <div className="flex items-center gap-3 p-4 mt-5 border shadow-lg w-fit bg-white/95 rounded-2xl border-white/20 text-slate-900 backdrop-blur-md">
                  <img
                    src={previewUrl}
                    alt="Selected preview"
                    className="object-cover w-14 h-14 rounded-xl ring-2 ring-blue-100"
                  />

                  <div className="text-left">
                    <p className="text-sm font-semibold">Image ready for search</p>
                    <p className="max-w-[220px] truncate text-xs text-slate-500">
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
              )}

              {error && (
                <div className="max-w-xl px-4 py-3 mt-5 text-sm font-medium text-red-200 border border-red-300/30 bg-red-500/20 rounded-2xl">
                  {error}
                </div>
              )}

              {isSearching && (
                <div className="max-w-xl px-4 py-4 mt-5 border bg-white/10 border-white/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-3 text-sm text-white">
                    <Loader2 size={18} className="animate-spin" />
                    AI is analyzing your image and finding similar cars...
                  </div>
                </div>
              )}

              {searchResponse && searchResponse.isVehicle !== false && !isSearching && (
                <div className="mt-5 text-sm text-white/80">
                  Found <span className="font-semibold text-white">{searchResponse.totalMatches || 0}</span> similar result(s)
                </div>
              )}

              {/* Featured Cars Carousel */}
              {!searchResponse && featuredCars.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs tracking-wider uppercase text-white/60">Featured</p>
                      <h3 className="text-lg font-bold text-white">Popular Vehicles</h3>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden">
                    <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${featuredCarIndex * 100}%)` }}>
                      {featuredCars.map((car) => (
                        <div key={car._id} className="min-w-full px-2">
                          <div 
                            onClick={() => car._id && handleCardClick(car._id)}
                            className="overflow-hidden transition border cursor-pointer bg-white/10 backdrop-blur-xl border-white/20 rounded-2xl hover:border-white/40"
                          >
                            <div className="relative h-48 overflow-hidden bg-white/5">
                              {car.images && car.images[0] && (
                                <img 
                                  src={car.images[0]} 
                                  alt={car.title}
                                  className="object-cover w-full h-full"
                                />
                              )}
                            </div>
                            <div className="p-4">
                              <h4 className="mb-1 text-sm font-bold text-white">{car.title}</h4>
                              <p className="mb-3 text-xs text-white/60">{car.year} • {car.mileage || "N/A"} km</p>
                              <p className="text-base font-bold text-blue-400">LKR {car.price?.toLocaleString() || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Carousel indicators */}
                  <div className="flex justify-center gap-2 mt-4">
                    {featuredCars.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setFeaturedCarIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === featuredCarIndex ? "bg-blue-400 w-6" : "bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative p-5 border shadow-2xl bg-white/10 rounded-[2rem] border-white/15 backdrop-blur-xl">
              <div className="grid gap-4">
                <div className="p-5 shadow-xl bg-white/90 rounded-3xl text-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Smart Search</p>
                  <p className="mt-3 text-lg font-bold">Typed search + image search in one place</p>
                  <p className="mt-2 text-sm text-slate-600">Search by make, model, location, or upload a photo and let AI match visually similar cars.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border bg-white/10 rounded-2xl border-white/10">
                    <p className="text-xs text-white/60">Fast</p>
                    <p className="mt-1 text-xl font-bold">Quick Results</p>
                  </div>
                  <div className="p-4 border bg-white/10 rounded-2xl border-white/10">
                    <p className="text-xs text-white/60">AI</p>
                    <p className="mt-1 text-xl font-bold">Visual Match</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {searchResponse && (
          <div className="mt-12 text-left">
            <div className="p-5 mb-8 border shadow-2xl bg-white/12 rounded-3xl border-white/15 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center flex-shrink-0 text-white rounded-full w-11 h-11 bg-white/10 ring-1 ring-white/15">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
                    Uploaded Image Analysis
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/90 md:text-base">
                    {analysisDescription}
                  </p>
                </div>
              </div>
            </div>

            {showNoVehicleMessage && (
              <div className="mt-10">
                <div className="px-6 py-10 bg-white shadow-2xl rounded-3xl">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-700 bg-blue-100 rounded-full">
                    <Search size={28} />
                  </div>

                  <p className="text-xl font-bold text-gray-800">
                    Image doesn't contain a vehicle
                  </p>
                  <p className="max-w-md mx-auto mt-3 text-sm leading-6 text-gray-500">
                    Please upload an image of a car for AI matching to work.
                  </p>
                </div>
              </div>
            )}

            {results.length > 0 && searchResponse?.isVehicle !== false && (
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
                        View: {" "}
                        <span className="font-medium capitalize">
                          {searchResponse.queryAnalysis.detectedViewType || "Unknown"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((car, index) => (
                <ImageSearchResultCard
                  key={car._id || car.id || `${car.title}-${car.brand}-${car.model}`}
                  result={car}
                  rank={index + 1}
                  onSelect={() => car._id && handleCardClick(car._id)}
                />
              ))}
            </div>
          </div>
            )}
          </div>
        )}

            {showNoResultsMessage && (
              <div className="mt-10">
                <div className="px-6 py-10 bg-white shadow-2xl rounded-3xl">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-700 bg-blue-100 rounded-full">
                    <Search size={28} />
                  </div>

                  <p className="text-xl font-bold text-gray-800">
                    No similar cars found
                  </p>
                  <p className="max-w-md mx-auto mt-3 text-sm leading-6 text-gray-500">
                    Try uploading a clearer image, a larger visible vehicle part, or a different angle for better AI matching results.
                  </p>
                </div>
              </div>
            )}
          </div>
    </section>
  );
}

export default Hero;