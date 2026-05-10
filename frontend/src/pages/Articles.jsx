import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Loader2, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import ArticleCard from "../components/articles/ArticleCard";
import ArticlePreviewCard from "../components/articles/ArticlePreviewCard";

function Articles() {
  const { t } = useTranslation();
  const ALL_CATEGORY = "__all__";

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  // FETCH ARTICLES
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get("http://localhost:5003/api/articles");

        setArticles(res.data.articles);
      } catch (error) {
        console.error(error);
        setError(t("articles.error", { defaultValue: "We couldn't load the latest articles right now." }));
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [t]);

  // FEATURED ARTICLE
  const categories = [
    { value: ALL_CATEGORY, label: t("articles.filters.all", { defaultValue: "All" }) },
    ...Array.from(new Set(articles.map((article) => article.category).filter(Boolean))).map((category) => ({
      value: category,
      label: category,
    })),
  ];
  const filteredArticles = activeCategory === ALL_CATEGORY
    ? articles
    : articles.filter((article) => article.category === activeCategory);

  const featured = filteredArticles[0];

  // REMAINING ARTICLES
  const remainingArticles = filteredArticles.slice(1);
  const sidebarArticles = filteredArticles.slice(1, 4);

  return (

    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#020617] dark:text-white">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-white/10">

        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0">

          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000"
            alt=""
            className="h-full w-full object-cover opacity-20 dark:opacity-25"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-slate-50/90 to-slate-50 dark:from-black/40 dark:via-[#020617]/90 dark:to-[#020617]" />

          <div className="absolute left-10 top-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        </div>

        {/* CONTENT */}
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 lg:pb-20 lg:pt-32">

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-600 dark:text-cyan-300">
            <Sparkles size={16} />
            {t("articles.badge", { defaultValue: "AutoVerge Articles" })}
          </div>

          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-6xl lg:text-7xl">

            {t("articles.heroTitle", { defaultValue: "Latest Vehicle News, Reviews & AI Insights" })}

          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl">

            {t("articles.heroDescription", {
              defaultValue:
                "Explore AI-generated automotive insights, EV news, vehicle buying guides, transportation trends, and Sri Lankan car market updates.",
            })}

          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 dark:border-white/10 dark:bg-white/5">
              <CalendarDays size={15} />
              {t("articles.storyCount", { count: articles.length, defaultValue: `${articles.length} stories` })}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 dark:border-white/10 dark:bg-white/5">
              {t("articles.freshCoverage", { defaultValue: "Fresh coverage" })}
            </span>
          </div>

        </div>

      </section>

      {error && (
        <section className="mx-auto max-w-7xl px-6 pt-4">
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                activeCategory === category.value
                  ? "border-cyan-500 bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      {loading ? (
        <section className="mx-auto -mt-6 max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="h-[620px] animate-pulse rounded-[32px] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5" />
            <div className="space-y-6">
              <div className="h-[180px] animate-pulse rounded-[28px] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5" />
              <div className="h-[180px] animate-pulse rounded-[28px] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5" />
              <div className="h-[180px] animate-pulse rounded-[28px] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5" />
            </div>
          </div>
        </section>
      ) : featured ? (

        <section className="mx-auto -mt-6 max-w-7xl px-6">

          <div className="grid gap-10 lg:grid-cols-2">

            <div className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl transition duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-xl">

              <div className="relative h-[340px] overflow-hidden">

                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-lg shadow-cyan-500/20">
                  Featured Story
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white">
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      {new Date(featured.createdAt).toDateString()}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/80">
                      {featured.category}
                    </p>
                  </div>

                  <div className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md sm:inline-flex">
                    Read the lead story
                  </div>
                </div>

              </div>

              <div className="p-8">

                <h2 className="mb-4 text-3xl font-black leading-tight text-slate-900 dark:text-white md:text-4xl">

                  {featured.title}

                </h2>

                <p className="mb-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">

                  {featured.summary || featured.excerpt}

                </p>

                <Link
                  to={`/articles/${featured.slug}`}
                  className="inline-flex items-center gap-3 rounded-full bg-cyan-500 px-7 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cyan-400"
                >

                  Read Full Article
                  <ArrowRight size={18} />

                </Link>

              </div>

            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
                  Fresh Picks
                </p>
                <h3 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                  What to read next
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  This side rail keeps the page scannable and lets readers jump straight into the newest stories.
                </p>
              </div>

              <div className="space-y-4">
                {sidebarArticles.length > 0 ? (
                  sidebarArticles.map((article) => (
                    <ArticlePreviewCard key={article._id} article={article} compact />
                  ))
                ) : (
                  <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      {t("articles.noAdditional", { defaultValue: "No additional stories in this category yet." })}
                    </div>
                )}
              </div>

            </div>

          </div>

        </section>

      ) : (

        <section className="mx-auto -mt-4 max-w-7xl px-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
              {t("articles.noArticlesLabel", { defaultValue: "No articles" })}
            </p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
              {t("articles.noArticlesTitle", { defaultValue: "No stories match this category yet." })}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
              {t("articles.noArticlesDescription", {
                defaultValue:
                  "Switch back to All to see the full archive, or wait for the next article to be published.",
              })}
            </p>
          </div>
        </section>

      )}

      {/* ALL ARTICLES */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        {/* TITLE */}
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
              {t("articles.latestPosts", { defaultValue: "Latest Posts" })}
            </p>

            <h2 className="text-4xl font-black md:text-5xl">

              {activeCategory === ALL_CATEGORY
                ? t("articles.allArticles", { defaultValue: "All Articles" })
                : activeCategory}

            </h2>

            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              {t("articles.archiveHelp", {
                defaultValue:
                  "Browse the full archive or narrow the feed by topic to keep the page focused.",
              })}
            </p>

          </div>

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            {t("articles.showingCount", {
              count: remainingArticles.length + (featured ? 1 : 0),
              defaultValue: `Showing ${remainingArticles.length + (featured ? 1 : 0)} article(s)`,
            })}
          </div>

        </div>

        {/* GRID */}
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">

          {remainingArticles.map((article) => (

            <ArticleCard
              key={article._id}
              article={article}
            />

          ))}

        </div>

        {filteredArticles.length === 1 && (
          <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Only one article matches the selected filter. Use All to see the rest of the archive.
          </div>
        )}

      </section>

    </div>
  );
}

export default Articles;