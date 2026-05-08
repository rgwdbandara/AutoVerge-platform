import React from "react";
import { Star, Circle } from "lucide-react";

const demoResults = [
  {
    id: 1,
    title: "2021 Tesla Model 3",
    pct: 92,
    reason: "Matched front fascia, headlight shape, and bumper trim.",
  },
  {
    id: 2,
    title: "2020 Tesla Model 3",
    pct: 87,
    reason: "Similar hood contours and grille-less front profile.",
  },
  {
    id: 3,
    title: "2022 Tesla Model 3 Performance",
    pct: 81,
    reason: "Close wheelbase and front apron details.",
  },
];

export default function AIMatchingDemo() {
  return (
    <section className="bg-slate-50 dark:bg-slate-950 transition-colors duration-300 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h3 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">AI Matching Demo</h3>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-4 text-center transition-colors duration-300">
              <div className="mb-4 h-64 w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                <div className="text-slate-500 dark:text-slate-300">Uploaded Image</div>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-300">Sample photo preview</div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-4">
              {demoResults.map((r, idx) => (
                <div key={r.id} className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-4 transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <Star size={18} />
                    </div>

                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{r.title}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">{r.reason}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{r.pct}%</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">Rank #{idx + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
