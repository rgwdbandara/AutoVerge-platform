import React from "react";
import { UploadCloud, Cpu, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Upload or Search",
      desc: "Provide a photo or use our image search to start finding matching vehicles.",
      icon: UploadCloud,
    },
    {
      id: 2,
      title: "AI Analyzes Features",
      desc: "Our models analyze exterior shape, trim, and visual cues to find similar cars.",
      icon: Cpu,
    },
    {
      id: 3,
      title: "Get Smart Matches",
      desc: "Receive ranked matches with confidence scores and concise explanations.",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-20 transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="px-6 mx-auto max-w-7xl">
        <h2 className="mb-6 text-3xl font-semibold text-center text-slate-900 dark:text-white">
          How It Works
        </h2>

        <p className="max-w-2xl mx-auto mb-10 text-lg text-center text-slate-600 dark:text-slate-300">
          Simple steps to discover vehicles using our advanced AI image-matching
          pipeline.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => {
            const Icon = s.icon;

            return (
              <article
                key={s.id}
                className="p-6 text-center transition duration-300 bg-white border shadow-sm rounded-2xl border-slate-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
              >
                <div className="flex items-center justify-center mx-auto mb-4 rounded-full h-14 w-14 bg-slate-100 text-slate-900 dark:bg-slate-800">
                  <Icon size={28} />
                </div>

                <div className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                  <span className="inline-flex items-center justify-center w-8 h-8 mr-2 text-sm font-medium text-white bg-indigo-600 rounded-full">
                    {s.id}
                  </span>
                  {s.title}
                </div>

                <p className="text-slate-600 dark:text-slate-300">{s.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
