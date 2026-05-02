import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { GraduationCap, Search } from "lucide-react";

interface Scholar {
  id: string; fullName: string; email: string; studentId: string;
  program: string; yearLevel: string; scholarshipType: string; status: string;
}

export default function Scholars() {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "scholars"), orderBy("awardedAt", "desc"));
    return onSnapshot(q, (snap) => setScholars(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
  }, []);

  const filtered = useMemo(
    () => scholars.filter((s) => `${s.fullName} ${s.studentId} ${s.program}`.toLowerCase().includes(search.toLowerCase())),
    [scholars, search]
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Scholars</h1>
          <p className="text-slate-600 mt-1">Approved applicants enrolled in scholarship programs.</p>
        </div>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search scholars…" className="pl-9 w-72" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card className="border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <p className="text-sm font-medium">{filtered.length} active scholar{filtered.length !== 1 && "s"}</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>Scholar</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Scholarship</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
          