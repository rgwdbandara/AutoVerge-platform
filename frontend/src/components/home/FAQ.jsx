export default function FAQ() {
  const faqs = [
    {
      q: "How does image search work?",
      a: "Upload a car image and AutoVerge compares its visual features against available listings."
    },
    {
      q: "Can I switch between English and Sinhala?",
      a: "Yes, the language toggle in the navbar changes the whole interface instantly."
    },
    {
      q: "Is the AI search free to use?",
      a: "The interface supports AI-powered matching without extra steps for users."
    },
    {
      q: "Can I save favorite cars?",
      a: "Yes, signed-in users can save vehicles to their favorites list."
    },
    {
      q: "Do I need an account to post a vehicle?",
      a: "Yes, sign in first so your listings are linked to your profile."
    },
    {
      q: "What devices does AutoVerge support?",
      a: "The site is responsive and works well on desktop and mobile devices."
    }
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-24 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-semibold text-slate-900 dark:text-white">
          Frequently Asked Questions
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