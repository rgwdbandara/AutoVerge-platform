import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CTA() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 py-24 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.25),transparent_40%)]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <h2 className="mb-4 text-5xl font-semibold leading-tight md:text-6xl text-slate-900 dark:text-white">
          {t("home.cta.title", { defaultValue: "Begin Your Journey To The Right Car" })}
        </h2>

        <p className="mx-auto mb-8 max-w-3xl text-2xl leading-relaxed text-slate-700 dark:text-slate-200">
          {t("home.cta.subtitle", {
            defaultValue:
              "Find your ideal car using intelligent search, trusted AutoTrust grading, and AI-based price insights for a confident buying experience.",
          })}
        </p>

        <button
          onClick={() => navigate("/browse")}
          className="rounded-full bg-slate-900 dark:bg-white px-8 py-3 text-base font-semibold text-white dark:text-black transition hover:-translate-y-0.5 hover:bg-slate-800 dark:hover:bg-slate-100"
        >
          {t("home.cta.button", { defaultValue: "View All Cars" })}
        </button>
      </div>
    </section>
  );
}