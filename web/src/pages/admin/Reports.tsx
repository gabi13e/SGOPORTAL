import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { TrendingUp, Users, GraduationCap, CheckCircle2 } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Reports() {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    return onSnapshot(collection(db, "applications"), (s) => setApps(s.docs.map((d) => d.data())));
  }, []);

  const approvedApps = apps.filter((a) => a.status === "approved");

  const statusData = ["pending", "under-review", "approved", "rejected"].map((s) => ({
    name: s, value: apps.filter((a) => a.status === s).length,
  }));

  const programCounts: Record<string, number> = {};
  approvedApps.forEach((a) => { programCounts[a.program] = (programCounts[a.program] ?? 0) + 1; });
  const programData = Object.entries(programCounts).map(([name, value]) => ({ name, value }));

  const approvalRate = apps.length === 0 ? 0 : Math.round((approvedApps.length / apps.length) * 100);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-600 mt-1">Real-time workflow monitoring across applications and scholars.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KPI icon={Users} label="Total Applications" value={apps.length} color="from-blue-500 to-cyan-500" />
        <KPI icon={GraduationCap} label="Approved Scholars" value={approvedApps.length} color="from-emerald-500 to-teal-500" />
        <KPI icon={CheckCircle2} label="Approval Rate" value={`${approvalRate}%`} color="from-purple-500 to-indigo-500" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6 border-slate-200">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Application Status</h3>
            <p className="text-sm text-slate-500">Distribution by review stage</p>
          </div>
          <div className="h-80">
            {apps.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Approved by Program</h3>
            <p className="text-sm text-slate-500">Active scholarship enrollment</p>
          </div>
          <div className="h-80">
            {programData.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={programData}>
                  <defs>
                    <linearGradient id="rep-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                  <Bar dataKey="value" fill="url(#rep-grad)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-3xl font-bold mt-1 tracking-tight">{value}</p>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Live
          </p>
        </div>
        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </Card>
  );
}
function Empty() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
      <p className="text-sm">No data yet — analytics populate as applications come in.</p>
    </div>
  );
}
