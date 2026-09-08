import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  const [progress, setProgress] = useState(0);

  // Neural Network Nodes Coordinates (X, Y)
  const nodes = [
    { id: 1, cx: 100, cy: 30, r: 6 },   // Top
    { id: 2, cx: 30, cy: 90, r: 8 },    // Mid-Left
    { id: 3, cx: 170, cy: 90, r: 8 },   // Mid-Right
    { id: 4, cx: 60, cy: 160, r: 6 },   // Bottom-Left
    { id: 5, cx: 140, cy: 160, r: 6 },  // Bottom-Right
    { id: 6, cx: 100, cy: 100, r: 12 }, // Center (Main Perceptron Node)
  ];

  // Connections between nodes (Synapses)
  const edges = [
    { p1: 6, p2: 1 }, { p1: 6, p2: 2 }, { p1: 6, p2: 3 }, 
    { p1: 6, p2: 4 }, { p1: 6, p2: 5 }, { p1: 1, p2: 2 }, 
    { p1: 1, p2: 3 }, { p1: 2, p2: 4 }, { p1: 3, p2: 5 }, 
    { p1: 4, p2: 5 }
  ];

  // AI Model Loading Progress (0 to 100%)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // Loading speed
      });
    }, 40); 
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-9999 bg-[#F4F8FC] flex flex-col items-center justify-center overflow-hidden"
      // Exit animation: Pura loader upar slide hoke gayab hoga
      exit={{ y: "-100vh", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Glowing Blue Orbs for Depth */}
      <div className="absolute w-120 h-120 bg-blue-200/50 rounded-full blur-[80px] opacity-60"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        
        {/* PHASE 1: NEURAL NETWORK DRAWING (SVG) */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex justify-center items-center mb-8"
        >
          <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
            
            {/* Draw Connecting Lines (Synapses) */}
            {edges.map((edge, index) => {
              const node1 = nodes.find(n => n.id === edge.p1);
              const node2 = nodes.find(n => n.id === edge.p2);
              return (
                <motion.line
                  key={`line-${index}`}
                  x1={node1.cx} y1={node1.cy}
                  x2={node2.cx} y2={node2.cy}
                  stroke="url(#lineGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: index * 0.1, ease: "easeInOut" }}
                />
              );
            })}

            {/* Draw Nodes (Neurons) */}
            {nodes.map((node, index) => (
              <motion.g key={`node-${node.id}`}>
                {/* Outer Glow Pulse */}
                <motion.circle
                  cx={node.cx} cy={node.cy} r={node.r * 2.5}
                  fill={node.id === 6 ? "#06B6D4" : "#2563EB"}
                  opacity="0.2"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                />
                {/* Solid Inner Dot */}
                <motion.circle
                  cx={node.cx} cy={node.cy} r={node.r}
                  fill={node.id === 6 ? "#FFFFFF" : "#2563EB"}
                  stroke={node.id === 6 ? "#06B6D4" : "none"}
                  strokeWidth={node.id === 6 ? "3" : "0"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + (index * 0.1), type: "spring" }}
                />
              </motion.g>
            ))}

            {/* Gradient definition for lines */}
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* PHASE 2: GLASSMORPHISM LOADING CARD */}
        <div className="glass-panel px-8 py-5 rounded-2xl flex flex-col items-center min-w-70">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            MPLAD<span className="text-blue-600">-AI</span> Monitor
          </h2>
          
          <div className="flex items-center justify-between w-full mt-4 gap-4">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest animate-pulse">
              Initializing AI Engine
            </span>
            <span className="text-sm font-mono font-bold text-cyan-600">
              {progress}%
            </span>
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-full h-1.5 bg-slate-200/50 rounded-full mt-2 overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-linear-to-r from-blue-600 to-cyan-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Loader;