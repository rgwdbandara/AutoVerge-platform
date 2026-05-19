import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import { Bell, Menu, Moon, Sun, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import logo from "../assets/logo.png";
import ProfileMenu from "./ProfileMenu";
import { useApi } from "../lib/api";

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
  const [unreadInquiryCount, setUnreadInquiryCount] = useState(0);
  const api = useApi();
  
  const { user } = useUser();
  const isSignedIn = Boolean(user);
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

  useEffect(() => {
    let mounted = true;

    const fetchUnreadInquiryCount = async () => {
      if (!user) {
        if (mounted) setUnreadInquiryCount(0);
        return;
      }

      try {
        const data = await api("/api/vehicles/my/inquiries/unread-count");
        if (mounted) {
          setUnreadInquiryCount(Number(data?.unreadCount || 0));
        }
      } catch (error) {
        console.error("UNREAD INQUIRY COUNT ERROR:", error);
      }
    };

    fetchUnreadInquiryCount();
    const intervalId = setInterval(fetchUnreadInquiryCount, 15000);

    const handleFocus = () => fetchUnreadInquiryCount();
    window.addEventListener("focus", handleFocus);

    return () => {
      mounted = false;
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [api, user]);

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
    ...(isSignedIn
      ? [
          {
            to: isAdmin ? "/admin/dashboard" : "/profile",
            label: isAdmin ? t("navbar.adminDashboard") : t("navbar.dashboard"),
          },
        ]
      : []),
  ];

  return (
   <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
     <div className="px-3 pt-3 mx-auto max-w-7xl md:px-5 md:pt-4">
      <div className={`pointer-events-auto relative flex h-[72px] flex-nowrap items-center justify-between gap-3 rounded-full border px-4 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-colors duration-300 md:px-5 ${
        theme === "dark"
          ? "border-white/10 bg-slate-900/70"
          : "border-white/50 bg-white/60"
      }`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-transparent to-white/5 opacity-40" />

        <Link
          to="/"
          className={`relative z-10 flex min-w-[170px] shrink-0 items-center gap-3 rounded-full border px-2.5 py-2 pl-2.5 pr-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 md:min-w-[200px] md:gap-3 md:pr-6 ${
            theme === "dark"
              ? "border-white/10 bg-white/5 hover:bg-white/10"
              : "border-slate-200/80 bg-white/70 hover:bg-white"
          }`}
          aria-label="AutoVerge home"
        >
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border ${
            theme === "dark" ? "border-white/10 bg-slate-950/40" : "border-white/70 bg-white"
          }`}>
            <img src={logo} className="object-contain w-8 h-8" alt="AutoVerge" />
          </span>

          <span className="flex flex-col min-w-0 leading-tight">
            <span className={`text-[0.72rem] font-medium uppercase tracking-[0.32em] ${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}>
              Auto
            </span>
            <span className={`truncate text-lg font-semibold tracking-tight md:text-xl ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              AutoVerge
            </span>
          </span>
        </Link>

        <nav className="relative z-10 hidden flex-1 items-center justify-center gap-2 min-w-0 lg:flex xl:gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-2.5 py-2 text-xs font-medium leading-none transition-colors duration-300 xl:text-sm ${
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

        <div className="relative z-10 flex shrink-0 items-center gap-2 md:gap-3">
          <SignedIn>
            <button
              type="button"
              onClick={() => navigate("/profile/inquiries")}
              className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 ${
                theme === "dark"
                  ? "border-white/15 bg-white/10 text-white hover:bg-white/20"
                  : "border-slate-200 bg-white/70 text-slate-700 hover:bg-white"
              }`}
              aria-label="Open inquiries"
              title="Received inquiries"
            >
              <Bell size={16} />

              {unreadInquiryCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white shadow-lg animate-pulse">
                  {unreadInquiryCount > 9 ? "9+" : unreadInquiryCount}
                </span>
              )}
            </button>
          </SignedIn>

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
            <ProfileMenu
              user={user}
              isAdmin={isAdmin}
              theme={theme}
              onNavigate={(path) => navigate(path)}
            />
          </SignedIn>
        </div>

        {mobileOpen && (
          <div
            className={`absolute left-0 right-0 top-[calc(100%+12px)] z-20 rounded-[28px] border p-4 shadow-2xl backdrop-blur-xl lg:hidden ${
              theme === "dark"
                ? "border-white/10 bg-slate-950/95"
                : "border-slate-200 bg-white/95"
            }`}
          >
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
                    <ProfileMenu
                      user={user}
                      isAdmin={isAdmin}
                      theme={theme}
                      onNavigate={(path) => {
                        setMobileOpen(false);
                        navigate(path);
                      }}
                    />
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