import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { IMAGES } from '../../constants/images';

export default function FinalCTA() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-ink-950 text-white">
      {/* Background Visual Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src={IMAGES.lungAwarenessBanner}
          alt="Lung Health Awareness Banner"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/95 to-ink-900/90 z-0 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center space-y-8">
        <div className="text-caption font-mono uppercase text-clinical-400">
          Academic Research & Public Education
        </div>

        <h2 className="text-display-xl font-extrabold tracking-tight leading-tight">
          Turn Awareness Into Action.
        </h2>

        <p className="text-body-xl text-pearl-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Explore comprehensive pulmonary health information and observe how our validated machine learning risk prediction model works.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#predictor"
            className="w-full sm:w-auto px-8 py-4 rounded-sm bg-white text-ink-950 hover:bg-pearl-100 font-bold text-body-md flex items-center justify-center space-x-2.5 shadow-md transition-all cursor-pointer active:scale-98"
          >
            <span>Try the Risk Predictor</span>
            <ArrowRight className="w-4 h-4 text-ink-950" />
          </a>

          <a
            href="#education"
            className="w-full sm:w-auto px-8 py-4 rounded-sm bg-transparent hover:bg-white/10 border border-white/30 text-white font-semibold text-body-md flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98"
          >
            <span>Explore Lung Health</span>
            <ChevronRight className="w-4 h-4 text-pearl-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
