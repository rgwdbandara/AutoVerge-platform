import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Sparkles, Zap, Shield, Scan, TrendingUp } from "lucide-react";

import logo from "../assets/logo.png";

export default function Footer() {
  const [email, setEmail] = useState("");

  const onSubscribe = (event) => {
    event.preventDefault();
    // Log subscription - in production, send to API
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  const supportMail = (subject) =>
    `mailto:support@autoverge.com?subject=${encodeURIComponent(subject)}`;

  return (
    <footer className="relative mt-20 overflow-hidden transition-colors duration-300 text-slate-900 dark:text-white">
      {/* ANIMATED BACKGROUND GRADIENTS */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent dark:via-cyan-400/30" />
      
      {/* GLOW LAYERS */}
      <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-cyan-400/20 blur-3xl dark:bg-cyan-500/10 animate-pulse" />
      <div className="absolute rounded-full top-1/3 -left-60 w-96 h-96 bg-blue-400/15 blur-3xl dark:bg-blue-500/10 animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-0 rounded-full right-1/4 w-96 h-96 bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5" />
      
      <div className="relative px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* PREMIUM TOP SECTION */}
        <div className="grid gap-16 mb-20 lg:gap-24 lg:grid-cols-2 lg:items-start">
          {/* BRAND SECTION */}
          <div className="space-y-10">
            {/* LOGO CARD */}
            <Link
              to="/"
              className="inline-flex items-center gap-4 px-6 py-4 transition-all duration-300 border shadow-lg group rounded-2xl border-slate-200/60 bg-white/40 hover:-translate-y-1 hover:shadow-2xl hover:border-cyan-300/60 hover:bg-white/60 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/20 dark:hover:border-cyan-400/40 backdrop-blur-xl"
            >
              <div className="relative flex items-center justify-center w-16 h-16 transition-all duration-300 border shadow-inner shrink-0 rounded-xl border-white/40 bg-gradient-to-br from-white/20 to-white/5 dark:border-white/10 dark:from-white/10 dark:to-white/5 group-hover:shadow-lg">
                <img src={logo} alt="AutoVerge" className="object-contain w-10 h-10" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest text-transparent uppercase bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
                  AutoVerge
                </div>
                <div className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  AI Automotive Marketplace
                </div>
              </div>
            </Link>

            {/* DESCRIPTION */}
            <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Smart AI-powered vehicle marketplace. Buy, sell, search by image, estimate prices, and access verified automotive insights—all powered by advanced machine learning.
            </p>

            {/* ANIMATED BADGE GRID */}
            <div className="flex flex-wrap gap-3">
              <div className="group relative inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300 transition-all duration-300 hover:border-cyan-400/70 hover:from-cyan-500/20 hover:to-blue-500/20 dark:hover:border-cyan-400/60 backdrop-blur-sm">
                <Zap size={12} className="transition-transform group-hover:scale-110" />
                <span>AI Powered</span>
              </div>
              <div className="group relative inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-all duration-300 hover:border-emerald-400/70 hover:from-emerald-500/20 hover:to-green-500/20 dark:hover:border-emerald-400/60 backdrop-blur-sm">
                <Shield size={12} className="transition-transform group-hover:scale-110" />
                <span>Verified Listings</span>
              </div>
              <div className="group relative inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-3.5 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 transition-all duration-300 hover:border-purple-400/70 hover:from-purple-500/20 hover:to-pink-500/20 dark:hover:border-purple-400/60 backdrop-blur-sm">
                <Scan size={12} className="transition-transform group-hover:scale-110" />
                <span>Image Search</span>
              </div>
              <div className="group relative inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 px-3.5 py-2 text-xs font-semibold text-orange-700 dark:text-orange-300 transition-all duration-300 hover:border-orange-400/70 hover:from-orange-500/20 hover:to-yellow-500/20 dark:hover:border-orange-400/60 backdrop-blur-sm">
                <TrendingUp size={12} className="transition-transform group-hover:scale-110" />
                <span>Price Insights</span>
              </div>
            </div>
          </div>

          {/* NEWSLETTER PREMIUM CARD */}
          <div className="relative p-8 overflow-hidden transition-all duration-300 border shadow-2xl group rounded-3xl border-cyan-400/40 bg-gradient-to-br from-slate-900/80 via-blue-900/40 to-slate-900/80 hover:border-cyan-400/70 dark:border-cyan-400/30 dark:from-slate-950/90 dark:via-blue-950/50 dark:to-slate-950/90 dark:hover:border-cyan-400/50 backdrop-blur-2xl">
            {/* GLOW EFFECT */}
            <div className="absolute transition duration-500 opacity-0 -inset-1 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl group-hover:opacity-100 dark:from-cyan-500/15 dark:via-blue-500/15 dark:to-cyan-500/15" />
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-400/30 text-cyan-400 dark:text-cyan-300 ring-1 ring-cyan-400/40 dark:ring-cyan-400/20">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Stay Updated</h3>
                  <p className="text-sm text-cyan-200/70">Get AI-powered automotive updates</p>
                </div>
              </div>

              <form onSubmit={onSubscribe} className="space-y-3">
                <div className="relative group/input">
                  <Mail size={16} className="absolute transition-colors -translate-y-1/2 left-4 top-1/2 text-cyan-400/60 group-focus-within/input:text-cyan-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full py-3 pr-4 text-sm text-white transition-all duration-300 border outline-none rounded-xl border-cyan-400/30 bg-white/10 pl-11 placeholder:text-white/40 hover:border-cyan-400/50 focus:border-cyan-400/70 focus:bg-white/15 dark:border-cyan-400/20 dark:hover:border-cyan-400/40 dark:focus:border-cyan-400/60 dark:focus:bg-white/10 backdrop-blur-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:from-cyan-400 hover:to-blue-400 dark:from-cyan-400 dark:to-blue-400 dark:text-slate-950 dark:hover:from-cyan-300 dark:hover:to-blue-300 flex items-center justify-center gap-2 active:translate-y-0"
                >
                  <span>Subscribe Now</span>
                  <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </button>
              </form>

              <p className="text-xs text-center text-white/50">No spam, just valuable market insights. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px my-20 bg-gradient-to-r from-transparent via-slate-300/30 to-transparent dark:via-cyan-400/10" />

        {/* FOOTER LINKS GRID */}
        <div className="grid gap-12 mb-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* EXPLORE */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-950 dark:text-white">Explore</h3>
            <ul className="space-y-4">
              {[
                { href: "/browse", label: "Browse Cars" },
                { href: "/sell", label: "Sell Vehicle" },
                { href: "/#ai-image-search", label: "AI Image Search" },
                { href: "/browse", label: "Price Estimation" },
                { href: "/#featured-cars", label: "Compare Cars" }
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="inline-flex items-center gap-2 text-sm transition-all duration-300 group text-slate-600 hover:translate-x-1 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">
                    <span className="w-0 h-px transition-all bg-current group-hover:w-2" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* RESOURCES */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-950 dark:text-white">Resources</h3>
            <ul className="space-y-4">
              {[
                { href: "/articles", label: "Articles" },
                { href: "/#latest-news", label: "EV News" },
                { href: "/#how-it-works", label: "Buying Guides" },
                { href: "/#featured-cars", label: "Vehicle Reviews" },
                { href: "/#faq", label: "FAQ" }
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="inline-flex items-center gap-2 text-sm transition-all duration-300 group text-slate-600 hover:translate-x-1 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                    <span className="w-0 h-px transition-all bg-current group-hover:w-2" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-950 dark:text-white">Company</h3>
            <ul className="space-y-4">
              {[
                { href: "#", label: "About Us" },
                { href: "#", label: "Careers" },
                { href: supportMail("Contact AutoVerge"), label: "Contact", external: true },
                { href: supportMail("Terms"), label: "Terms", external: true },
                { href: supportMail("Privacy"), label: "Privacy", external: true }
              ].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href} 
                    target={link.external ? "_blank" : undefined} 
                    rel={link.external ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-sm transition-all duration-300 group text-slate-600 hover:translate-x-1 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                  >
                    <span className="w-0 h-px transition-all bg-current group-hover:w-2" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-950 dark:text-white">Legal</h3>
            <ul className="space-y-4">
              {[
                { href: supportMail("Terms & Conditions"), label: "Terms & Conditions", external: true },
                { href: supportMail("Privacy Policy"), label: "Privacy Policy", external: true },
                { href: supportMail("Cookie Policy"), label: "Cookie Policy", external: true },
                { href: "#", label: "Security" }
              ].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href} 
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-sm transition-all duration-300 group text-slate-600 hover:translate-x-1 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-400"
                  >
                    <span className="w-0 h-px transition-all bg-current group-hover:w-2" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-200/40 dark:border-white/10">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-center text-slate-600 dark:text-slate-400 md:flex-row md:text-left">
            <p>© 2026 AutoVerge. All Rights Reserved.</p>
            <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">AI-Powered Automotive Marketplace</p>
          </div>
        </div>
      </div>
    </footer>
  );
}