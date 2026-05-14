/* eslint-disable react-hooks/exhaustive-deps */
 
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";


import {
  CalendarDays,
  ArrowLeft,
  Share2,
} from "lucide-react";

function ArticleDetails() {
  const { t } = useTranslation();

  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  // FETCH ARTICLE
  const fetchArticle = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5003/api/articles/${slug}`
      );

      setArticle(res.data.article);

      const relatedRes = await axios.get(
        "http://localhost:5003/api/articles"
      );

      setRelatedArticles(
        relatedRes.data.articles
          .filter((item) => item.slug !== slug)
          .slice(0, 3)
      );

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    fetchArticle();

  }, [slug]);

  if (!article) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-white">

        {t("articleDetails.loading", { defaultValue: "Loading..." })}

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#020617] dark:text-white">

      {/* HERO */}
      <section className="relative isolate h-[72vh] overflow-hidden bg-slate-950">

        {/* IMAGE */}
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/10" />

        {/* CONTENT */}
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-20 lg:px-8">

          <div className="max-w-4xl">

            {/* CATEGORY */}
            <span className="mb-6 inline-flex items-center rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-cyan-500/20">

              {article.category}

            </span>

            {/* TITLE */}
            <h1 className="max-w-5xl text-5xl font-black leading-tight text-white drop-shadow-md md:text-7xl">

              {article.title}

            </h1>

            {/* META */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-white/80">

              <div className="flex items-center gap-2">

                <CalendarDays size={18} />

                <span>
                  {new Date(article.createdAt).toDateString()}
                </span>

              </div>

              <div className="flex items-center gap-2">

                <Share2 size={18} />

                <span>AutoVerge News</span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ARTICLE CONTENT */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75 sm:p-8 lg:p-12">
          {/* BACK BUTTON */}
          <Link
            to="/articles"
            className="mb-10 inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <ArrowLeft size={18} />
            {t("articleDetails.back", { defaultValue: "Back To Articles" })}
          </Link>

          {/* EXCERPT */}
          <p className="mb-12 max-w-4xl text-2xl leading-relaxed text-slate-600 dark:text-slate-300 md:text-[1.6rem]">
            {article.excerpt}
          </p>

          {/* CONTENT */}
          <div className="prose prose-xl max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-li:text-slate-700 prose-a:text-cyan-600 prose-img:rounded-2xl prose-img:shadow-xl dark:prose-invert dark:prose-p:text-slate-300 dark:prose-headings:text-white dark:prose-strong:text-white dark:prose-li:text-slate-300">
            <ReactMarkdown>
              {article.content}
            </ReactMarkdown>
          </div>

          {/* RELATED ARTICLES */}
          <div className="mt-24">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
                  {t("articleDetails.moreStories", { defaultValue: "More Stories" })}
                </p>

                <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                  {t("articleDetails.relatedArticles", { defaultValue: "Related Articles" })}
                </h2>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {relatedArticles.map((item) => (
                <Link
                  key={item._id}
                  to={`/articles/${item.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5">
                      <span className="rounded-full bg-cyan-500/90 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-4 text-2xl font-bold leading-snug text-slate-900 transition group-hover:text-cyan-500 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="mb-6 line-clamp-3 flex-1 leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(item.createdAt).toDateString()}
                      </span>

                      <span className="font-semibold text-cyan-500">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default ArticleDetails;