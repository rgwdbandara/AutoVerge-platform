import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import logo from "../assets/logo.png";

const ADMIN_EMAILS = [
  "admin@gmail.com",
  "bwathsala24@gmail.com",
  "bwathsala24@gamil.com",
];

function Navbar() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const currentLang = i18n.resolvedLanguage || i18n.language;
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { user } = useUser();
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";

    const saved = localStorage.getItem("autoverge_theme");
    if (saved === "dark" || saved === "light") return saved;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim();
  const role = user?.publicMetadata?.role;
  const isAdmin = ADMIN_EMAILS.includes(email) || role === "admin";

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("autoverge_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "si" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("autoverge_lang", newLang);
  };

  
  const navItems = [
  { to: "/", label: t("navbar.home") },
  { to: "/browse", label: t("navbar.browseCars") },
  { to: "/articles", label: t("navbar.articles", { defaultValue: "Articles" }) },
  { to: "/sell", label: t("navbar.sellVehicle") },
  {
    to: isAdmin ? "/admin/dashboard" : "/profile",
    label: isAdmin ? t("navbar.adminDashboard") : t("navbar.dashboard"),
  },
];

  return (
   <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
     <div className="px-3 pt-3 mx-auto max-w-7xl md:px-5 md:pt-4">
      <div className={`pointer-events-auto relative flex h-[72px] items-center justify-between gap-4 rounded-full border px-4 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-colors duration-300 md:px-5 ${
        theme === "dark"
          ? "border-white/10 bg-slate-900/70"
          : "border-white/50 bg-white/60"
      }`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-transparent to-white/5 opacity-40" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <img src={logo} className="h-8 md:h-9" alt="AutoVerge" />
          <span className={`text-xl font-bold tracking-tight md:text-2xl transition-colors duration-300 ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}>AutoVerge</span>
        </Link>

        <nav className="relative z-10 items-center hidden gap-6 lg:flex xl:gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? `${theme === "dark" ? "bg-white/10 text-white" : "bg-slate-900 text-white"}`
                    : `${theme === "dark" ? "text-slate-200 hover:bg-white/10 hover:text-white" : "text-slate-700 hover:bg-slate-900/5 hover:text-slate-900"}`
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden ${
              theme === "dark"
                ? "border-white/15 bg-white/10 text-white hover:bg-white/20"
                : "border-slate-200 bg-white/70 text-slate-700 hover:bg-white"
            }`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 ${
              theme === "dark"
                ? "border-white/15 bg-white/10 text-amber-300 hover:bg-white/20"
                : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"
            }`}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className={`inline-flex h-9 min-w-14 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors duration-300 ${
              theme === "dark"
                ? "border-white/15 bg-white/10 text-white hover:bg-white/20"
                : "border-slate-200 bg-white/70 text-slate-900 hover:bg-white"
            }`}
            title={currentLang === "en" ? "සිංහල" : "English"}
            aria-label={currentLang === "en" ? "Switch to Sinhala" : "Switch to English"}
          >
            {currentLang === "en" ? "සිංහල" : "EN"}
          </button>

          <SignedOut>
            <SignInButton>
              <button className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300">
                {currentLang === "si" ? "ඇතුල් වන්න" : t("buttons.login", { defaultValue: "Login" })}
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div
              onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/profile")}
              className="cursor-pointer"
            >
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 ring-2 ring-white/30",
                    userButtonPopoverCard: "hidden",
                  },
                }}
                afterSignOutUrl="/"
                showName={false}
              />
            </div>
          </SignedIn>
        </div>

        {mobileOpen && (
          <div className={`absolute left-0 right-0 top-[calc(100%+12px)] z-20 rounded-[28px] border p-4 shadow-2xl backdrop-blur-xl lg:hidden ${
            theme === "dark"
              ? "border-white/10 bg-slate-950/95"
              : "border-slate-200 bg-white/95"
          }`}>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? `${theme === "dark" ? "bg-white/10 text-white" : "bg-slate-900 text-white"}`
                        : `${theme === "dark" ? "text-slate-200 hover:bg-white/10 hover:text-white" : "text-slate-700 hover:bg-slate-900/5 hover:text-slate-900"}`
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className={`mt-2 grid gap-2 rounded-[22px] border p-3 ${theme === "dark" ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setMobileOpen(false);
                  }}
                  className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                    theme === "dark"
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-white text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleLanguage();
                    setMobileOpen(false);
                  }}
                  className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                    theme === "dark"
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-white text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {currentLang === "en" ? "සිංහල" : "English"}
                </button>

                <div className="pt-1">
                  <SignedOut>
                    <SignInButton>
                      <button className="w-full px-4 py-3 text-sm font-semibold transition rounded-2xl bg-amber-400 text-slate-900 hover:bg-amber-300">
                        {currentLang === "si" ? "ඇතුල් වන්න" : t("buttons.login", { defaultValue: "Login" })}
                      </button>
                    </SignInButton>
                  </SignedOut>

                  <SignedIn>
                    <div className="flex items-center justify-center">
                      <UserButton
                        appearance={{
                          elements: {
                            userButtonAvatarBox: "w-10 h-10 ring-2 ring-white/20",
                            userButtonPopoverCard: "hidden",
                          },
                        }}
                        afterSignOutUrl="/"
                        showName={false}
                      />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
     </div>
    </header>
  );
}

export default Navbar;