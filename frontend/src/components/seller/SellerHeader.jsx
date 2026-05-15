function SellerHeader() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 text-slate-900 shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900 dark:text-white">

      <h1 className="text-xl font-bold">
        Seller Dashboard
      </h1>

      <button className="rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400">
        Add New Car
      </button>

    </div>
  );
}

export default SellerHeader;