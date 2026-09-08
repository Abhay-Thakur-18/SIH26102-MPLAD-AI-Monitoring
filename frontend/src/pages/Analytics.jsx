import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, BarChart3, PieChart, Zap, Target } from 'lucide-react';

const insightCards = [
  {
    icon: Brain,
    title: 'Model Performance',
    value: '94.3%',
    sub: 'Detection Accuracy',
    color: 'from-violet-600 to-purple-700',
    glow: 'rgba(139,92,246,0.35)',
    detail: 'Precision: 91.2% · Recall: 96.8% · F1: 93.9%',
  },
  {
    icon: AlertTriangle,
    title: 'Fraud Detected',
    value: '87',
    sub: 'This Month',
    color: 'from-red-500 to-orange-500',
    glow: 'rgba(239,68,68,0.35)',
    detail: '23 High · 41 Medium · 23 Low risk',
  },
  {
    icon: TrendingUp,
    title: 'Cost Overruns',
    value: '₹ 48Cr',
    sub: 'Prevented YTD',
    color: 'from-green-500 to-emerald-600',
    glow: 'rgba(34,197,94,0.35)',
    detail: 'Savings vs estimated loss: 3.4x',
  },
  {
    icon: Zap,
    title: 'Avg Detection Time',
    value: '< 2m',
    sub: 'Per Anomaly',
    color: 'from-blue-600 to-cyan-500',
    glow: 'rgba(37,99,235,0.35)',
    detail: 'vs 14 days manual review average',
  },
];

const fraudTypes = [
  { label: 'Cost Inflation',      pct: 34, color: 'from-red-500 to-red-400' },
  { label: 'Duplicate Entries',   pct: 22, color: 'from-orange-500 to-amber-400' },
  { label: 'Fake Progress Reports', pct: 19, color: 'from-violet-500 to-purple-500' },
  { label: 'Geo-tag Mismatch',    pct: 14, color: 'from-blue-500 to-cyan-400' },
  { label: 'Unusual Fund Draws',  pct: 11, color: 'from-green-500 to-teal-400' },
];

const districtRisk = [
  { district: 'Agra',     score: 81, total: 42 },
  { district: 'Lucknow',  score: 74, total: 68 },
  { district: 'Kanpur',   score: 62, total: 55 },
  { district: 'Varanasi', score: 51, total: 47 },
  { district: 'Mathura',  score: 44, total: 31 },
  { district: 'Meerut',   score: 38, total: 29 },
  { district: 'Bareilly', score: 22, total: 38 },
  { district: 'Aligarh',  score: 18, total: 24 },
];

const riskBar = (score) =>
  score >= 70 ? 'from-red-500 to-red-400' :
  score >= 50 ? 'from-orange-400 to-amber-400' :
  score >= 30 ? 'from-yellow-400 to-yellow-300' : 'from-green-500 to-emerald-400';

const riskLabel = (score) =>
  score >= 70 ? 'HIGH' :
  score >= 50 ? 'MED' :
  score >= 30 ? 'LOW' : 'SAFE';

const riskLabelColor = (score) =>
  score >= 70 ? 'text-red-600 bg-red-50 border-red-200' :
  score >= 50 ? 'text-orange-600 bg-orange-50 border-orange-200' :
  score >= 30 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
  'text-green-600 bg-green-50 border-green-200';

const Analytics = () => (
  <div className="pt-28 pb-10 px-4 md:px-10 max-w-7xl mx-auto space-y-8">

    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">AI Analytics</h1>
      <p className="text-slate-500 text-sm mt-1">Fraud detection insights, model metrics, and district-level risk analysis</p>
    </motion.div>

    {/* Insight Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {insightCards.map(({ icon: Icon, title, value, sub, color, glow, detail }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="glass-card rounded-2xl p-6 space-y-4 group relative overflow-hidden"
        >
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
            style={{ boxShadow: `0 8px 24px ${glow}` }}>
            <Icon size={20} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">{value}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{sub}</div>
            <div className="text-[11px] text-slate-400 mt-1">{title}</div>
          </div>
          <div className="text-[10px] text-slate-400 font-medium border-t border-slate-100 pt-3">{detail}</div>
          <div className={`absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`} />
        </motion.div>
      ))}
    </div>

    {/* Charts Row */}
    <div className="grid lg:grid-cols-2 gap-6">

      {/* Fraud Type Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-card rounded-2xl p-6 space-y-5"
      >
        <div className="flex items-center gap-2">
          <PieChart size={18} className="text-blue-600" />
          <h2 className="font-extrabold text-slate-800">Fraud Type Breakdown</h2>
        </div>

        <div className="space-y-4">
          {fraudTypes.map(({ label, pct, color }, i) => (
            <div key={label}>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                <span>{label}</span>
                <span className="font-bold text-slate-700">{pct}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${color} rounded-full`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* District Risk Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass-card rounded-2xl p-6 space-y-5"
      >
        <div className="flex items-center gap-2">
          <Target size={18} className="text-blue-600" />
          <h2 className="font-extrabold text-slate-800">District Risk Scores</h2>
        </div>

        <div className="space-y-3">
          {districtRisk.map(({ district, score, total }, i) => (
            <motion.div
              key={district}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.06 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs font-bold text-slate-600 w-20 shrink-0">{district}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${riskBar(score)} rounded-full`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.06, ease: 'easeOut' }}
                />
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${riskLabelColor(score)}`}>
                {riskLabel(score)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium w-12 text-right shrink-0">{total} proj</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* AI Model Info */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="glass-panel rounded-2xl p-8 md:p-10"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <Brain size={20} className="text-violet-600" />
            <h2 className="font-extrabold text-slate-800">AI Model Architecture</h2>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Our fraud detection engine uses an ensemble of Isolation Forest for anomaly detection,
            Random Forest for risk classification, and a fine-tuned CNN for geo-tagged image verification.
            The pipeline processes PFMS and e-SAKSHI data streams in real-time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 shrink-0 w-full md:w-auto">
          {[
            { label: 'Model Type',   value: 'Ensemble ML' },
            { label: 'Data Sources', value: 'PFMS + e-SAKSHI' },
            { label: 'Refresh Rate', value: 'Every 5 min' },
            { label: 'Training Data',value: '3.2M records' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/60 border border-slate-100 rounded-xl px-4 py-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
              <div className="text-sm font-extrabold text-slate-700 mt-1">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

export default Analytics;
