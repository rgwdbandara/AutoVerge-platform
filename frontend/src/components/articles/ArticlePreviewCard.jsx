import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

function ArticlePreviewCard({ article, compact = false }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20"
    >
      <div className={`relative overflow-hidden ${compact ? "h-44" : "h-56"}`}>
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-cyan-500/95 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-lg backdrop-blur-sm">
            {article.category}
          </span>
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-5" : "p-6"}`}>
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <CalendarDays size={14} />
          <span>{new Date(article.createdAt).toDateString()}</span>
        </div>

        <h3 className={`line-clamp-2 font-black leading-tight text-slate-900 transition group-hover:text-cyan-600 dark:text-white ${compact ? "text-xl" : "text-2xl"}`}>
          {article.title}
        </h3>

        <p className="mt-3 line-clamp-3 flex-1 leading-relaxed text-slate-600 dark:text-slate-300">
          {article.summary || article.excerpt}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 font-semibold text-cyan-600 transition group-hover:gap-3">
          Read Article
          <ArrowRight size={18} className="transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default ArticlePreviewCard;