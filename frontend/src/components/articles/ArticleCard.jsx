import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

function ArticleCard({ article }) {

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-black/20"
    >

      {/* IMAGE */}
      <div className="relative h-[260px] overflow-hidden">

        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* CATEGORY */}
        <div className="absolute left-5 top-5">

          <span className="rounded-full bg-cyan-500 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-lg">
            {article.category}
          </span>

        </div>

      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-7">

        {/* DATE */}
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">

          <CalendarDays size={16} />

          <span>
            {new Date(article.createdAt).toDateString()}
          </span>

        </div>

        {/* TITLE */}
        <h2 className="mb-4 line-clamp-2 text-2xl font-black leading-tight text-slate-900 transition group-hover:text-cyan-600 dark:text-white md:text-[2rem]">

          {article.title}

        </h2>

        {/* EXCERPT */}
        <p className="mb-6 line-clamp-3 flex-1 text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">

          {article.summary || article.excerpt}

        </p>

        {/* BUTTON */}
        <div className="flex items-center gap-2 font-semibold text-cyan-600 transition group-hover:gap-3">

          Read Article

          <ArrowRight
            size={18}
            className="transition group-hover:translate-x-1"
          />

        </div>

      </div>

    </Link>
  );
}

export default ArticleCard;