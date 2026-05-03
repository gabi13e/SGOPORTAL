import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "./Dashboard";
import { CheckCircle2, XCircle, Eye, Trash2 } from "lucide-react";

interface Application {
  id: string; fullName: string; email: string; studentId: string; program: string; course?: string;
  yearLevel: string; sex?: string; birthdate?: string; mobileNumber?: string;
  unitsEnrolled?: number | null; totalAssessment?: number | null;
  streetBarangay?: string; townCity?: string; province?: string; zipCode?: string;
  pwd?: string; ipGroup?: string;
  fatherLastName?: string; fatherGivenName?: string; fatherMiddleName?: string;
  motherLastName?: string; motherGivenName?: string; motherMiddleName?: string;
  scholarshipType: string; status: string;
  eligibilityCheck?: { eligible: boolean; notes: string[] };
}

export default function Applicants() {
  const [apps, setApps] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Application | null>(null);

  useEffect(() => {
    const q = query(collection(db, "applications"), orderBy("submittedAt", "desc"));
    return onSnapshot(q, (snap) => {
      setApps(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
  }, []);

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (search && !`${a.fullName} ${a.email} ${a.studentId}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [apps, search, statusFilter]);

  async function setStatus(id: string, status: string) {
    await updateDoc(doc(db, "applications", id), { status, reviewedAt: serverTimestamp() });
  }

  async function remove(id: string) {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    await deleteDoc(doc(db, "applications", id));
    setSelected(null);
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applicants</h1>
          <p className="text-slate-600 mt-1">Review applications, run eligibility checks, and approve scholars.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input placeholder="Search…" value={search}
            onChange={(e) => setSearch(e.target.value)} className="flex-1 sm:w-64 bg-white" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 sm:w-40 bg-white flex-shrink-0"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <p className="text-sm font-medium">{filtered.length} application{filtered.length !== 1 && "s"}</p>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-16 text-slate-500">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Eye className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm">No applications match your filters.</p>
                  </div>
                </TableCell></TableRow>
              ) : filtered.map((a) => (
                <TableRow key={a.id} className="hover:bg-slate-50/60">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {a.fullName?.[0] ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{a.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">{a.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{a.studentId}</TableCell>
                  <TableCell className="text-xs">{a.course ?? a.program}</TableCell>
                  <TableCell>{a.yearLevel}</TableCell>
                  <TableCell>{a.unitsEnrolled ?? "—"}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => setSelected(a)}><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => setStatus(a.id, "approved")}>
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => setStatus(a.id, "rejected")}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selected.fullName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selected.email} · {selected.studentId}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <Detail label="Course" value={selected.course ?? selected.program ?? "—"} />
                <Detail label="Year Level" value={selected.yearLevel} />
                <Detail label="Sex" value={selected.sex ?? "—"} />
                <Detail label="Birthdate" value={selected.birthdate ?? "—"} />
                <Detail label="Units Enrolled" value={String(selected.unitsEnrolled ?? "—")} />
                <Detail label="Total Assessment" value={selected.totalAssessment != null ? `₱${selected.totalAssessment.toLocaleString()}` : "—"} />
                <Detail label="Mobile" value={selected.mobileNumber ?? "—"} />
                <Detail label="PWD" value={selected.pwd ?? "—"} />
              </div>
              <Detail label="Permanent Address" multiline
                value={[selected.streetBarangay, selected.townCity, selected.province, selected.zipCode].filter(Boolean).join(", ") || "—"} />
              {selected.ipGroup && <Detail label="IP Group" value={selected.ipGroup} />}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Family Background</p>
                <p>Father: {[selected.fatherGivenName, selected.fatherMiddleName, selected.fatherLastName].filter(Boolean).join(" ") || "—"}</p>
                <p>Mother: {[selected.motherGivenName, selected.motherMiddleName, selected.motherLastName].filter(Boolean).join(" ") || "—"}</p>
              </div>
              <Detail label="Scholarship Type" value={selected.scholarshipType} />
              {selected.eligibilityCheck && (
                <div>
                  <p className="font-medium mb-1">Eligibility Pre-Check</p>
                  <p className={selected.eligibilityCheck.eligible ? "text-emerald-600" : "text-amber-600"}>
                    {selected.eligibilityCheck.eligible ? "✓ Passes basic eligibility." : "⚠ Issues found:"}
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    {selected.eligibilityCheck.notes.map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                </div>
              )}
              <div className="grid grid-cols-2 sm:flex gap-2 pt-2">
                <Button onClick={() => { setStatus(selected.id, "approved"); setSelected(null); }} className="sm:flex-1">
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </Button>
                <Button onClick={() => { setStatus(selected.id, "under-review"); setSelected(null); }} variant="outline" className="sm:flex-1">
                  Review
                </Button>
                <Button onClick={() => { setStatus(selected.id, "rejected"); setSelected(null); }} variant="destructive" className="sm:flex-1">
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
                <Button onClick={() => remove(selected.id)} variant="ghost" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={multiline ? "whitespace-pre-wrap" : ""}>{value}</p>
    </div>
  );
}
