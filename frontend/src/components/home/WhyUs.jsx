import { Search, Calculator, ShieldCheck } from "lucide-react";

export default function WhyUs() {
  const items = [
    {
      title: "Smart Search & Recommendations",
      description:
        "Explore vehicles using image-based search and recommendations that better match your budget and preferences.",
      icon: Search,
      iconWrap: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "EMI Calculator",
      description:
        "Estimate monthly payments instantly and compare financing options before making a purchase.",
      icon: Calculator,
      iconWrap: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "AutoTrust Grading & Price Analysis",
      description:
        "Use transparent condition grading and AI-powered price insights for safer, more confident decisions.",
      icon: ShieldCheck,
      iconWrap: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-14 text-center text-3xl font-semibold text-slate-900 md:text-4xl">
          Why We Stand Out
        </h2>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${item.iconWrap}`}>
                  <Icon className={item.iconColor} size={28} />
                </div>

                <h3 className="mb-3 text-2xl font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-lg leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}