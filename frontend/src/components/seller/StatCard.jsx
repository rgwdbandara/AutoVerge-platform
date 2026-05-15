function StatCard({ title, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900">

      <h3 className="text-slate-500 dark:text-slate-400">
        {title}
      </h3>

      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}

export default StatCard;