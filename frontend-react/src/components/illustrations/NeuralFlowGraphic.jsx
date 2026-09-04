import React from 'react';

export default function NeuralFlowGraphic({ className = "w-full h-auto" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 600 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[540px] drop-shadow-md select-none"
      >
        <defs>
          <linearGradient id="flowGrad1" x1="50" y1="160" x2="550" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="35%" stopColor="#6366F1" />
            <stop offset="70%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        {/* Connecting Data Neural Flow Lines */}
        <path d="M 80 80 Q 200 60, 300 160 T 520 160" stroke="url(#flowGrad1)" strokeWidth="2.5" strokeOpacity="0.4" fill="none" />
        <path d="M 80 160 Q 200 160, 300 160 T 520 160" stroke="url(#flowGrad1)" strokeWidth="3" strokeOpacity="0.8" fill="none" />
        <path d="M 80 240 Q 200 260, 300 160 T 520 160" stroke="url(#flowGrad1)" strokeWidth="2.5" strokeOpacity="0.4" fill="none" />

        {/* Input Layer Nodes (15 Features) */}
        <g transform="translate(60, 50)">
          <rect width="40" height="220" rx="10" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="1.5" />
          <circle cx="20" cy="30" r="6" fill="#8B5CF6" />
          <circle cx="20" cy="70" r="6" fill="#8B5CF6" />
          <circle cx="20" cy="110" r="6" fill="#8B5CF6" />
          <circle cx="20" cy="150" r="6" fill="#8B5CF6" />
          <circle cx="20" cy="190" r="6" fill="#8B5CF6" />
          <text x="20" y="240" textAnchor="middle" fill="#6D28D9" fontSize="10" fontWeight="bold" fontFamily="sans-serif">15 Inputs</text>
        </g>

        {/* Feature Scaler Node */}
        <g transform="translate(200, 110)">
          <rect width="60" height="100" rx="14" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          <text x="30" y="45" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Standard</text>
          <text x="30" y="62" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Scaler</text>
          <text x="30" y="82" textAnchor="middle" fill="#0284C7" fontSize="9" fontFamily="monospace">μ=0, σ=1</text>
        </g>

        {/* Logistic Logit Scoring Node */}
        <g transform="translate(330, 100)">
          <rect width="80" height="120" rx="16" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
          <text x="40" y="40" textAnchor="middle" fill="#5B21B6" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Log-Odds</text>
          <text x="40" y="60" textAnchor="middle" fill="#7C3AED" fontSize="10" fontFamily="monospace">z = β₀ + βX</text>
          <text x="40" y="80" textAnchor="middle" fill="#6D28D9" fontSize="10" fontFamily="sans-serif">Sigmoid σ(z)</text>
          <circle cx="40" cy="102" r="5" fill="#10B981" className="animate-ping" />
          <circle cx="40" cy="102" r="4" fill="#10B981" />
        </g>

        {/* Output Decision Node */}
        <g transform="translate(480, 110)">
          <rect width="70" height="100" rx="14" fill="#DCFCE7" stroke="#10B981" strokeWidth="2" />
          <text x="35" y="45" textAnchor="middle" fill="#065F46" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Decision</text>
          <text x="35" y="62" textAnchor="middle" fill="#059669" fontSize="12" fontWeight="extrabold" fontFamily="monospace">θ = 0.50</text>
          <text x="35" y="82" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Risk Class</text>
        </g>
      </svg>
    </div>
  );
}
