import { useEffect, useMemo, useRef, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { UserRound, ChevronDown } from "lucide-react";

function ProfileMenu({ user, isAdmin, theme = "light", onNavigate }) {
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const userName = user?.fullName || user?.firstName || user?.username || "Account";
  const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "";
  const imageUrl = user?.imageUrl || "";
  const avatarLetter = (user?.fullName || user?.firstName || user?.username || "A")
    .trim()
    .charAt(0)
    .toUpperCase();

  const dashboardPath = useMemo(() => (isAdmin ? "/admin/dashboard" : "/profile"), [isAdmin]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const avatar = (
    <span className={`flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/60 shadow-sm ${theme === "dark" ? "bg-white/10" : "bg-slate-200"}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={userName} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
          {avatarLetter}
        </span>
      )}
    </span>
  );

  const goToDashboard = () => {
    setOpen(false);
    onNavigate(dashboardPath);
  };

  const handleLogout = async () => {
    setOpen(false);
    await signOut(() => onNavigate("/"));
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full border px-3 py-2 shadow-sm transition duration-300 hover:-translate-y-0.5 ${
          theme === "dark"
            ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
            : "border-blue-200 bg-white/80 text-slate-900 hover:bg-white"
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {avatar}
        <span className="max-w-[140px] truncate text-sm font-semibold md:max-w-[180px]">
          {userName}
        </span>
        <ChevronDown size={16} className="text-slate-500 dark:text-slate-300" />
      </button>

      {open && (
        <div
          className={`absolute right-0 top-[calc(100%+12px)] z-50 w-[320px] overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl ${
            theme === "dark"
              ? "border-white/10 bg-slate-950/95"
              : "border-slate-200 bg-white/95"
          }`}
        >
          <div className={`flex items-center gap-3 border-b px-4 py-4 ${theme === "dark" ? "border-white/10" : "border-slate-100"}`}>
            <span className={`flex h-12 w-12 shrink-0 overflow-hidden rounded-full border ${theme === "dark" ? "border-white/10 bg-white/10" : "border-slate-200 bg-slate-100"}`}>
              {imageUrl ? (
                <img src={imageUrl} alt={userName} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-base font-semibold text-white">
                  {avatarLetter}
                </span>
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{userName}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{userEmail || "No email available"}</p>
            </div>
          </div>

          <div className="p-2">
            <button
              type="button"
              onClick={goToDashboard}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                theme === "dark"
                  ? "text-white hover:bg-white/10"
                  : "text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span>{isAdmin ? "Admin dashboard" : "My dashboard"}</span>
              <span>›</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className={`mt-1 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                theme === "dark"
                  ? "text-red-300 hover:bg-red-500/10"
                  : "text-red-600 hover:bg-red-50"
              }`}
            >
              <span>Logout</span>
              <span>›</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
