import { BadgeCheck, Mail, MapPin, MessageCircle, Phone, UserRound } from "lucide-react";

function SellerContactCard({
  sellerName,
  sellerPhone,
  sellerEmail,
  locationLabel,
  telLink,
  whatsappLink,
}) {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/30 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#111827]/90 dark:shadow-black/30">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5 dark:border-white/10 dark:from-white/5 dark:to-transparent sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B1739] text-white shadow-lg">
            <UserRound size={26} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-2xl font-semibold text-slate-900 dark:text-white">
                {sellerName || "Seller"}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                <BadgeCheck size={14} />
                Verified Seller
              </span>
            </div>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Reach out directly using the contact options below.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-7">
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm dark:bg-white/10 dark:text-white">
                  <Phone size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Phone</p>
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {sellerPhone || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm dark:bg-white/10 dark:text-white">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Email</p>
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {sellerEmail || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm dark:bg-white/10 dark:text-white">
                <MapPin size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Location</p>
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {locationLabel || "Location not available"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 pt-1 sm:grid-cols-2">
            <a
              href={telLink || "#"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1739] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Phone size={16} />
              Call Seller
            </a>

            <a
              href={whatsappLink || "#"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              <MessageCircle size={16} />
              WhatsApp Seller
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerContactCard;