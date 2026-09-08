import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, XCircle, Filter, MapPin, ChevronDown, ChevronUp, Shield } from 'lucide-react';

const alertsData = [
  { id: 'ALT-0091', projectId: 'MP-2847', type: 'Cost Inflation',        district: 'Lucknow',  severity: 'HIGH', status: 'Open',    time: '2 min ago',   desc: 'Quoted cost is 2.4x above district average for similar road projects. Contractor: M/s Sharma Constructions.', action: 'Freeze disbursement pending audit.' },
  { id: 'ALT-0090', projectId: 'MP-1203', type: 'Unusual Fund Draw',     district: 'Agra',     severity: 'HIGH', status: 'Open',    time: '15 min ago',  desc: '3 large fund draws in 48 hours, totaling ₹78L — 6x the weekly pattern. No corresponding work reported.', action: 'Flag for immediate field inspection.' },
  { id: 'ALT-0089', projectId: 'MP-0934', type: 'Duplicate Entry',       district: 'Kanpur',   severity: 'MED',  status: 'Review',  time: '1 hr ago',    desc: 'Two project entries with 94% description similarity, same contractor, overlapping geo-coordinates.', action: 'Cross-reference with district ledger.' },
  { id: 'ALT-0088', projectId: 'MP-3312', type: 'Delay Predicted',       district: 'Varanasi', severity: 'MED',  status: 'Review',  time: '3 hr ago',    desc: 'AI model predicts 89% likelihood of >60 day delay based on current contractor velocity and material procurement signals.', action: 'Issue early warning notice.' },
  { id: 'ALT-0087', projectId: 'MP-2201', type: 'Geo-tag Mismatch',      district: 'Meerut',   severity: 'MED',  status: 'Review',  time: '5 hr ago',    desc: 'Submitted geo-tagged photo coordinates differ by 1.8km from project site. Possible location spoofing.', action: 'Require fresh geo-verified submission.' },
  { id: 'ALT-0086', projectId: 'MP-4100', type: 'Fake Progress Report',  district: 'Bareilly', severity: 'HIGH', status: 'Open',    time: '8 hr ago',    desc: 'Image analysis shows same background as March report. EXIF metadata stripped. Reverse image search hit.', action: 'Block progress payment, escalate to DM.' },
  { id: 'ALT-0085', projectId: 'MP-3891', type: 'Contractor Blacklist',  district: 'Mathura',  severity: 'HIGH', status: 'Open',    time: '12 hr ago',   desc: 'Awarded contractor (ABC Infra) matches entity in national blacklist database under alternate name.', action: 'Suspend contract, legal review.' },
  { id: 'ALT-0084', projectId: 'MP-2750', type: 'Substandard Materials', district: 'Jhansi',   severity: 'LOW',  status: 'Closed',  time: '1 day ago',   desc: 'Material quality check (image AI) flagged substandard cement bags — brand mismatch with bill.', action: 'Resolved — third-party test completed.' },
];

const sevConfig = {
  HIGH: { color: 'bg-red-100 text-red-700 border-red-200',    dot: 'bg-red-500',    icon: AlertTriangle },
  MED:  { color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-400', icon: AlertTriangle },
  LOW:  { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400', icon: Shield },
};

const statusConfig = {
  Open:   { color: 'bg-red-50 text-red-600 border-red-200',    icon: AlertTriangle },
  Review: { color: 'bg-orange-50 text-orange-600 border-orange-200', icon: Clock },
  Closed: { color: 'bg-green-50 text-green-600 border-green-200',  icon: CheckCircle },
};

const AlertRow = ({ alert, delay }) => {
  const [expanded, setExpanded] = useState(false);
  const sev = sevConfig[alert.severity] ?? sevConfig.LOW;
  const sts = statusConfig[alert.status] ?? statusConfig.Review;
  const SevIcon = sev.icon;
  const StsIcon = sts.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/30 transition-colors"
      >
        <div className={`w-1.5 h-8 rounded-full shrink-0 ${sev.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="font-mono text-xs font-bold text-blue-600">{alert.id}</span>
            <span className="font-bold text-slate-800 text-sm">{alert.type}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1"><MapPin size={10} />{alert.district}</span>
            <span className="font-mono">{alert.projectId}</span>
            <span>{alert.time}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${sev.color}`}>
            <SevIcon size={10} strokeWidth={2.5} />
            {alert.severity}
          </span>
          <span className={`flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${sts.color}`}>
            <StsIcon size={10} strokeWidth={2.5} />
            {alert.status}
          </span>
          {expanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 border-t border-slate-100/80 space-y-3 bg-white/20">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Detection Summary</span>
                <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">{alert.desc}</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-xl">
                <Shield size={14} className="text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Recommended Action</span>
                  <p className="text-xs font-bold text-blue-800 mt-0.5">{alert.action}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Alerts = () => {
  const [filterSev, setFilterSev] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = alertsData.filter(a =>
    (filterSev === 'All' || a.severity === filterSev) &&
    (filterStatus === 'All' || a.status === filterStatus)
  );

  const counts = {
    HIGH: alertsData.filter(a => a.severity === 'HIGH').length,
    MED:  alertsData.filter(a => a.severity === 'MED').length,
    Open: alertsData.filter(a => a.status === 'Open').length,
  };

  return (
    <div className="pt-28 pb-10 px-4 md:px-10 max-w-7xl mx-auto space-y-7">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Fraud Alerts</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time AI-generated alerts for MPLAD fund anomalies — click any row to expand</p>
        </div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-xs font-bold text-red-700">{counts.Open} Active Alerts</span>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'High Severity',  value: counts.HIGH, color: 'text-red-600',    bg: 'bg-red-50 border-red-200' },
          { label: 'Medium Severity',value: counts.MED,  color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
          { label: 'Open Cases',     value: counts.Open, color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
        ].map(({ label, value, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass-card rounded-xl p-4 text-center border ${bg}`}
          >
            <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-3"
      >
        <Filter size={14} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Severity:</span>
        {['All', 'HIGH', 'MED', 'LOW'].map(s => (
          <button key={s} onClick={() => setFilterSev(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterSev === s ? 'bg-blue-600 text-white shadow-md' : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200'}`}>
            {s}
          </button>
        ))}
        <span className="ml-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
        {['All', 'Open', 'Review', 'Closed'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === s ? 'bg-blue-600 text-white shadow-md' : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200'}`}>
            {s}
          </button>
        ))}
      </motion.div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map((alert, i) => (
          <AlertRow key={alert.id} alert={alert} delay={0.25 + i * 0.05} />
        ))}
        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-14 text-center text-slate-400 font-semibold text-sm">
            No alerts match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
