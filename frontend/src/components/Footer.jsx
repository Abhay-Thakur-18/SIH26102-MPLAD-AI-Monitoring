import { Shield, GitBranch, Mail, ArrowUpRight, MapPin, AlertTriangle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Projects', path: '/projects' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Fraud Alerts', path: '/alerts' },
  ];

  return (
    <footer className="relative w-full z-20 mt-20">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      <div className="bg-gradient-to-b from-white/80 to-white/95 backdrop-blur-3xl border-t border-white shadow-[0_-20px_50px_rgba(37,99,235,0.06)] pt-14 pb-6 px-6 md:px-12">

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">

          {/* COLUMN 1 — BRANDING */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] group-hover:scale-105 transition-transform duration-300">
                <Shield size={26} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                  MPLAD<span className="text-blue-600">-AI</span>
                </span>
                <span className="text-[10px] text-cyan-600 font-bold tracking-[0.3em] uppercase leading-none mt-1.5">
                  Intelligent Fund Monitor
                </span>
              </div>
            </Link>

            <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">
              AI-powered real-time monitoring platform for MPLAD fund utilization. Detecting fraud, preventing leakage, and ensuring transparency in public fund management.
            </p>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                <Activity size={13} className="text-blue-600" />
                <span className="text-xs font-bold text-blue-700">SIH 2026 Project</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <MapPin size={13} className="text-cyan-600" />
                <span className="text-xs font-bold text-slate-600">India</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2 — QUICK LINKS */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">
              Quick Access
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-500 font-semibold text-sm hover:text-blue-600 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-cyan-500 text-xs">▹</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3 — STATUS & CONTACT */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">
              System Status
            </h4>

            {/* System Status Cards */}
            <div className="space-y-2">
              {[
                { label: 'AI Engine', status: 'Operational', color: 'green' },
                { label: 'Fraud Detection', status: 'Active', color: 'green' },
                { label: 'Data Pipeline', status: 'Running', color: 'green' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
                  <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-green-600">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/alerts"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-5 py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-between group shadow-lg shadow-blue-500/20"
            >
              View Active Alerts
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="max-w-7xl mx-auto border-t border-slate-200/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-slate-400 tracking-wide">
            © {currentYear} MPLAD-AI Monitor · Smart India Hackathon 2026 · All rights reserved
          </p>

          <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/80 px-4 py-2 rounded-lg">
            <AlertTriangle size={12} className="text-yellow-400" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-widest">
                Monitoring Active
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;