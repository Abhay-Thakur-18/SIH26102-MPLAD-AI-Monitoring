import { motion } from 'framer-motion';
import { Shield, AlertTriangle, TrendingUp, CheckCircle, Clock, IndianRupee, BarChart3, MapPin, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const kpis = [
  { label: 'Total Projects',        value: '1,240',    sub: '+12 this week',   icon: BarChart3,     color: 'from-blue-600 to-blue-700',     glow: 'rgba(37,99,235,0.3)' },
  { label: 'Active Alerts',         value: '87',       sub: '23 High Risk',    icon: AlertTriangle, color: 'from-red-500 to-orange-500',    glow: 'rgba(239,68,68,0.3)' },
  { label: 'Funds Monitored',       value: '₹ 2,840Cr',sub: 'FY 2025-26',     icon: IndianRupee,   color: 'from-green-500 to-emerald-600', glow: 'rgba(34,197,94,0.3)' },
  { label: 'Accuracy Score',        value: '94.3%',    sub: 'AI Model v2.1',   icon: Brain,         color: 'from-violet-600 to-purple-700', glow: 'rgba(139,92,246,0.3)' },
];

const recentAlerts = [
  { id: 'MP-2847', type: 'Cost Inflation',    district: 'Lucknow',  risk: 'HIGH',   time: '2m ago',  status: 'open' },
  { id: 'MP-1203', type: 'Unusual Fund Draw', district: 'Agra',     risk: 'HIGH',   time: '15m ago', status: 'open' },
  { id: 'MP-0934', type: 'Duplicate Entry',   district: 'Kanpur',   risk: 'MED',    time: '1h ago',  status: 'review' },
  { id: 'MP-3312', type: 'Delay Predicted',   district: 'Varanasi', risk: 'MED',    time: '3h ago',  status: 'review' },
  { id: 'MP-2201', type: 'Geo-tag Mismatch',  district: 'Meerut',   risk: 'LOW',    time: '5h ago',  status: 'closed' },
];

const recentProjects = [
  { id: 'MP-4412', name: 'Rural Road Construction', district: 'Bareilly',  funds: '₹1.2Cr',  progress: 68, status: 'On Track' },
  { id: 'MP-4398', name: 'School Renovation',       district: 'Mathura',   funds: '₹0.8Cr',  progress: 42, status: 'Delayed' },
  { id: 'MP-4375', name: 'Drainage System',         district: 'Moradabad', funds: '₹2.1Cr',  progress: 91, status: 'Completed' },
  { id: 'MP-4360', name: 'Water Supply Pipeline',   district: 'Aligarh',   funds: '₹1.6Cr',  progress: 25, status: 'At Risk' },
];

const riskColor = (r) => ({
  HIGH:   'bg-red-100 text-red-700 border-red-200',
  MED:    'bg-orange-100 text-orange-700 border-orange-200',
  LOW:    'bg-green-100 text-green-700 border-green-200',
})[r] ?? '';

const statusColor = (s) => ({
  'On Track':  'text-green-600',
  'Delayed':   'text-orange-500',
  'Completed': 'text-blue-600',
  'At Risk':   'text-red-500',
})[s] ?? 'text-slate-500';

const progressColor = (p) =>
  p >= 80 ? 'from-green-500 to-emerald-400' :
  p >= 50 ? 'from-blue-500 to-cyan-400' :
  p >= 30 ? 'from-orange-400 to-amber-400' :
  'from-red-500 to-red-400';

const Dashboard = () => (
  <div className="pt-28 pb-10 px-4 md:px-10 max-w-7xl mx-auto space-y-8">

    {/* Page Header */}
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Monitoring Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Real-time overview of MPLAD fund utilization & AI alerts</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl text-xs font-bold text-green-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          AI Engine Live
        </div>
        <span className="text-xs text-slate-400 font-medium">Updated just now</span>
      </div>
    </motion.div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpis.map(({ label, value, sub, icon: Icon, color, glow }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-4`}
            style={{ boxShadow: `0 8px 24px ${glow}` }}>
            <Icon size={20} className="text-white" strokeWidth={2} />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{value}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-0.5">{label}</div>
          <div className="text-[11px] text-slate-400 mt-1">{sub}</div>
          <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`} />
        </motion.div>
      ))}
    </div>

    {/* Main Content Grid */}
    <div className="grid lg:grid-cols-3 gap-6">

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="lg:col-span-2 glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-extrabold text-slate-800">Recent Fraud Alerts</h2>
          <Link to="/alerts" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-3">
          {recentAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/60 border border-slate-100 hover:border-blue-100 hover:bg-white/80 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={15} className={alert.risk === 'HIGH' ? 'text-red-500' : alert.risk === 'MED' ? 'text-orange-400' : 'text-green-500'} />
                <div>
                  <span className="font-bold text-sm text-slate-800">{alert.id}</span>
                  <span className="text-slate-500 text-xs ml-2">{alert.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-400 text-xs">{alert.district}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${riskColor(alert.risk)}`}>{alert.risk}</span>
                <span className="text-[10px] text-slate-400">{alert.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass-card rounded-2xl p-6 space-y-5"
      >
        <h2 className="font-extrabold text-slate-800">Fund Utilization</h2>

        {[
          { label: 'Disbursed',  pct: 72, color: 'from-blue-600 to-cyan-400' },
          { label: 'Verified',   pct: 58, color: 'from-green-500 to-emerald-400' },
          { label: 'Under Review', pct: 24, color: 'from-orange-400 to-amber-400' },
          { label: 'Flagged',    pct: 8,  color: 'from-red-500 to-red-400' },
        ].map(({ label, pct, color }) => (
          <div key={label}>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>{label}</span>
              <span className="font-bold text-slate-700">{pct}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${color} rounded-full`}
                initial={{ width: '0%' }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-slate-100">
          <Link to="/analytics" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl text-xs font-bold hover:-translate-y-0.5 transition-transform shadow-lg shadow-blue-500/20">
            <BarChart3 size={14} />
            Full Analytics
          </Link>
        </div>
      </motion.div>
    </div>

    {/* Recent Projects Table */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-extrabold text-slate-800">Recent Projects</h2>
        <Link to="/projects" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
          All Projects <ArrowRight size={12} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="pb-3 pr-4">Project ID</th>
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">District</th>
              <th className="pb-3 pr-4">Funds</th>
              <th className="pb-3 pr-4">Progress</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recentProjects.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 + i * 0.05 }}
                className="hover:bg-white/50 transition-colors"
              >
                <td className="py-3.5 pr-4 font-mono text-xs text-blue-600 font-bold">{p.id}</td>
                <td className="py-3.5 pr-4 font-semibold text-slate-700">{p.name}</td>
                <td className="py-3.5 pr-4 text-slate-500 text-xs flex items-center gap-1"><MapPin size={11} />{p.district}</td>
                <td className="py-3.5 pr-4 font-bold text-slate-700">{p.funds}</td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${progressColor(p.progress)} rounded-full`} style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{p.progress}%</span>
                  </div>
                </td>
                <td className={`py-3.5 text-xs font-bold ${statusColor(p.status)}`}>{p.status}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>

  </div>
);

export default Dashboard;
