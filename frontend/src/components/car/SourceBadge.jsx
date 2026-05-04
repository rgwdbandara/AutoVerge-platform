function SourceBadge({ source }) {
  const key = (source || "").toLowerCase();

  const variants = {
    ikman: {
      label: "ikman.lk",
      className: "bg-blue-600 text-white ring-1 ring-blue-500/20 shadow-sm",
    },
    riyasewana: {
      label: "Riyasewana",
      className: "bg-emerald-600 text-white ring-1 ring-emerald-500/20 shadow-sm",
    },
    manual: {
      label: "Verified Seller",
      className: "bg-gray-500 text-white ring-1 ring-gray-400/20 shadow-sm",
    },
  };

  const config = variants[key];

  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default SourceBadge;