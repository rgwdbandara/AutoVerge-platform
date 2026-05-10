import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      
      <div className="px-6 py-12 mx-auto space-y-10 max-w-7xl">

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">

          {/* LOGO */}
          <div>
            <div className="mb-3 text-2xl font-bold">
              AutoVerge
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t("footer.description", {
                defaultValue:
                  "Find, compare and understand vehicles using AI-powered image search.",
              })}
            </p>

            {/* SOCIAL LINKS */}
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-600 dark:text-slate-300">
              <a href="#" className="transition hover:text-blue-500">
                Twitter
              </a>

              <a href="#" className="transition hover:text-blue-500">
                GitHub
              </a>

              <a href="#" className="transition hover:text-blue-500">
                LinkedIn
              </a>
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h4 className="mb-3 font-medium text-slate-900 dark:text-white">
              {t("footer.explore", { defaultValue: "Explore" })}
            </h4>

            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <a href="/browse" className="transition hover:text-blue-500">
                  {t("footer.links.browseCars", { defaultValue: "Browse Cars" })}
                </a>
              </li>

              <li>
                <a href="/sell" className="transition hover:text-blue-500">
                  {t("footer.links.sellCar", { defaultValue: "Sell a Car" })}
                </a>
              </li>

              <li>
                <a href="/favorites" className="transition hover:text-blue-500">
                  {t("footer.links.favorites", { defaultValue: "Favorites" })}
                </a>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="mb-3 font-medium text-slate-900 dark:text-white">
              {t("footer.company", { defaultValue: "Company" })}
            </h4>

            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <a href="/about" className="transition hover:text-blue-500">
                  {t("footer.links.about", { defaultValue: "About" })}
                </a>
              </li>

              <li>
                <a href="/careers" className="transition hover:text-blue-500">
                  {t("footer.links.careers", { defaultValue: "Careers" })}
                </a>
              </li>

              <li>
                <a href="/contact" className="transition hover:text-blue-500">
                  {t("footer.links.contact", { defaultValue: "Contact" })}
                </a>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="mb-3 font-medium text-slate-900 dark:text-white">
              {t("footer.stayInLoop", { defaultValue: "Stay in the loop" })}
            </h4>

            <form className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 text-sm bg-white border rounded-md border-slate-200 text-slate-900 placeholder:text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                placeholder={t("footer.emailPlaceholder", { defaultValue: "Your email" })}
              />

              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold text-white transition bg-indigo-600 rounded-md hover:bg-indigo-500"
              >
                {t("footer.subscribe", { defaultValue: "Subscribe" })}
              </button>
            </form>

            <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              support@autoverge.com
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="pt-6 text-sm border-t border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300">
          © {new Date().getFullYear()} AutoVerge — {t("footer.rights", { defaultValue: "All rights reserved." })}
        </div>

      </div>
    </footer>
  );
}