import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, IndianRupee, CheckCircle, AlertTriangle, Clock, Eye } from 'lucide-react';

const allProjects = [
  { id: 'MP-4412', name: 'Rural Road Construction',     district: 'Bareilly',  mp: 'Santosh Gangwar', funds: 1.2, progress: 68,  status: 'On Track',  riskScore: 12 },
  { id: 'MP-4398', name: 'Primary School Renovation',   district: 'Mathura',   mp: 'Hema Malini',     funds: 0.8, progress: 42,  status: 'Delayed',   riskScore: 64 },
  { id: 'MP-4375', name: 'Village Drainage System',     district: 'Moradabad', mp: 'S. T. Hasan',     funds: 2.1, progress: 91,  status: 'Completed', riskScore: 5  },
  { id: 'MP-4360', name: 'Water Supply Pipeline',       district: 'Aligarh',   mp: 'Satish Gautam',   funds: 1.6, progress: 25,  status: 'At Risk',   riskScore: 81 },
  { id: 'MP-4340', name: 'Community Health Centre',     district: 'Agra',      mp: 'S. P. Singh',     funds: 3.4, progress: 55,  status: 'On Track',  riskScore: 23 },
  { id: 'MP-4321', name: 'Solar Street Lighting',       district: 'Jhansi',    mp: 'Anurag Sharma',   funds: 0.5, progress: 80,  status: 'On Track',  riskScore: 9  },
  { id: 'MP-4305', name: 'Pond Renovation Project',     district: 'Varanasi',  mp: 'Ramesh Jaiswal',  funds: 0.9, progress: 10,  status: 'At Risk',   riskScore: 77 },
  { id: 'MP-4280', name: 'Anganwadi Centre',            district: 'Lucknow',   mp: 'Rajnath Singh',   funds: 0.6, progress: 100, status: 'Completed', riskScore: 3  },
];

const statusConfig = {
  'On Track':  { color: 'bg-green-100 text-green-700 border-green-200',  icon: CheckCircle },
  'Delayed':   { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Clock },
  'Completed': { color: 'bg-blue-100 text-blue-700 border-blue-200',    icon: CheckCircle },
  'At Risk':   { color: 'bg-red-100 text-red-700 border-red-200',       icon: AlertTriangle },
};

const riskGauge = (score) =>
  score >= 70 ? 'bg-red-500' :
  score >= 40 ? 'bg-orange-400' :
  score >= 20 ? 'bg-yellow-400' : 'bg-green-500';

const Projects = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const statuses = ['All', 'On Track', 'Delayed', 'At Risk', 'Completed'];

  const filtered = allProjects.filter(p =>
    (filterStatus === 'All' || p.status === filterStatus) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.district.toLowerCase().includes(search.toLowerCase()) ||
     p.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-28 pb-10 px-4 md:px-10 max-w-7xl mx-auto space-y-7">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">MPLAD Projects</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor all MPLAD projects — progress, risk scores, and fund utilization</p>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
      >
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project name, district, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-400 shrink-0" />
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === s
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((p, i) => {
          const sc = statusConfig[p.status] ?? { color: '', icon: CheckCircle };
          const Icon = sc.icon;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="glass-card rounded-2xl p-5 space-y-4 group cursor-pointer"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-600">{p.id}</span>
                  <h3 className="font-bold text-slate-800 text-sm mt-0.5 leading-snug">{p.name}</h3>
                </div>
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border shrink-0 ${sc.color}`}>
                  <Icon size={10} strokeWidth={2.5} />
                  {p.status}
                </span>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1"><MapPin size={11} />{p.district}</span>
                <span className="flex items-center gap-1"><IndianRupee size={11} />{p.funds}Cr</span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span>Progress</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                  />
                </div>
              </div>

              {/* Risk Score */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${riskGauge(p.riskScore)}`} />
                  <span className="text-xs text-slate-500 font-medium">Risk Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${riskGauge(p.riskScore)} rounded-full`} style={{ width: `${p.riskScore}%` }} />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700">{p.riskScore}/100</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card rounded-2xl p-14 text-center text-slate-400 font-semibold text-sm">
          No projects match your search/filter.
        </div>
      )}
    </div>
  );
};

export default Projects;
