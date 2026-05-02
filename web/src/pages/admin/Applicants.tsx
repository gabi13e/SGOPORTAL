import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
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

  async function setStatus(id: string, status: string, app?: Application) {
    await updateDoc(doc(db, "applications", id), { status, reviewedAt: serverTimestamp() });
    if (status === "approved" && app) {
      await addDoc(collection(db, "scholars"), {
        fullName: app.fullName, email: app.email, studentId: app.studentId,
        program: app.program, yearLevel: app.yearLevel, scholarshipType: app.scholarshipType,
        applicationId: id, status: "active", awardedAt: serverTimestamp(),
      });
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    await deleteDoc(doc(db, "applications", id));
    setSelected(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Applicants</h1>
        <p className="text-muted-foreground">Review applications, run eligibility checks, and approve scholars.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>All Applications ({filtered.length})</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Search by name, email, ID…" value={search}
                onChange={(e) => setSearch(e.target.value)} className="w-64" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No applications match.</TableCell></TableRow>
              ) : filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.fullName}</TableCell>
                  <TableCell>{a.studentId}</TableCell>
                  <TableCell className="text-xs">{a.course ?? a.program}</TableCell>
                  <TableCell>{a.yearLevel}</TableCell>
                  <TableCell>{a.unitsEnrolled ?? "—"}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => setSelected(a)}><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => setStatus(a.id, "approved", a)}>
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
              <div className="flex gap-2 pt-2">
                <Button onClick={() => { setStatus(selected.id, "approved", selected); setSelected(null); }} className="flex-1">
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </Button>
                <Button onClick={() => { setStatus(selected.id, "under-review"); setSelected(null); }} variant="outline" className="flex-1">
                  Mark Under Review
                </Button>
                <Button onClick={() => { setStatus(selected.id, "rejected"); setSelected(null); }} variant="destructive" className="flex-1">
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
                <Button onClick={() => remove(selected.id)} variant="ghost"><Trash2 className="h-4 w-4" /></Button>
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
