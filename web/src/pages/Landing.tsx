import { Link } from "react-router-dom";
import {
  GraduationCap, FileCheck2, ShieldCheck, RefreshCcw, Bell, Bot, BookOpen,
  BarChart3, ArrowRight, Sparkles, Users, Award, Clock, CheckCircle2,
  Mail, Phone, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { icon: GraduationCap, title: "Student Information Management", desc: "Centralized scholar profiles, academic records, and grant history.", color: "from-blue-500 to-cyan-500" },
  { icon: FileCheck2, title: "Centralized Records", desc: "Applications, awards, and renewals in one source of truth.", color: "from-purple-500 to-pink-500" },
  { icon: ShieldCheck, title: "Eligibility Verification", desc: "Automated rule-based checks flag missing requirements instantly.", color: "from-emerald-500 to-teal-500" },
  { icon: RefreshCcw, title: "Renewal Monitoring", desc: "Track renewal cycles with automatic reminders and status updates.", color: "from-orange-500 to-amber-500" },
  { icon: Bell, title: "Smart Notifications", desc: "Email and in-app alerts for deadlines and status changes.", color: "from-rose-500 to-red-500" },
  { icon: Bot, title: "AI Chatbot Assistance", desc: "24/7 student support powered by Gemini for FAQs and guidance.", color: "from-indigo-500 to-violet-500" },
  { icon: BookOpen, title: "Academic Integration", desc: "Sync academic standing for performance and renewal evaluation.", color: "from-fuchsia-500 to-purple-500" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Live dashboards for workflow monitoring and decision-making.", color: "from-sky-500 to-blue-500" },
];

const steps = [
  { num: "01", title: "Submit Your Application", desc: "Fill out the UniFAST pre-application form online — no more paper queues." },
  { num: "02", title: "Eligibility Pre-Check", desc: "Our system automatically validates your information against scholarship requirements." },
  { num: "03", title: "SGO Review & Decision", desc: "The Scholars and Grants Office reviews your application and notifies you of the result." },
];

export default function Landing() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-3xl" />

        <div className="container relative py-20 md:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Now accepting UniFAST applications
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Your gateway to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                educational opportunities
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
              The Scholars and Grants Office helps deserving students access scholarships,
              grants, and financial assistance — now powered by a modern digital portal.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="rounded-full h-12 px-7 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link to="/apply">
                  Apply for a Scholarship <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-7 border-slate-300">
                <Link to="/about">Learn About SGO</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Free to apply</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Online verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Real-time status</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl" />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="text-xs font-mono text-slate-400">sgo-portal.app</div>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4" />
                    <p className="text-xs font-semibold opacity-90">SCHOLARSHIP STATUS</p>
                  </div>
                  <p className="text-2xl font-bold">Approved ✨</p>
                  <p className="text-xs opacity-80 mt-1">UniFAST – Tertiary Education Subsidy</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MiniCard icon={Users} label="Active Scholars" value="—" />
                  <MiniCard icon={Clock} label="Avg Review" value="3 days" />
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500">Next Renewal</span>
                    <span className="font-semibold text-slate-900">July 2026</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y bg-white">
        <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat value="8+" label="Scholarship Programs" />
          <Stat value="100%" label="Online Application" />
          <Stat value="24/7" label="AI Chatbot Support" />
          <Stat value="Real-time" label="Status Updates" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-24">
        <div className="max-w-2xl mb-14">
          <p className="text-blue-600 font-semibold text-sm mb-3 uppercase tracking-wider">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything SGO needs, beautifully unified
          </h2>
          <p className="text-slate-600 mt-4 text-lg">
            Eight integrated modules designed to streamline scholarship administration
            from application through graduation.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <Card key={f.title} className="group p-6 border-slate-200 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/40 border-y">
        <div className="container py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-blue-600 font-semibold text-sm mb-3 uppercase tracking-wider">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Three steps to your scholarship
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm h-full">
                  <div className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    {s.num}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-slate-600">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 h-6 w-6 text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT + CONTACT */}
      <section className="container py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-blue-600 font-semibold text-sm mb-3 uppercase tracking-wider">About SGO</p>
          <h2 className="text-4xl font-bold tracking-tight mb-5">
            Supporting scholars, transforming futures
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            [Placeholder — replace with the official SGO description.] The Scholars and Grants
            Office (SGO) administers scholarships, grants, and financial assistance programs.
            We partner with internal and external sponsors to identify deserving scholars,
            monitor academic progress, and provide guidance throughout each scholar&apos;s
            academic journey.
          </p>
          <Button asChild variant="outline" className="rounded-full mt-2">
            <Link to="/about">Read the full story <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
        <Card className="p-8 border-slate-200 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Get in Touch</h3>
              <p className="text-sm text-slate-600">We're here to help</p>
            </div>
          </div>
          <div className="space-y-4">
            <ContactRow icon={Mail} label="Email" value="sgo@yourschool.edu.ph" />
            <ContactRow icon={Phone} label="Phone" value="(+63) 000-000-0000" />
            <ContactRow icon={MapPin} label="Office" value="SGO Office, Main Campus" />
          </div>
          <Button asChild className="w-full mt-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
            <Link to="/contact">Visit Contact Page</Link>
          </Button>
        </Card>
      </section>

      {/* FINAL CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.3),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(139,92,246,0.3),_transparent_50%)]" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to apply for your scholarship?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Submit your pre-application online today and let the SGO guide you through the rest.
            </p>
            <Button asChild size="lg" className="rounded-full h-12 px-8 bg-white text-slate-900 hover:bg-slate-100">
              <Link to="/apply">
                Start Your Application <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function MiniCard({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <Icon className="h-4 w-4 text-slate-500 mb-1" />
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-bold text-slate-900">{value}</p>
    </div>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {value}
      </div>
      <p className="text-xs md:text-sm text-slate-600 mt-1 font-medium">{label}</p>
    </div>
  );
}
function ContactRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="h-4 w-4 text-slate-400" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}
