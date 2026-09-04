import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function PredictorCTA() {
  return (
    <section className="py-20 bg-white border-t border-pearl-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-6">
        <div className="text-caption uppercase text-ink-800">
          Interactive Research Workspace
        </div>

        <h2 className="text-display-lg font-extrabold text-ink-900 tracking-tight max-w-3xl mx-auto">
          Explore the Machine Learning Predictor
        </h2>

        <p className="text-body-xl text-pearl-700 max-w-2xl mx-auto leading-relaxed font-normal">
          Configure patient demographics and clinical indicators below. Observe how our frozen Scikit-Learn pipeline standardizes inputs and generates deterministic risk estimates in real time.
        </p>

        <div className="pt-4 flex justify-center">
          <a
            href="#predictor"
            className="px-8 py-4 rounded-sm bg-ink-900 text-white hover:bg-ink-800 font-semibold text-body-md flex items-center space-x-2.5 shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <span>Configure Patient Profile Below</span>
            <ArrowDown className="w-4 h-4 text-clinical-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
