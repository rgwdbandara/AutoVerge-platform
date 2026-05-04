import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { ChevronRight, LayoutDashboard, MessageSquareText, Settings2, CarFront, LogOut, BadgePlus } from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Pending Ads", path: "/admin/pending", icon: MessageSquareText },
    { name: "Cars", path: "/admin/cars", icon: CarFront },
    { name: "Imported Cars", path: "/admin/imported", icon: BadgePlus },
    { name: "Settings", path: "/admin/settings", icon: Settings2 },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] pt-20">
      <div className="flex gap-8 px-6 py-10 mx-auto max-w-7xl">
        <aside className="sticky top-24 h-fit w-[292px] rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <h2 className="mb-5 text-[28px] font-semibold tracking-tight text-slate-900">
            Admin Panel
          </h2>

          <div className="space-y-3">
            {menu.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center justify-between rounded-[12px] border px-4 py-3 text-left text-[16px] transition ${
                  location.pathname === item.path
                    ? "border-slate-900 bg-[#dbeafe] font-medium text-[#2563eb] shadow-[0_2px_0_rgba(15,23,42,0.08)]"
                    : "border-transparent text-slate-800 hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>

          <button
            onClick={() => signOut(() => navigate("/"))}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#ff5a5f] py-3 text-[16px] font-medium text-[#ff5a5f] transition hover:bg-[#fff5f5]"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </aside>

        <main className="min-h-[calc(100vh-10rem)] flex-1 rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
