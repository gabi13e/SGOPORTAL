import { Link } from "react-router-dom";
import { GraduationCap, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-300 mt-20">
      <div className="container py-14 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2 font-bold text-white text-lg">
            <GraduationCap className="h-6 w-6 text-blue-400" />
            SGO Portal
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            The Scholars and Grants Office's modern portal for scholarship management,
            eligibility verification, and scholar support.
          </p>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Navigate</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About SGO</Link></li>
            <li><Link to="/apply" className="hover:text-white transition-colors">Apply</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Reach Us</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 text-blue-400" /> sgo@yourschool.edu.ph
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-blue-400" /> SGO Office, Main Campus
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="container py-5 text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} Scholars and Grants Office. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
