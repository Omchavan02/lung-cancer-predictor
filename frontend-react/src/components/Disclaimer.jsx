import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Disclaimer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70 backdrop-blur-md py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-3.5 text-xs leading-relaxed text-amber-950 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-amber-800 block text-[11px]">
              Academic & Non-Diagnostic Safety Notice
            </span>
            <p className="text-slate-600 font-normal">
              This system is an academic machine learning capstone demonstration. It is <strong>NOT</strong> a certified medical device, diagnostic instrument, or clinical decision support system. Predictions represent statistical risk correlations derived from survey data patterns and must <strong>never</strong> be used as a substitute for professional clinical diagnosis, patient triage, or treatment planning.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
