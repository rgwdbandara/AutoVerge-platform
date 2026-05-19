import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ArticlePreviewCard from "../articles/ArticlePreviewCard";

function LatestAutomotiveNews() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const res = await axios.get("http://localhost:5103/api/articles");
        setArticles((res.data.articles || []).slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch latest articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 py-24 dark:from-slate-950 dark:via-[#020617] dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">
              {t("home.latestNews.label", { defaultValue: "Latest Automotive News" })}
            </p>

            <h2 className="text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl">
              {t("home.latestNews.title", {
                defaultValue:
                  "Fresh stories, reviews, and market updates for drivers who want the latest.",
              })}
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
              {t("home.latestNews.subtitle", {
                defaultValue:
                  "Browse recent automotive headlines, electric vehicle updates, and expert insights from AutoVerge.",
              })}
            </p>
          </div>

          <Link
            to="/articles"
            className="inline-flex items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-400"
          >
            {t("home.latestNews.viewAll", { defaultValue: "View All Articles" })}
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-[30px] border border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {articles.map((article) => (
              <ArticlePreviewCard key={article._id} article={article} compact />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestAutomotiveNews;