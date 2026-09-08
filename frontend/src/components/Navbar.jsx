import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight, Bell, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Projects', path: '/projects' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Alerts', path: '/alerts', badge: 3 },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[999] px-4 md:px-8 transition-all duration-500 ease-in-out ${
        isScrolled ? 'py-3' : 'py-5'
      }`}
    >
      <nav
        className={`max-w-7xl mx-auto rounded-2xl flex justify-between items-center transition-all duration-500 ease-out ${
          isScrolled
            ? 'bg-white/75 backdrop-blur-xl shadow-[0_15px_40px_-10px_rgba(37,99,235,0.2)] border border-white/80 px-5 py-3'
            : 'bg-white/40 backdrop-blur-md shadow-lg shadow-blue-900/5 border border-white/60 px-6 py-4'
        }`}
      >
        {/* BRANDING */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_28px_rgba(6,182,212,0.5)] transition-all duration-300">
            <Shield size={20} className="text-white z-10" strokeWidth={2} />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-slate-800 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
              MPLAD<span className="text-blue-600">-AI</span>
            </span>
            <span className="text-[9px] text-cyan-600 font-bold tracking-[0.25em] uppercase leading-none mt-1 opacity-80">
              Fund Monitor
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center relative gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onMouseEnter={() => setHoveredPath(link.path)}
                onMouseLeave={() => setHoveredPath(null)}
                className="relative px-4 py-2.5 rounded-xl text-sm transition-colors duration-300 group flex items-center gap-1.5"
              >
                <span className={`relative z-10 transition-colors duration-300 ${
                  isActive ? 'text-blue-700 font-bold' : 'text-slate-600 font-medium group-hover:text-blue-700'
                }`}>
                  {link.name}
                </span>
                {link.badge && (
                  <span className="relative z-10 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-blue-50/90 rounded-xl border border-blue-100/60 shadow-inner z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {hoveredPath === link.path && !isActive && (
                  <motion.div
                    layoutId="hover-glow"
                    className="absolute inset-0 bg-white/70 rounded-xl shadow-sm border border-white z-0"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* DESKTOP CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Live Status Dot */}
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Live</span>
          </div>

          <Link
            to="/dashboard"
            className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_10px_28px_rgba(6,182,212,0.4)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
            <Activity size={15} className="relative z-10" />
            <span className="relative z-10">Dashboard</span>
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-50 p-2.5 rounded-xl bg-white/60 hover:bg-white border border-white/80 text-blue-900 shadow-sm transition-all active:scale-95"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-24 left-4 right-4 bg-white/80 backdrop-blur-2xl border border-white/80 rounded-2xl p-4 flex flex-col gap-2 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.25)] overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50/40 text-blue-700 border border-blue-100/60 shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        {link.badge} Alerts
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-200/50 to-transparent my-1" />

              <Link
                to="/dashboard"
                className="group flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30"
              >
                <Activity size={16} />
                Open Dashboard <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;