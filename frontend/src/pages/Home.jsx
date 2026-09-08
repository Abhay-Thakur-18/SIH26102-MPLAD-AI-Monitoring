import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Brain, AlertTriangle, MapPin,
  ArrowRight, CheckCircle, Zap, BarChart3, Activity,
  Layers, Network, ScanSearch, TrendingDown, FileText,
  BadgeCheck, Users, Sliders
} from 'lucide-react';

/* ─── Animated Counter ─── */
const Counter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Feature Card ─── */
const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-card rounded-2xl p-6 space-y-4 group"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={22} className="text-white" strokeWidth={2} />
    </div>
    <h3 className="text-base font-bold text-slate-800">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

/* ─── Step Card ─── */
const StepCard = ({ num, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex gap-5"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_16px_rgba(37,99,235,0.4)]">
      {num}
    </div>
    <div className="space-y-1 pt-1">
      <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

const Home = () => {
  const stats = [
    { value: 1240, suffix: '+', label: 'Projects Monitored', icon: BarChart3, color: 'text-blue-600' },
    { value: 87,   suffix: '',  label: 'Frauds Detected',    icon: AlertTriangle, color: 'text-red-500' },
    { value: 94,   suffix: '%', label: 'Detection Accuracy', icon: Brain, color: 'text-cyan-600' },
    { value: 342,  suffix: 'Cr', label: 'Funds Secured (₹)', icon: Shield, color: 'text-green-600' },
  ];

  const features = [
    {
      icon: Layers,
      title: 'AI Digital Twin Monitoring',
      desc: 'Creates a virtual AI model of every MPLADS project and compares expected vs actual progress to predict fraud, delays, and budget deviations before completion.',
      color: 'bg-gradient-to-br from-blue-600 to-blue-700',
      delay: 0.05,
    },
    {
      icon: Network,
      title: 'Contractor Collusion Detection',
      desc: 'Uses Graph AI to identify hidden relationships between contractors, vendors, engineers, and districts, exposing collusion networks instead of isolated fraud cases.',
      color: 'bg-gradient-to-br from-violet-600 to-purple-700',
      delay: 0.1,
    },
    {
      icon: ScanSearch,
      title: 'GeoVision AI Verification',
      desc: 'Verifies whether roads, schools, water tanks, or buildings actually exist using geo-tagged images, GPS metadata, and satellite/computer vision analysis.',
      color: 'bg-gradient-to-br from-cyan-500 to-teal-600',
      delay: 0.15,
    },
    {
      icon: Brain,
      title: 'Semantic Duplicate Detection',
      desc: 'Detects duplicate or renamed projects using NLP embeddings and vector search, even when project names are completely different.',
      color: 'bg-gradient-to-br from-orange-500 to-amber-500',
      delay: 0.2,
    },
    {
      icon: TrendingDown,
      title: 'Budget Leakage Prediction',
      desc: 'Predicts abnormal spending, cost overruns, and fund leakage before the project budget is exhausted using ML-based anomaly detection.',
      color: 'bg-gradient-to-br from-red-500 to-rose-600',
      delay: 0.25,
    },
    {
      icon: FileText,
      title: 'AI Explainable Audit Copilot',
      desc: 'Automatically generates investigation-ready audit reports with fraud reasons, supporting evidence, confidence score, and recommended actions.',
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      delay: 0.3,
    },
    {
      icon: BadgeCheck,
      title: 'Contractor Integrity Passport',
      desc: 'Generates an AI trust score for every contractor based on project history, delays, complaints, payment behavior, and audit records.',
      color: 'bg-gradient-to-br from-indigo-600 to-blue-700',
      delay: 0.35,
    },
    {
      icon: Users,
      title: 'Citizen Trust Verification AI',
      desc: 'Matches citizen-uploaded photos, videos, voice complaints, and GPS location with official project records to validate ground reality.',
      color: 'bg-gradient-to-br from-pink-500 to-rose-500',
      delay: 0.4,
    },
    {
      icon: BarChart3,
      title: 'Predictive Risk Intelligence Dashboard',
      desc: 'Provides real-time fraud heatmaps, district risk scores, delay forecasts, and integrity rankings for proactive governance.',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      delay: 0.45,
    },
    {
      icon: Sliders,
      title: 'AI What-If Budget Simulator',
      desc: 'Simulates future project outcomes by predicting the impact of budget changes, contractor selection, weather, and delays before approval.',
      color: 'bg-gradient-to-br from-slate-600 to-slate-800',
      delay: 0.5,
    },
  ];

  const howItWorks = [
    {
      num: '01',
      title: 'Data Ingestion',
      desc: 'System ingests real-time data from PFMS, e-SAKSHI, and field reports via secure API pipelines.',
    },
    {
      num: '02',
      title: 'AI Anomaly Detection',
      desc: 'ML models analyze transactions, contractor patterns, and geo-tagged images to flag suspicious activity.',
    },
    {
      num: '03',
      title: 'Risk Scoring & Alerts',
      desc: 'Each project receives a real-time risk score. High-risk flags generate instant alerts for officers.',
    },
    {
      num: '04',
      title: 'Automated Reporting',
      desc: 'AI generates audit-ready reports, reducing manual verification by 80% and ensuring accountability.',
    },
  ];

  return (
    <div className="pt-28 pb-0 overflow-hidden">

      {/* ─── HERO ─── */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full text-xs font-bold text-blue-700 uppercase tracking-widest mb-8 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Smart India Hackathon 2026 · SIH26102
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6"
        >
          Intelligent{' '}
          <span className="text-glow-cyan">MPLAD Fund</span>
          <br />
          Guardian
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
        >
          AI-powered real-time monitoring of MPLAD projects — detecting fraud, preventing fund leakage,
          and ensuring complete transparency in public fund utilization.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/dashboard"
            className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide shadow-[0_12px_30px_rgba(37,99,235,0.35)] hover:shadow-[0_16px_40px_rgba(6,182,212,0.45)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
            <Activity size={18} className="relative z-10" />
            <span className="relative z-10">Open Dashboard</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/analytics"
            className="flex items-center gap-2 glass-panel px-8 py-4 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-700 hover:border-blue-200 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Brain size={16} />
            Explore AI Analytics
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          {['e-SAKSHI Integrated', 'PFMS Compatible', 'Real-time AI Engine', 'Geo-tag Verified'].map((b) => (
            <div key={b} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <CheckCircle size={13} className="text-green-500" />
              {b}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map(({ value, suffix, label, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center group"
            >
              <Icon size={22} className={`${color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
              <div className={`text-3xl md:text-4xl font-extrabold ${color} mb-1`}>
                <Counter end={value} suffix={suffix} />
              </div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.3em]">10 AI Innovations · SIH26102</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
            Complete <span className="text-glow-cyan">AI Arsenal</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            10 specialized AI modules working together to detect fraud, verify progress, and ensure every rupee of MPLAD funds reaches the right place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="glass-panel rounded-3xl p-8 md:p-14 grid md:grid-cols-2 gap-12 items-center">

          {/* Left Text */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-[0.3em]">Process</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                How the <span className="text-glow-cyan">AI Engine</span> Works
              </h2>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                From raw government data to actionable fraud intelligence — our AI pipeline works 24/7 to protect public funds.
              </p>
            </div>
            <div className="space-y-7">
              {howItWorks.map((step, i) => (
                <StepCard key={step.num} {...step} delay={i * 0.1} />
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="glass-card rounded-2xl p-6 space-y-4">
              {/* Mock AI Alert Card */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live AI Feed</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  Real-time
                </span>
              </div>

              {[
                { type: 'FRAUD', msg: 'Cost inflation detected — Project #MP-2847', risk: 'HIGH', color: 'text-red-600 bg-red-50 border-red-200' },
                { type: 'DUPLICATE', msg: 'Duplicate submission — District Agra, 2 entries', risk: 'MED', color: 'text-orange-600 bg-orange-50 border-orange-200' },
                { type: 'PROGRESS', msg: 'Geo-tag verified — Road Project Kanpur', risk: 'OK', color: 'text-green-600 bg-green-50 border-green-200' },
                { type: 'ANOMALY', msg: 'Unusual fund draw pattern — MP-1203', risk: 'HIGH', color: 'text-red-600 bg-red-50 border-red-200' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-medium ${item.color}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[10px] opacity-70">[{item.type}]</span>
                    <span>{item.msg}</span>
                  </div>
                  <span className="font-extrabold text-[10px] shrink-0 ml-2">{item.risk}</span>
                </motion.div>
              ))}

              <div className="pt-2">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                    initial={{ width: '0%' }}
                    whileInView={{ width: '78%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] font-semibold text-slate-400">
                  <span>Model Accuracy</span>
                  <span className="text-blue-600">78% scanned</span>
                </div>
              </div>
            </div>

            {/* Glow blob */}
            <div className="absolute -z-10 -top-6 -right-6 w-40 h-40 bg-blue-200/40 rounded-full blur-3xl" />
            <div className="absolute -z-10 -bottom-6 -left-6 w-32 h-32 bg-cyan-200/40 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-10 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl glass-panel border border-blue-100/60 p-10 md:p-14 text-center"
          style={{ boxShadow: '0 8px 40px rgba(37,99,235,0.10), 0 1px 0 rgba(255,255,255,0.8) inset' }}
        >
          {/* Soft blue glow orbs — decorative only */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-cyan-200/25 rounded-full blur-3xl pointer-events-none" />

          {/* Icon */}
          <div className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_8px_24px_rgba(37,99,235,0.35)] mb-6 mx-auto">
            <Zap size={26} className="text-white" />
          </div>

          <h2 className="relative z-10 text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
            Protecting Public Funds{' '}
            <span className="text-glow-cyan">with AI</span>
          </h2>
          <p className="relative z-10 text-slate-500 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Join the mission to eliminate MPLAD fund fraud. Our AI detects anomalies before financial loss occurs,
            ensuring every rupee reaches the intended beneficiaries.
          </p>
          <Link
            to="/dashboard"
            className="relative z-10 group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-[0_8px_24px_rgba(37,99,235,0.30)] hover:shadow-[0_12px_32px_rgba(6,182,212,0.35)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <Activity size={16} />
            Access Monitoring Dashboard
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
