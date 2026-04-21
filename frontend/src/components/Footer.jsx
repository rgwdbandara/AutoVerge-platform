import { Link } from "react-router-dom";
import { Globe, Mail, MapPin, Phone, Send } from "lucide-react";

const quickLinks = [
  { label: "Browse Cars", to: "/browse" },
  { label: "Sell Your Car", to: "/seller/add-car" },
  { label: "Dashboard", to: "/seller/dashboard" },
  { label: "My Listings", to: "/seller/cars" },
];

const supportLinks = [
  { label: "How AutoScore Works", to: "/browse" },
  { label: "Price Insights", to: "/browse" },
  { label: "EMI Tools", to: "/browse" },
  { label: "Image Search", to: "/browse" },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-200">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full -left-24 top-10 bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 rounded-full -right-24 h-72 w-72 bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="relative px-6 mx-auto max-w-7xl py-14">
        <div className="grid gap-10 pb-10 border-b border-white/10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white">AutoVerge</h3>
            <p className="max-w-sm mt-4 text-sm leading-6 text-slate-300">
              Buy and sell with confidence using AutoScore grading, AI price insights, and image-first discovery.
            </p>

            <div className="mt-5 space-y-2 text-sm text-slate-300">
              <p className="flex items-center gap-2"><MapPin size={16} /> Colombo, Sri Lanka</p>
              <p className="flex items-center gap-2"><Phone size={16} /> +94 71 234 5678</p>
              <p className="flex items-center gap-2"><Mail size={16} /> hello@autoverge.ai</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Quick Links</h4>
            <div className="mt-4 space-y-3 text-sm">
              {quickLinks.map((item) => (
                <Link key={item.label} to={item.to} className="block transition text-slate-200 hover:translate-x-1 hover:text-cyan-300">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Platform Tools</h4>
            <div className="mt-4 space-y-3 text-sm">
              {supportLinks.map((item) => (
                <Link key={item.label} to={item.to} className="block transition text-slate-200 hover:translate-x-1 hover:text-emerald-300">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Stay in the Loop</h4>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Get market trends and latest deals directly to your inbox.
            </p>

            <form className="flex p-1 mt-4 border rounded-xl border-white/15 bg-white/5">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 text-sm text-white bg-transparent placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold transition rounded-lg bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              >
                Join <Send size={14} />
              </button>
            </form>

            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="p-2 transition border rounded-full border-white/20 text-slate-300 hover:border-cyan-300 hover:text-cyan-300" aria-label="Website">
                <Globe size={16} />
              </a>
              <a href="#" className="p-2 transition border rounded-full border-white/20 text-slate-300 hover:border-emerald-300 hover:text-emerald-300" aria-label="Email">
                <Mail size={16} />
              </a>
              <a href="#" className="p-2 transition border rounded-full border-white/20 text-slate-300 hover:border-blue-300 hover:text-blue-300" aria-label="Call">
                <Phone size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>Copyright {year} AutoVerge. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/browse" className="transition hover:text-white">Privacy</Link>
            <Link to="/browse" className="transition hover:text-white">Terms</Link>
            <Link to="/browse" className="transition hover:text-white">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
