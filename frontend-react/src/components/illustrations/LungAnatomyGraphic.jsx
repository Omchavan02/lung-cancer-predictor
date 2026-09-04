import React from 'react';

export default function LungAnatomyGraphic({ className = "w-full h-auto" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient Glow Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 via-cyan-500/15 to-emerald-500/10 rounded-3xl blur-2xl -z-10" />

      <svg
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[480px] drop-shadow-xl select-none"
      >
        <defs>
          <linearGradient id="tracheaGrad" x1="250" y1="20" x2="250" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient id="leftLungGrad" x1="100" y1="120" x2="230" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="rightLungGrad" x1="400" y1="120" x2="270" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.85" />
          </linearGradient>

          <filter id="lungGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#8B5CF6" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Trachea & Upper Airway */}
        <path
          d="M242 30 C242 80, 240 100, 230 135 M258 30 C258 80, 260 100, 270 135"
          stroke="url(#tracheaGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Trachea Cartilage Rings */}
        <line x1="241" y1="45" x2="259" y2="45" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        <line x1="240" y1="65" x2="260" y2="65" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        <line x1="240" y1="85" x2="260" y2="85" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
        <line x1="239" y1="105" x2="261" y2="105" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />

        {/* Main Bronchi Bifurcation */}
        <path
          d="M230 135 C210 160, 180 180, 150 200 M270 135 C290 160, 320 180, 350 200"
          stroke="url(#tracheaGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Left Lung Lobe Silhouette (Anatomical Right) */}
        <path
          d="M220 145 C200 120, 140 110, 110 150 C80 190, 70 280, 95 330 C115 370, 180 375, 215 335 C235 310, 235 200, 220 145 Z"
          fill="url(#leftLungGrad)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          filter="url(#lungGlow)"
        />

        {/* Right Lung Lobe Silhouette (Anatomical Left) */}
        <path
          d="M280 145 C300 120, 360 110, 390 150 C420 190, 430 280, 405 330 C385 370, 320 375, 285 335 C265 310, 265 200, 280 145 Z"
          fill="url(#rightLungGrad)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          filter="url(#lungGlow)"
        />

        {/* Bronchial Tree Arborization Lines (Left) */}
        <path d="M150 200 C130 230, 110 270, 120 310" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" strokeLinecap="round" />
        <path d="M130 230 C150 250, 165 280, 175 310" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />
        <path d="M110 270 C95 285, 95 305, 105 320" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />

        {/* Bronchial Tree Arborization Lines (Right) */}
        <path d="M350 200 C370 230, 390 270, 380 310" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" strokeLinecap="round" />
        <path d="M370 230 C350 250, 335 280, 325 310" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />
        <path d="M390 270 C405 285, 405 305, 395 320" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />

        {/* Glowing Neural Alveoli Nodes */}
        <circle cx="120" cy="310" r="4.5" fill="#38BDF8" className="animate-pulse" />
        <circle cx="175" cy="310" r="4.5" fill="#818CF8" className="animate-pulse" />
        <circle cx="105" cy="320" r="3.5" fill="#A78BFA" className="animate-pulse" />
        <circle cx="380" cy="310" r="4.5" fill="#34D399" className="animate-pulse" />
        <circle cx="325" cy="310" r="4.5" fill="#38BDF8" className="animate-pulse" />
        <circle cx="395" cy="320" r="3.5" fill="#10B981" className="animate-pulse" />

        {/* Center AI Synapse Pulse */}
        <circle cx="250" cy="135" r="7" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="250" cy="135" r="14" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" />
      </svg>
    </div>
  );
}
