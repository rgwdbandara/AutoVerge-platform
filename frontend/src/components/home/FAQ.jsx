import { useTranslation } from "react-i18next";

export default function FAQ() {
  const { t } = useTranslation();

  const faqs = [
    {
      q: t("home.faq.items.imageSearch.q", { defaultValue: "How does image search work?" }),
      a: t("home.faq.items.imageSearch.a", {
        defaultValue:
          "Upload a car image and AutoVerge compares its visual features against available listings.",
      }),
    },
    {
      q: t("home.faq.items.language.q", { defaultValue: "Can I switch between English and Sinhala?" }),
      a: t("home.faq.items.language.a", {
        defaultValue: "Yes, the language toggle in the navbar changes the whole interface instantly.",
      }),
    },
    {
      q: t("home.faq.items.aiSearch.q", { defaultValue: "Is the AI search free to use?" }),
      a: t("home.faq.items.aiSearch.a", {
        defaultValue: "The interface supports AI-powered matching without extra steps for users.",
      }),
    },
    {
      q: t("home.faq.items.favorites.q", { defaultValue: "Can I save favorite cars?" }),
      a: t("home.faq.items.favorites.a", {
        defaultValue: "Yes, signed-in users can save vehicles to their favorites list.",
      }),
    },
    {
      q: t("home.faq.items.account.q", { defaultValue: "Do I need an account to post a vehicle?" }),
      a: t("home.faq.items.account.a", {
        defaultValue: "Yes, sign in first so your listings are linked to your profile.",
      }),
    },
    {
      q: t("home.faq.items.devices.q", { defaultValue: "What devices does AutoVerge support?" }),
      a: t("home.faq.items.devices.a", {
        defaultValue: "The site is responsive and works well on desktop and mobile devices.",
      }),
    }
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-24 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-semibold text-slate-900 dark:text-white">
          {t("home.faq.title", { defaultValue: "Frequently Asked Questions" })}
        </h2>

        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="group border-b border-slate-200 dark:border-slate-800 p-6 last:border-b-0 transition-colors duration-300"
            >
              <summary className="cursor-pointer list-none pr-8 text-2xl font-medium text-slate-900 dark:text-white marker:hidden transition-colors duration-300">
                {item.q}
              </summary>
              <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-300 transition-colors duration-300">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}