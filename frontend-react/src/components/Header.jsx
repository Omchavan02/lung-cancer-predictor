import React from 'react';
import { Sparkles, Database, Info, Activity, Shield } from 'lucide-react';

export default function Header({ systemHealth, onOpenModelInfo, onOpenAbout }) {
  const isOnline = systemHealth?.status === 'healthy';

  return (
    <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-lg sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Area */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25 ring-2 ring-violet-400/30 animate-subtle-float">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-violet-950 to-indigo-900 bg-clip-text text-transparent">
                Lung Cancer Predictor
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-100 text-violet-700 border border-violet-200 shadow-2xs">
                v1.0.0 (Frozen)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              AI Predictive Analytics & Machine Learning Risk Workspace
            </p>
          </div>
        </div>

        {/* System Indicator & Navigation Actions */}
        <div className="flex items-center space-x-3">
          {/* Live System Status */}
          <div className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-2xs transition-all ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
              : 'bg-amber-50 text-amber-700 border-amber-200/80'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span>{isOnline ? 'Model Online' : 'Connecting API...'}</span>
          </div>

          {/* Model Architecture Inspector Button */}
          <button
            onClick={onOpenModelInfo}
            className="px-3.5 py-2 text-slate-600 hover:text-violet-700 hover:bg-violet-50/80 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all border border-slate-200 hover:border-violet-300 shadow-2xs cursor-pointer active:scale-97"
            title="Inspect Frozen Model Architecture and Metrics"
          >
            <Database className="w-4 h-4 text-violet-600" />
            <span className="hidden md:inline">Model Info</span>
          </button>

          {/* About / Reference Button */}
          <button
            onClick={onOpenAbout}
            className="px-3.5 py-2 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50/80 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all border border-slate-200 hover:border-cyan-300 shadow-2xs cursor-pointer active:scale-97"
            title="About Academic Research & Architecture"
          >
            <Info className="w-4 h-4 text-cyan-600" />
            <span className="hidden md:inline">About</span>
          </button>
        </div>
      </div>
    </header>
  );
}
