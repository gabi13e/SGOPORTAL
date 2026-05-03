import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Landing from "@/pages/Landing";
import Apply from "@/pages/Apply";
import Login from "@/pages/Login";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Applicants from "@/pages/admin/Applicants";
import Reports from "@/pages/admin/Reports";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function PublicShell({ children }: { children: JSX.Element }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicShell><Landing /></PublicShell>} />
        <Route path="/apply" element={<PublicShell><Apply /></PublicShell>} />
        <Route path="/login" element={<PublicShell><Login /></PublicShell>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
