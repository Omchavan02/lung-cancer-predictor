import React, { useEffect, useState } from 'react';

export default function RiskGauge({ percentage, isPositive, prediction }) {
  const [value, setValue] = useState(0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(percentage);
      return undefined;
    }
    setValue(0);
    const frame = requestAnimationFrame(() => setValue(percentage));
    return () => cancelAnimationFrame(frame);
  }, [percentage]);

  const outputText = prediction || (isPositive ? 'YES' : 'NO');
  const color = isPositive ? '#F43F5E' : '#10B981'; // Rose-500 or Emerald-500
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      <svg
        className="h-64 w-64 -rotate-90 drop-shadow-xl"
        viewBox="0 0 200 200"
        role="img"
        aria-label={`Model classification output ${outputText}, positive probability ${percentage.toFixed(2)} percent`}
      >
        {/* Background track circle */}
        <circle cx="100" cy="100" r={radius} stroke="#1E293B" strokeWidth="12" fill="transparent" />
        {/* Dashed inner guide circle */}
        <circle cx="100" cy="100" r={radius} stroke="#334155" strokeWidth="1" strokeDasharray="3 7" fill="transparent" />
        {/* Dynamic probability progress arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-[stroke-dashoffset] duration-[900ms] ease-out"
        />
      </svg>

      {/* Center Output Display Area */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
        {/* Secondary Metadata Label */}
        <span className="text-[10px] font-mono font-extrabold tracking-widest text-pearl-400 uppercase">
          MODEL OUTPUT
        </span>

        {/* PRIMARY VISUAL FOCUS: Dynamic YES / NO Classification */}
        <div className="my-0.5">
          <span
            className={`text-5xl sm:text-6xl font-black font-mono tracking-wider transition-all duration-300 ${
              isPositive
                ? 'text-rose-400 drop-shadow-[0_0_18px_rgba(244,63,94,0.7)]'
                : 'text-emerald-400 drop-shadow-[0_0_18px_rgba(16,185,129,0.7)]'
            }`}
          >
            {outputText}
          </span>
        </div>

        {/* Preserved Probability & Threshold Info */}
        <div className="space-y-0.5 border-t border-white/15 pt-1.5 mt-1 w-28">
          <div className="text-caption font-mono font-extrabold text-white tracking-tight">
            P(YES): {value.toFixed(1)}%
          </div>
          <div className="text-[9px] font-mono font-bold text-pearl-400 tracking-wider">
            THRESHOLD θ = 50%
          </div>
        </div>
      </div>
    </div>
  );
}
