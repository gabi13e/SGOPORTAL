import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#1d4ed8", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Reports() {
  const [apps, setApps] = useState<any[]>([]);
  const [scholars, setScholars] = useState<any[]>([]);

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "applications"), (s) => setApps(s.docs.map((d) => d.data())));
    const u2 = onSnapshot(collection(db, "scholars"), (s) => setScholars(s.docs.map((d) => d.data())));
    return () => { u1(); u2(); };
  }, []);

  const statusData = ["pending", "under-review", "approved", "rejected"].map((s) => ({
    name: s, value: apps.filter((a) => a.status === s).length,
  }));

  const programCounts: Record<string, number> = {};
  scholars.forEach((s) => { programCounts[s.program] = (programCounts[s.program] ?? 0) + 1; });
  const programData = Object.entries(programCounts).map(([name, value]) => ({ name, value }));

  const approvalRate = apps.length === 0 ? 0
    : Math.round((apps.filter((a) => a.status === "approved").length / apps.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Real-time workflow monitoring across applications and scholars.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total Applications" value={apps.length} />
        <Stat label="Active Scholars" value={scholars.length} />
        <Stat label="Approval Rate" value={`${approvalRate}%`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Application Status Distribution</CardTitle></CardHeader>
          <CardContent className="h-80">
            {apps.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Scholars by Program</CardTitle></CardHeader>
          <CardContent className="h-80">
            {programData.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={programData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}
function Empty() {
  return <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No data yet.</div>;
}
