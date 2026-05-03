import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Smartphone, Download, X, Bot, ShieldCheck, BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";
  const [installOpen, setInstallOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function go(id: string) {
    setMenuOpen(false);
    if (id === "home") {
      if (onHome) window.scrollTo({ top: 0, behavior: "smooth" });
      else navigate("/");
      return;
    }
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/#${id}`);
    }
  }

  return (
    <>
      <header className="border-b border-slate-200/70 bg-white/80 sticky top-0 z-30 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-base sm:text-lg group min-w-0">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent truncate">
              SGO Portal
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all"
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setInstallOpen(true)}
              className="rounded-full border-slate-300 hidden sm:inline-flex"
            >
              <Smartphone className="h-4 w-4" /> Install App
            </Button>
            <Button asChild className="rounded-full shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Link to="/apply">Apply Now</Link>
            </Button>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden animate-in fade-in"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => go(s.id)}
                  className="text-left px-4 py-3 rounded-xl text-base font-medium text-slate-800 hover:bg-slate-100"
                >
                  {s.label}
                </button>
              ))}
              <button
                onClick={() => { setMenuOpen(false); setInstallOpen(true); }}
                className="text-left px-4 py-3 rounded-xl text-base font-medium text-slate-800 hover:bg-slate-100 flex items-center gap-2 mt-2"
              >
                <Smartphone className="h-4 w-4" /> Install App
              </button>
            </nav>
            <div className="mt-auto">
              <Button asChild className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
                <Link to="/apply" onClick={() => setMenuOpen(false)}>Apply Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {installOpen && <InstallAppModal onClose={() => setInstallOpen(false)} />}
    </>
  );
}

function InstallAppModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-4">
            <Smartphone className="h-7 w-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">SGO Scholar App</h2>
          <p className="text-blue-100 text-sm">Built for approved scholar grantees</p>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-sm text-slate-600">
            The mobile app gives scholars on-the-go access to:
          </p>
          <div className="space-y-3">
            <Feature icon={Bot} text="AI chatbot for instant scholarship support" />
            <Feature icon={ShieldCheck} text="Document upload &amp; eligibility verification" />
            <Feature icon={BarChart3} text="Real-time grant status &amp; renewal tracking" />
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
            <strong>Android only · 50 MB.</strong> After downloading, open the APK file on your phone.
            You may need to allow "Install from unknown sources" in your settings.
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              asChild
              className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <a href="/sgo-scholar.apk" download="sgo-scholar.apk">
                <Download className="h-4 w-4" /> Download APK
              </a>
            </Button>
            <Button onClick={onClose} variant="outline" className="rounded-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <p className="text-sm text-slate-700 pt-1.5" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}
