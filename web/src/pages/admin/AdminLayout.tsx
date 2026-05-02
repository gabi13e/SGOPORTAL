import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Users, GraduationCap, BarChart3, LogOut, Bell, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/applicants", label: "Applicants", icon: Users },
  { to: "/admin/scholars", label: "Scholars", icon: GraduationCap },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const current = nav.find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)));

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            SGO Admin
          </Link>
        </div>
        <div className="px-3 py-2 mt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Manage</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.email?.[0].toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">SGO Admin</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 justify-start text-slate-600"
            onClick={async () => { await logout(); navigate("/"); }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8">
          <div>
            <p className="text-xs text-slate-500">SGO Portal</p>
            <h2 className="font-semibold text-slate-900">{current?.label ?? "Admin"}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search…" className="pl-9 w-64 bg-slate-50 border-slate-200" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4 text-slate-600" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
