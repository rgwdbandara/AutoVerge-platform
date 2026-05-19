import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const checklistItems = [
  ["📝", "Write a clear title with year, make, and model."],
  ["📸", "Upload bright, well-framed photos from multiple angles."],
  ["💰", "Set a realistic asking price based on condition and market demand."],
  ["📊", "Highlight mileage, fuel type, transmission, and key features."],
  ["⚠️", "Avoid unclear contact details or incomplete information."],
  ["✅", "Double-check the information before publishing your ad."],
];

const steps = [
  ["1", "Create Your Listing", "Choose manual entry or let AI prefill the form from an image."],
  ["2", "Review Details", "Confirm the vehicle details, pricing, and images before publishing."],
  ["3", "Reach Buyers", "Your car goes live and becomes visible to the right audience instantly."],
];

function Sell() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [openFaq, setOpenFaq] = useState(null);
  const [checkedChecklist, setCheckedChecklist] = useState(() =>
    checklistItems.map(() => false)
  );

  const faqs = [
    { q: "How long does it take to post a car?", a: "Most sellers can create a listing in just a few minutes." },
    { q: "Can I edit my ad later?", a: "Yes, you can update your listing details anytime from your dashboard." },
    { q: "Does AutoVerge help with pricing?", a: "Yes, AI-assisted pricing and guidance help you set a competitive price." },
    { q: "Do I need professional photos?", a: "No, but clear and well-lit images perform much better." },
    { q: "How do buyers contact me?", a: "Interested buyers can reach you through the contact details in your listing." },
  ];

  const handlePostVehicle = () => {
    if (isSignedIn) {
      navigate("/seller/add-car");
    } else {
      navigate("/sign-up");
    }
  };

  const completedChecklist = checkedChecklist.filter(Boolean).length;
  const checklistProgress = Math.round((completedChecklist / checklistItems.length) * 100);
  const readyToPost = checklistProgress === 100;

  const toggleChecklistItem = (index) => {
    setCheckedChecklist((current) =>
      current.map((itemChecked, itemIndex) =>
        itemIndex === index ? !itemChecked : itemChecked
      )
    );
  };

  const markAllChecklist = (value) => {
    setCheckedChecklist(checklistItems.map(() => value));
  };

  return (
  <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
    {/* HERO */}
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden text-white sm:min-h-[80vh]">
      {/* 🔥 Background Image */}
  <div
    className="absolute inset-0 z-0 bg-center bg-cover"
    style={{
      backgroundImage: "url('/hero-car1.jpg')",
    }}
      />

     {/* 🔥 LIGHT OVERLAY (not too dark) */}
  <div className="absolute inset-0 z-0 bg-black/45 dark:bg-black/55" />

     {/* 🔥 Optional blue gradient effect (soft) */}
  <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-900/40 via-transparent to-black/40" />

      {/* CONTENT */}
  <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <Motion.span
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 mb-5 text-sm border rounded-full bg-white/10 border-white/20 backdrop-blur-md"
        >
          Sell smarter with AutoVerge
        </Motion.span>

        <Motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-6xl"
        >
          List your vehicle with confidence
        </Motion.h1>

        <Motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-base text-blue-100 sm:text-lg"
        >
          Reach the right buyers faster with trusted AI-assisted pricing, simple listing tools, and a smooth posting flow.
        </Motion.p>

        <Motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePostVehicle}
          className="mt-8 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 sm:px-8 sm:py-4"
        >
          Post Your Vehicle
        </Motion.button>
      </div>
    </section>

      {/* BEFORE POST */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 sm:p-8"
        >
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Before You Post</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                Tick through these quick checks to make your listing look sharper and convert better.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => markAllChecklist(true)}
                className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200"
              >
                Mark all done
              </button>
              <button
                type="button"
                onClick={() => markAllChecklist(false)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800/70">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Listing readiness
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {readyToPost ? "Ready to post" : `${completedChecklist} of ${checklistItems.length} steps completed`}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${readyToPost ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200"}`}>
                {checklistProgress}% complete
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${checklistProgress}%` }}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {checklistItems.map(([icon, text], index) => {
              const isChecked = checkedChecklist[index];

              return (
              <Motion.div
                key={text}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`flex cursor-pointer items-start gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${isChecked ? "border border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10" : "border border-transparent bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"}`}
                onClick={() => toggleChecklistItem(index)}
              >
                <button
                  type="button"
                  aria-label={isChecked ? "Mark checklist item as incomplete" : "Mark checklist item as complete"}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleChecklistItem(index);
                  }}
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition ${isChecked ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-900"}`}
                >
                  {isChecked ? "✓" : index + 1}
                </button>

                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className={`font-medium ${isChecked ? "text-emerald-900 dark:text-emerald-100" : "text-slate-800 dark:text-slate-200"}`}>
                        {text}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {isChecked ? "Done" : "Tap to mark as ready"}
                      </p>
                    </div>
                  </div>
                </div>
              </Motion.div>
            );
            })}
          </div>
        </Motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl px-6 pb-16 mx-auto">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white sm:mb-10 sm:text-3xl">
          How It Works
        </h2>

        <div className="grid gap-4 md:grid-cols-3 sm:gap-6">
          {steps.map(([num, title, desc], index) => (
            <Motion.div
              key={title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 sm:p-7"
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white sm:h-14 sm:w-14 sm:text-xl">
                {num}
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base">{desc}</p>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 sm:pb-16">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-slate-900 dark:text-white sm:mb-10 sm:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-slate-900">
          {faqs.map((faq, index) => (
            <div key={faq.q} className="border-b border-slate-200 last:border-b-0 dark:border-white/10">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between px-4 py-4 text-left text-base font-semibold text-slate-900 transition-colors duration-300 dark:text-white sm:px-6 sm:py-5 sm:text-lg"
              >
                {faq.q}
                <span className="text-2xl">{openFaq === index ? "−" : "+"}</span>
              </button>

              <AnimatePresence>
                {openFaq === index && (
                  <Motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-4 pb-5 text-sm text-slate-600 dark:text-slate-300 sm:px-6 sm:text-base"
                  >
                    {faq.a}
                  </Motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT */}
      <section className="mx-auto max-w-3xl px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 sm:p-8">
          <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Need Help Getting Started?</h2>
          <p className="mb-5 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Our support team can help with listings, pricing, and account setup.
          </p>
          <button className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-400 sm:px-7">
            Contact Support
          </button>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <Motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[2rem] bg-gradient-to-r from-blue-800 to-blue-950 px-4 py-12 text-center text-white shadow-xl sm:px-6 sm:py-16"
        >
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to list your vehicle?
          </h2>
          <p className="mt-4 text-base text-blue-100 sm:text-lg">
            Create your ad now and start getting attention from serious buyers.
          </p>

          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePostVehicle}
            className="mt-8 rounded-2xl bg-white px-7 py-3 font-bold text-blue-900 sm:px-9 sm:py-4"
          >
            Start Selling
          </Motion.button>
        </Motion.div>
      </section>
    </div>
  );
}

export default Sell;