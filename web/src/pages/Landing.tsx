import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight, Sparkles, CheckCircle2, Mail, Phone, MapPin, Clock, Facebook,
  Target, Eye, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  { num: "01", title: "Submit Your Application", desc: "Fill out the UniFAST pre-application form online — no more paper queues." },
  { num: "02", title: "Eligibility Pre-Check", desc: "Our system automatically validates your information against scholarship requirements." },
  { num: "03", title: "SGO Review & Decision", desc: "The Scholars and Grants Office reviews your application and notifies you of the result." },
];

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [location]);

  return (
    <>
      {/* HERO — sized to viewport so the whole hero is visible at once */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white scroll-mt-16 flex items-center min-h-[calc(100vh-4rem)] py-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-3xl" />

        <div className="container relative text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            Now accepting UniFAST applications
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15]">
            Your gateway to{" "}
            <span className="inline-block pb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              educational opportunities
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mt-5 leading-relaxed">
            The Scholars and Grants Office helps deserving students access scholarships,
            grants, and financial assistance — now powered by a modern digital portal.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-7">
            <Button asChild size="lg" className="rounded-full h-12 px-7 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Link to="/apply">
                Apply for a Scholarship <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-7 border-slate-300">
              <a href="#about">Learn About SGO</a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-8 text-sm text-slate-600">
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

      {/* ABOUT */}
      <section id="about" className="container py-24 scroll-mt-16">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm mb-3 uppercase tracking-wider">About SGO</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Supporting scholars, transforming futures
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            [Placeholder — replace with the official SGO description.] The Scholars and Grants
            Office (SGO) administers scholarships, grants, and financial assistance programs.
            We partner with internal and external sponsors to identify deserving scholars,
            monitor academic progress, and provide guidance throughout each scholar&apos;s
            academic journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <ValueCard
            icon={Target}
            title="Mission"
            color="from-blue-500 to-cyan-500"
            text="To provide deserving students access to quality education through well-managed scholarship and grant programs."
          />
          <ValueCard
            icon={Eye}
            title="Vision"
            color="from-purple-500 to-indigo-500"
            text="To be a leading scholarships office recognized for transparency, efficiency, and scholar success."
          />
          <ValueCard
            icon={Heart}
            title="Core Values"
            color="from-rose-500 to-pink-500"
            text="Integrity · Service · Excellence · Stewardship — the principles that guide every decision we make."
          />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-gradient-to-br from-slate-50 to-blue-50/40 border-y scroll-mt-16">
        <div className="container py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-blue-600 font-semibold text-sm mb-3 uppercase tracking-wider">Contact</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Get in touch with SGO</h2>
            <p className="text-slate-600 mt-4 text-lg">
              We&apos;re here to help. Reach out for inquiries, follow-ups, or scholarship guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <Card className="p-8 border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-5">Office Information</h3>
              <div className="space-y-5">
                <ContactItem icon={MapPin} label="Office Address"
                  value="SGO Office, [Building], Main Campus, [Address Placeholder]" />
                <ContactItem icon={Clock} label="Office Hours"
                  value="Monday – Friday, 8:00 AM – 5:00 PM" />
              </div>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-5">Reach Us Online</h3>
              <div className="space-y-5">
                <ContactItem icon={Mail} label="Email" value="sgo@yourschool.edu.ph" />
                <ContactItem icon={Phone} label="Phone" value="(+63) 000-000-0000" />
                <ContactItem icon={Facebook} label="Facebook" value="facebook.com/SGOyourschool" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container py-24">
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

function ValueCard({ icon: Icon, title, text, color }: any) {
  return (
    <Card className="p-7 border-slate-200 hover:shadow-md transition-shadow">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white mb-4 shadow-md`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
    </Card>
  );
}

function ContactItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-sm text-slate-900 font-medium break-words">{value}</p>
      </div>
    </div>
  );
}
