/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ImagePlus, Loader2, Search, Sparkles, X } from "lucide-react";
import ImageSearchResultCard from "./seller/ImageSearchResultCard";
import { useTranslation } from "react-i18next";


import hero1 from "../assets/hero/hero1.jpg";
import hero2 from "../assets/hero/hero2.jpg";
import hero3 from "../assets/hero/hero3.jpg";
import hero4 from "../assets/hero/hero4.jpg";
import hero5 from "../assets/hero/hero5.jpg";
import hero6 from "../assets/hero/hero6.jpg";
import hero7 from "../assets/hero/hero7.jpg";

const slides = [hero1, hero2, hero3, hero4, hero5, hero6, hero7];

function Hero() {
  const { t, i18n } = useTranslation();
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
  const [latestArticles, setLatestArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredVisible, setFeaturedVisible] = useState(true);

  useEffect(() => {
    const message = t("hero.typingText", {
      defaultValue: "Type a make, model, or upload a car image...",
    });
    let index = 0;

    setTypedText("");

    const interval = setInterval(() => {
      index += 1;
      setTypedText(message.slice(0, index));

      if (index >= message.length) {
        clearInterval(interval);
      }
    }, 34);

    return () => clearInterval(interval);
  }, [i18n.language, t]);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5103/api/articles");
        setLatestArticles((response.data.articles || []).slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch latest articles:", err);
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  // rotate featured article every 3s
  useEffect(() => {
    if (!latestArticles || latestArticles.length === 0) return;
    const iv = setInterval(() => {
      setFeaturedIndex((p) => (p + 1) % latestArticles.length);
    }, 3000);
    return () => clearInterval(iv);
  }, [latestArticles]);

  useEffect(() => {
    setFeaturedVisible(false);
    const timeout = setTimeout(() => setFeaturedVisible(true), 40);
    return () => clearTimeout(timeout);
  }, [featuredIndex]);

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

      // vehicle-service exposes this route at the root (not under /api/vehicles)
      const response = await fetch("http://localhost:5103/search-by-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        let msg = text || "Image search failed";
        try {
          const parsed = JSON.parse(text);
          msg = parsed.message || JSON.stringify(parsed);
        } catch (e) {
          // not JSON, keep text
        }
        throw new Error(msg);
      }

      const data = await response.json();

      console.log("IMAGE SEARCH RESPONSE:", data);
      setSearchResponse(data);

      // If the top match is a perfect match, navigate directly to its detail page
      try {
        const top = data?.results?.[0];
        const topMatchPct = Number(top?.matchPercentage);
        const id = top?._id || top?.id || top?._doc?._id;
        if (id && topMatchPct === 100) {
          navigate(`/cars/${id}`);
          return;
        }
      } catch (e) {
        // ignore and continue showing results
      }
    } catch (err) {
      console.error("IMAGE SEARCH ERROR:", err);
      setError(err.message || "Something went wrong while searching.");
    } finally {
      setIsSearching(false);
    }
  };

  const detectedAnalysis = searchResponse?.detected;
  const results = searchResponse?.results || [];
  const analysisDescription =
    detectedAnalysis?.description ||
    "The uploaded vehicle image was analyzed and the closest available matches are shown below.";
  const similarCount = searchResponse?.totalMatches || 0;
  const showNoVehicleMessage = Boolean(searchResponse && searchResponse.isVehicle === false);
  const showNoResultsMessage = Boolean(
    searchResponse && searchResponse.isVehicle !== false && similarCount === 0 && !isSearching
  );

  const navigate = useNavigate();

  const handleCardSelect = (car) => {
    const id = car._id || car.id || car._doc?._id;
    if (id) navigate(`/cars/${id}`);
  };

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
        <div className={`grid items-start gap-10 ${results.length > 0 ? "lg:grid-cols-1" : "lg:grid-cols-[1.1fr_0.9fr]"}`}>
          <div className={`${results.length > 0 ? "w-full" : "max-w-3xl"}`}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium border rounded-full backdrop-blur-md transition-colors duration-300 ${
              theme === "dark"
                ? "bg-white/20 border-white/20 text-white"
                : "bg-black/20 border-black/20 text-white"
            }`}>
              <Sparkles size={16} className="text-amber-300" />
              {t("hero.badge", { defaultValue: "AI-Powered Smart Platform" })}
            </div>

            <h1 className={`text-4xl font-black leading-tight md:text-6xl lg:text-7xl transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-white"
            }`}>
              {t("hero.titleLine1", { defaultValue: "Find Your Perfect Car with" })}
              <span className="block mt-2 text-transparent bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text">
                {t("hero.titleLine2", { defaultValue: "AutoVerge AI" })}
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
              {t("hero.smartSearchDescription", {
                defaultValue:
                  "Search by make, model, location, or upload a photo and let AI match visually similar cars.",
              })}
            </p>

            <div className="mt-8">
              <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-3xl ring-1 ring-white/15 md:flex-row">
                <input
                  type="text"
                  placeholder={t("hero.searchPlaceholder", {
                    defaultValue: "Enter make, model, or use our Image Search...",
                  })}
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
                  <span className="text-sm font-medium">{t("hero.imageButton", { defaultValue: "Image" })}</span>
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
                      {t("hero.searching", { defaultValue: "AI is analyzing your image and finding similar cars..." })}
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      {t("hero.searchButton", { defaultValue: "Search" })}
                    </>
                  )}
                </button>
              </div>

              <p className="mt-4 text-sm text-white/70">
                {t("hero.uploadHint", { defaultValue: "Upload a car photo or even a visible part of a vehicle." })}
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

              {searchResponse && !isSearching && searchResponse.isVehicle !== false && (
                <div className="p-4 mt-5 border rounded-2xl border-white/15 bg-white/10 backdrop-blur-xl">
                    <p className="text-sm font-semibold text-white">
                      {t("hero.foundResults", { count: similarCount })}
                    </p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {t("hero.resultsDescription", {
                      defaultValue:
                        "These results are based on visual similarity from your uploaded image.",
                    })}
                  </p>
                </div>
              )}

              {searchResponse && !isSearching && searchResponse.isVehicle !== false && results.length > 0 && (
                <div className="p-8 mt-12 border shadow-2xl rounded-3xl border-white/20 bg-gradient-to-br from-slate-950/40 via-slate-950/20 to-transparent backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">
                        🎯 {t("hero.resultsTitle", { defaultValue: "Image Search Results" })}
                      </p>
                      <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                        {t("hero.similarCarsFound", { defaultValue: "Similar Cars Found" })}
                      </h2>
                    </div>
                    <div className="hidden px-6 py-3 text-sm font-semibold border rounded-full border-white/20 bg-white/10 text-white/90 md:inline-flex">
                      <span className="text-cyan-300">Top {Math.min(results.length, 3)}</span> matches
                    </div>
                  </div>

                  <p className="mb-6 text-sm text-white/80 md:text-base">
                    {analysisDescription}
                  </p>

                  <div className="grid grid-cols-1 gap-6 mt-8 md:gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {results.slice(0, 3).map((car, index) => (
                      <ImageSearchResultCard
                        key={car._id || car.id || `${car.title}-${index}`}
                        result={car}
                        rank={index + 1}
                        onSelect={handleCardSelect}
                      />
                    ))}
                  </div>
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
                      {t("hero.searching", { defaultValue: "AI is analyzing your image and finding similar cars..." })}
                    </div>
                </div>
              )}

              {showNoVehicleMessage && (
                <div className="p-4 mt-5 border rounded-2xl border-white/15 bg-white/10 backdrop-blur-xl">
                  <p className="text-sm font-semibold text-white">
                    {t("hero.noVehicleTitle", { defaultValue: "Image doesn't contain a vehicle" })}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {t("hero.noVehicleDescription", { defaultValue: "Please upload a car image first." })}
                  </p>
                </div>
              )}

              {showNoResultsMessage && (
                <div className="p-4 mt-5 border rounded-2xl border-white/15 bg-white/10 backdrop-blur-xl">
                  <p className="text-sm font-semibold text-white">
                    {t("hero.noResultsTitle", { defaultValue: "No similar cars found" })}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {t("hero.noResultsDescription", {
                      defaultValue:
                        "Try uploading a clearer image, a larger visible vehicle part, or a different angle for better AI matching results.",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {results.length === 0 && (
            <div className="hidden lg:block">
            <div className={`relative overflow-hidden rounded-[2rem] border p-5 shadow-2xl backdrop-blur-xl ${
              theme === "dark"
                ? "border-white/10 bg-slate-950/45"
                : "border-white/40 bg-white/70"
            }`}>
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.32em] ${theme === "dark" ? "text-cyan-300" : "text-cyan-600"}`}>
                    {t("articles.latestArticlesLabel", { defaultValue: "Latest Articles" })}
                  </p>
                  <h2 className={`mt-2 text-3xl font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                    {t("articles.badge", { defaultValue: "AutoVerge Articles" })}
                  </h2>
                </div>

                <Link
                  to="/articles"
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    theme === "dark"
                      ? "bg-white/10 text-white hover:bg-white/15"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  View All
                </Link>
              </div>

              <div className={`overflow-hidden rounded-[26px] border shadow-xl transition-all duration-500 ease-out ${
                theme === "dark"
                  ? "border-white/10 bg-slate-950/55"
                  : "border-white/40 bg-white/80"
              } ${featuredVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
                {articlesLoading ? (
                  <div className="h-[300px] animate-pulse bg-white/10" />
                ) : latestArticles.length > 0 ? (
                  <Link to={`/articles/${latestArticles[featuredIndex].slug}`} className="block">
                    <div className="relative h-[190px] overflow-hidden">
                      {latestArticles[featuredIndex].image ? (
                        <img
                          src={latestArticles[featuredIndex].image}
                          alt={latestArticles[featuredIndex].title}
                          className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-slate-900 text-white/70">
                          Latest article
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-cyan-400 px-4 py-1 text-xs font-black uppercase tracking-[0.28em] text-slate-950">
                        {latestArticles[featuredIndex].category || "News"}
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-400 dark:text-slate-300">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-white/70">
                          •
                        </span>
                        {latestArticles[featuredIndex].publishedAt
                          ? new Date(latestArticles[featuredIndex].publishedAt).toDateString()
                          : "Latest update"}
                      </div>

                      <h3 className="text-2xl font-black leading-tight text-slate-900 dark:text-white">
                        {latestArticles[featuredIndex].title}
                      </h3>

                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-3">
                        {latestArticles[featuredIndex].summary}
                      </p>

                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-500">
                        {t("articles.readArticle", { defaultValue: "Read Article" })} <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className={`rounded-[26px] border p-6 text-sm ${theme === "dark" ? "border-white/10 bg-white/5 text-white/70" : "border-slate-200 bg-white text-slate-600"}`}>
                    {t("articles.latestArticlesWillAppear", { defaultValue: "Latest articles will appear here once the news feed loads." })}
                  </div>
                )}
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;