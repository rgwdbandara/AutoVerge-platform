export default function FAQ() {
  const faqs = [
    {
      q: "What is the AutoTrust Grading System in AutoVerge?",
      a: "AutoTrust is our vehicle evaluation system that rates cars based on condition, reliability, and trust factors to help buyers make safe decisions."
    },
    {
      q: "How does the AI Price Estimation work?",
      a: "Our system analyzes market trends, vehicle condition, and historical data to suggest a fair price for both buyers and sellers."
    },
    {
      q: "Can I search for a car using an image?",
      a: "Yes! AutoVerge allows image-based search where you can upload a car image and find similar vehicles instantly."
    },
    {
      q: "Is AutoVerge safe to buy and sell vehicles?",
      a: "Yes, all listings go through moderation and verification processes to reduce scams and ensure trust."
    },
    {
      q: "What tools are available for sellers?",
      a: "Sellers can list vehicles, track performance, manage ads, and get price suggestions using AI."
    },
    {
      q: "What tools are available for buyers?",
      a: "Buyers can compare vehicles, estimate EMI, check AutoTrust grading, and use image-based search to find similar cars quickly."
    }
  ];

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-semibold text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {faqs.map((item, i) => (
          <details
            key={i}
            className="group border-b border-slate-200 p-6 last:border-b-0"
          >
            <summary className="cursor-pointer list-none pr-8 text-2xl font-medium text-slate-900 marker:hidden">
              {item.q}
            </summary>
            <p className="mt-3 text-lg leading-relaxed text-slate-600">{item.a}</p>
          </details>
        ))}
        </div>
      </div>
    </section>
  );
}