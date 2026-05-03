import { useState } from "react";
import { addDoc, collection, getDocs, limit, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertCircle, Smartphone } from "lucide-react";

interface FormState {
  studentId: string;
  lastName: string;
  givenName: string;
  extensionName: string;
  middleName: string;
  sex: string;
  birthdate: string;
  unitsEnrolled: string;
  totalAssessment: string;
  course: string;
  yearLevel: string;

  streetBarangay: string;
  townCity: string;
  province: string;
  zipCode: string;
  email: string;
  mobileNumber: string;

  pwd: string;
  ipGroup: string;

  fatherLastName: string;
  fatherGivenName: string;
  fatherMiddleName: string;
  motherLastName: string;
  motherGivenName: string;
  motherMiddleName: string;
}

const initial: FormState = {
  studentId: "", lastName: "", givenName: "", extensionName: "", middleName: "",
  sex: "", birthdate: "", unitsEnrolled: "", totalAssessment: "", course: "", yearLevel: "",
  streetBarangay: "", townCity: "", province: "", zipCode: "", email: "", mobileNumber: "",
  pwd: "", ipGroup: "",
  fatherLastName: "", fatherGivenName: "", fatherMiddleName: "",
  motherLastName: "", motherGivenName: "", motherMiddleName: "",
};

export default function Apply() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submittedStudentId, setSubmittedStudentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((p) => ({ ...p, [k]: v }));

  function evaluateEligibility(): { eligible: boolean; notes: string[] } {
    const notes: string[] = [];
    const units = parseFloat(form.unitsEnrolled);
    if (isNaN(units) || units <= 0) notes.push("Enrolled units are required.");
    if (!form.course.trim()) notes.push("Course / program is required.");
    if (!form.yearLevel.trim()) notes.push("Year level is required.");
    return { eligible: notes.length === 0, notes };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const studentId = form.studentId.trim();

      // Reject duplicate Student IDs.
      const dup = await getDocs(query(collection(db, "applications"), where("studentId", "==", studentId), limit(1)));
      if (!dup.empty) {
        setError("A pre-application has already been submitted with this Student ID.");
        setSubmitting(false);
        return;
      }

      const elig = evaluateEligibility();
      const fullName = [form.givenName, form.middleName, form.lastName, form.extensionName]
        .filter(Boolean).join(" ");

      await addDoc(collection(db, "applications"), {
        ...form,
        studentId,
        uid: null, // linked when the scholar signs up in the mobile app
        userEmail: form.email.trim(),
        fullName,
        unitsEnrolled: parseFloat(form.unitsEnrolled) || null,
        totalAssessment: parseFloat(form.totalAssessment) || null,
        scholarshipType: "UniFAST – Tertiary Education Subsidy",
        program: form.course,
        status: "pending",
        eligibilityCheck: elig,
        submittedAt: serverTimestamp(),
      });

      setSubmittedStudentId(studentId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err?.message ?? "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedStudentId) {
    return <SuccessScreen studentId={submittedStudentId} />;
  }

  return (
    <div className="container py-8 sm:py-12 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">UniFAST — Tertiary Education Subsidy</h1>
        <p className="text-base sm:text-lg text-muted-foreground">Pre-Application Form</p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* STUDENT INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Complete legal name as registered with the school.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Field label="Student ID #" required>
              <Input required value={form.studentId} onChange={(e) => set("studentId", e.target.value)} />
            </Field>
            <Field label="Sex" required>
              <Select value={form.sex} onValueChange={(v) => set("sex", v)}>
                <SelectTrigger><SelectValue placeholder="Select sex" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Last Name" required>
              <Input required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
            </Field>
            <Field label="Given Name" required>
              <Input required value={form.givenName} onChange={(e) => set("givenName", e.target.value)} />
            </Field>
            <Field label="Middle Name">
              <Input value={form.middleName} onChange={(e) => set("middleName", e.target.value)} />
            </Field>
            <Field label="Extension Name (Jr., Sr., III)">
              <Input value={form.extensionName} onChange={(e) => set("extensionName", e.target.value)} />
            </Field>
            <Field label="Birthdate" required>
              <Input required type="date" value={form.birthdate} onChange={(e) => set("birthdate", e.target.value)} />
            </Field>
            <Field label="Units Enrolled" required>
              <Input required type="number" min="0" step="0.5"
                value={form.unitsEnrolled} onChange={(e) => set("unitsEnrolled", e.target.value)} />
            </Field>
            <Field label="Total Assessment (PHP)" required>
              <Input required type="number" min="0" step="0.01"
                value={form.totalAssessment} onChange={(e) => set("totalAssessment", e.target.value)} />
            </Field>
            <Field label="Year Level" required>
              <Select value={form.yearLevel} onValueChange={(v) => set("yearLevel", v)}>
                <SelectTrigger><SelectValue placeholder="Select year level" /></SelectTrigger>
                <SelectContent>
                  {["1st Year","2nd Year","3rd Year","4th Year"].map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Course (Complete Program Name / Course / Major)" required>
                <Input required value={form.course} onChange={(e) => set("course", e.target.value)}
                  placeholder="e.g. Bachelor of Science in Information Technology" />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* PERMANENT ADDRESS */}
        <Card>
          <CardHeader>
            <CardTitle>Permanent Address & Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Field label="Street & Barangay" required>
                <Input required value={form.streetBarangay} onChange={(e) => set("streetBarangay", e.target.value)} />
              </Field>
            </div>
            <Field label="Town / City / Municipality" required>
              <Input required value={form.townCity} onChange={(e) => set("townCity", e.target.value)} />
            </Field>
            <Field label="Province" required>
              <Input required value={form.province} onChange={(e) => set("province", e.target.value)} />
            </Field>
            <Field label="ZIP Code">
              <Input value={form.zipCode} onChange={(e) => set("zipCode", e.target.value)} />
            </Field>
            <Field label="Mobile Number" required>
              <Input
                required type="tel" inputMode="numeric" pattern="\d{11}" maxLength={11}
                placeholder="11-digit number" title="Enter exactly 11 digits"
                value={form.mobileNumber}
                onChange={(e) => set("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 11))}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Email Address" required>
                <Input required type="email" value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com" />
              </Field>
            </div>
            <Field label="Person With Disability (PWD)" required>
              <Select value={form.pwd} onValueChange={(v) => set("pwd", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Indigenous People (IP) Group">
              <Input placeholder="Leave blank if not applicable"
                value={form.ipGroup} onChange={(e) => set("ipGroup", e.target.value)} />
            </Field>
            {form.pwd === "Yes" && (
              <p className="md:col-span-2 text-xs text-muted-foreground -mt-2">
                Note: please attach a photocopy of your PWD ID or Certification when you visit the SGO office.
              </p>
            )}
          </CardContent>
        </Card>

        {/* FAMILY BACKGROUND */}
        <Card>
          <CardHeader>
            <CardTitle>Family Background</CardTitle>
            <CardDescription>Provide parents&apos; full names. Use mother&apos;s maiden name.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Father</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Last Name"><Input value={form.fatherLastName} onChange={(e) => set("fatherLastName", e.target.value)} /></Field>
                <Field label="Given Name"><Input value={form.fatherGivenName} onChange={(e) => set("fatherGivenName", e.target.value)} /></Field>
                <Field label="Middle Name"><Input value={form.fatherMiddleName} onChange={(e) => set("fatherMiddleName", e.target.value)} /></Field>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Mother (Maiden Name)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Last Name"><Input value={form.motherLastName} onChange={(e) => set("motherLastName", e.target.value)} /></Field>
                <Field label="Given Name"><Input value={form.motherGivenName} onChange={(e) => set("motherGivenName", e.target.value)} /></Field>
                <Field label="Middle Name"><Input value={form.motherMiddleName} onChange={(e) => set("motherMiddleName", e.target.value)} /></Field>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Reminder:</strong> Please present your current Enrollment Registration Certificate (ERC) at the SGO office to complete your application.
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Pre-Application"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      {children}
    </div>
  );
}

function SuccessScreen({ studentId }: { studentId: string }) {
  return (
    <div className="container py-12 sm:py-16 max-w-2xl">
      <Card className="p-6 sm:p-8 border-slate-200 shadow-sm text-center">
        <div className="mx-auto h-20 w-20 rounded-full ring-8 ring-emerald-100 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg mb-5">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Pre-Application Submitted
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-2">You&apos;re all set!</h1>
        <p className="text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">
          Your UniFAST pre-application has been received. The SGO will review and forward it to CHED.
          Please present your current Enrollment Registration Certificate (ERC) at the SGO office to
          complete your application.
        </p>

        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-left">
          <div className="flex items-start gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-blue-900">Want to track your status?</p>
              <p className="text-sm text-blue-800">
                Download the SGO Scholar mobile app and sign up using the <strong>same Student ID</strong>.
                Your application will automatically link to your account.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-blue-200 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Your Student ID</p>
            <p className="text-sm font-mono font-semibold text-slate-900">{studentId}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
