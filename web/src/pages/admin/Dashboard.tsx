import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileCheck2, Clock, XCircle, TrendingUp, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";

interface Application {
  id: string; fullName: string; scholarshipType: string; status: string;
  yearLevel?: string; course?: string; submittedAt?: any;
}

export default function Dashboard() {
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    const q = query(collection(db, "applications"), orderBy("submittedAt", "desc"), limit(50));
    return onSnapshot(q, (snap) => {
      setApps(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
  }, []);

  const total = apps.length;
  const pending = apps.filter((a) => a.status === "pending").length;
  const approved = apps.filter((a) => a.status === "approved").length;
  const rejected = apps.filter((a) => a.status === "rejected").length;

  const byYear: Record<string, number> = {};
  apps.forEach((a) => {
    const y = a.yearLevel ?? "Unknown";
    byYear[y] = (byYear[y] ?? 0) + 1;
  });
  const chartData = Object.entries(byYear).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back 👋</h1>
        <p className="text-slate-600 mt-1">Here's what's happening with scholarship applications today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users} label="Total Applications" value={total}
          iconColor="from-blue-500 to-cyan-500"
          delta={total > 0 ? "+ live" : "—"}
        />
        <StatCard
          icon={Clock} label="Pending Review" value={pending}
          iconColor="from-amber-500 to-orange-500"
          delta={`${total > 0 ? Math.round((pending / total) * 100) : 0}% of total`}
        />
        <StatCard
          icon={FileCheck2} label="Approved" value={approved}
          iconColor="from-emerald-500 to-teal-500"
          delta={`${total > 0 ? Math.round((approved / total) * 100) : 0}% approval rate`}
        />
        <StatCard
          icon={XCircle} label="Rejected" value={rejected}
          iconColor="from-rose-500 to-red-500"
          delta={`${total > 0 ? Math.round((rejected / total) * 100) : 0}% of total`}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2 p-6 border-slate-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Applications by Year Level</h3>
              <p className="text-sm text-slate-500">Distribution across academic years</p>
            </div>
            <Badge variant="outline" className="gap-1 text-xs">
              <TrendingUp className="h-3 w-3" /> Live
            </Badge>
          </div>
          <div className="h-72">
            {chartData.length === 0 ? (
              <EmptyState message="No applications yet — they'll appear here as they come in." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                    cursor={{ fill: "rgba(99,102,241,0.06)" }}
                  />
                  <Bar dataKey="value" fill="url(#bar-grad)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            <Link to="/admin/applicants" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {apps.length === 0 ? (
            <EmptyState message="No activity yet." compact />
          ) : (
            <div className="space-y-4">
              {apps.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {(a.fullName ?? "?")[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{a.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{a.course ?? a.scholarshipType}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, iconColor, delta }: any) {
  return (
    <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-3xl font-bold mt-1 tracking-tight">{value}</p>
          <p className="text-xs text-slate-500 mt-2">{delta}</p>
        </div>
        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-md flex-shrink-0`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ message, compact }: { message: string; compact?: boolean }) {
  return (
    <div className={`h-full flex flex-col items-center justify-center text-center ${compact ? "py-8" : ""}`}>
      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <FileCheck2 className="h-5 w-5 text-slate-400" />
      </div>
      <p className="text-sm text-slate-500 max-w-xs">{message}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    pending: { cls: "bg-amber-50 text-amber-700 border-amber-200", label: "Pending" },
    approved: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Approved" },
    rejected: { cls: "bg-rose-50 text-rose-700 border-rose-200", label: "Rejected" },
    "under-review": { cls: "bg-blue-50 text-blue-700 border-blue-200", label: "Under Review" },
  };
  const m = map[status] ?? { cls: "bg-slate-100 text-slate-700 border-slate-200", label: status };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${m.cls}`}>
      {m.label}
    </span>
  );
}
