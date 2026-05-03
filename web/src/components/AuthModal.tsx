import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GraduationCap, X, Mail, Lock, User as UserIcon, IdCard, AlertCircle, CheckCircle2 } from "lucide-react";

type Mode = "login" | "register" | "reset";

export default function AuthModal({
  onClose,
  defaultMode = "register",
  title = "Sign in to apply",
  subtitle = "An account lets you track your application from any device.",
}: {
  onClose?: () => void;
  defaultMode?: Mode;
  title?: string;
  subtitle?: string;
}) {
  const { login, register, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // form state
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setInfo(null);
    try {
      if (mode === "login") await login(email, password);
      else if (mode === "register") await register({ email, password, fullName, studentId });
      else if (mode === "reset") {
        await resetPassword(email);
        setInfo("Password reset email sent. Check your inbox.");
      }
    } catch (e: any) {
      setErr(prettyError(e?.code ?? e?.message ?? "Something went wrong."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md p-7 relative shadow-2xl border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        )}

        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md mb-4">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "register" && "Create your account"}
          {mode === "login" && "Welcome back"}
          {mode === "reset" && "Reset your password"}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {mode === "register" && subtitle}
          {mode === "login" && "Sign in to continue your application."}
          {mode === "reset" && "We'll email you a reset link."}
        </p>

        {/* Tabs */}
        {mode !== "reset" && (
          <div className="grid grid-cols-2 bg-slate-100 rounded-full p-1 mt-5 mb-5">
            <TabBtn active={mode === "register"} onClick={() => { setMode("register"); setErr(null); }}>Sign Up</TabBtn>
            <TabBtn active={mode === "login"} onClick={() => { setMode("login"); setErr(null); }}>Sign In</TabBtn>
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <>
              <Field icon={UserIcon} label="Full Name">
                <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan Dela Cruz" />
              </Field>
              <Field icon={IdCard} label="Student ID">
                <Input required value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="2024-12345" />
              </Field>
            </>
          )}
          <Field icon={Mail} label="Email">
            <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </Field>
          {mode !== "reset" && (
            <Field icon={Lock} label="Password">
              <Input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            </Field>
          )}

          {err && (
            <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-md p-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /> <span>{err}</span>
            </div>
          )}
          {info && (
            <div className="flex items-start gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md p-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" /> <span>{info}</span>
            </div>
          )}

          <Button type="submit" disabled={busy} className="w-full rounded-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            {busy
              ? "Please wait…"
              : mode === "register" ? "Create Account & Continue"
              : mode === "login"    ? "Sign In"
              :                       "Send Reset Link"}
          </Button>

          {mode === "login" && (
            <button type="button" onClick={() => { setMode("reset"); setErr(null); }}
              className="text-xs text-blue-600 hover:underline mx-auto block">
              Forgot password?
            </button>
          )}
          {mode === "reset" && (
            <button type="button" onClick={() => { setMode("login"); setErr(null); setInfo(null); }}
              className="text-xs text-slate-600 hover:underline mx-auto block">
              ← Back to sign in
            </button>
          )}
        </form>
      </Card>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2 rounded-full text-sm font-medium transition-all ${
        active ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="relative">
        <Icon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <div className="[&>input]:pl-9">{children}</div>
      </div>
    </div>
  );
}

function prettyError(code: string) {
  if (code.includes("email-already-in-use")) return "An account with this email already exists. Try signing in instead.";
  if (code.includes("invalid-email")) return "That doesn't look like a valid email.";
  if (code.includes("weak-password")) return "Password is too weak — use at least 6 characters.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Email or password is incorrect.";
  if (code.includes("too-many-requests")) return "Too many attempts. Please wait a moment and try again.";
  return code;
}
