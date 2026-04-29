import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.25),transparent_40%)]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <h2 className="mb-4 text-5xl font-semibold leading-tight md:text-6xl">
          Begin Your Journey To The Right Car
        </h2>

        <p className="mx-auto mb-8 max-w-3xl text-2xl leading-relaxed text-slate-200">
          Find your ideal car using intelligent search, trusted AutoTrust grading,
          and AI-based price insights for a confident buying experience.
        </p>

        <button
          onClick={() => navigate("/browse")}
          className="rounded-full bg-white px-8 py-3 text-base font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
        >
          View All Cars
        </button>
      </div>
    </section>
  );
}