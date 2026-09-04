import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, ExternalLink, Cpu, Database, CheckCircle2, Zap } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

export default function Footer({ onOpenModelInfo }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="bg-gradient-to-br from-ink-950 via-slate-900 to-ink-950 text-white border-t border-white/10 pt-20 pb-12 relative overflow-hidden">
      {/* Background Grid Texture */}
      <div className="hero-grid absolute inset-0 opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16 relative z-10">
        {/* 1. TOP FOOTER BRAND MOMENT & CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/5 border border-white/10 space-y-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/10 pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-clinical-500/20 border border-clinical-500/40 text-caption font-mono text-clinical-300 uppercase tracking-widest font-extrabold">
                <Sparkles className="w-4 h-4 text-clinical-300 animate-pulse" />
                <span>LUNGSENSE / PULMONARY RISK INTELLIGENCE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans uppercase leading-tight">
                Intelligence for Better Pulmonary Risk Understanding.
              </h2>
              <p className="text-body-lg text-pearl-300 font-normal leading-relaxed">
                An AI-assisted platform designed to make pulmonary risk assessment more transparent, interpretable, and understandable.
              </p>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => scrollTo('assessment')}
                className="py-4 px-7 rounded-full bg-white text-ink-950 hover:bg-pearl-100 font-extrabold text-body-md flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer uppercase tracking-wider font-sans"
              >
                <span>Start Risk Assessment</span>
                <ArrowRight className="w-4 h-4 text-ink-950" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('ai-engine')}
                className="py-4 px-7 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-body-md border border-white/20 flex items-center justify-center space-x-2 shadow-lg transition-all duration-300 cursor-pointer uppercase tracking-wider font-mono"
              >
                <span>Explore AI Engine →</span>
              </button>
            </div>
          </div>

          {/* Technical Specs Tags */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-caption text-pearl-300">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white font-bold flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-clinical-300" />
              <span>LOGISTIC REGRESSION C=0.1</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white font-bold flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-clinical-300" />
              <span>15 CLINICAL INDICATORS</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>DECISION THRESHOLD θ = 0.50</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>PLATFORM READY</span>
            </span>
          </div>
        </div>

        {/* 2. MAIN FOOTER NAVIGATION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Identity Column (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-clinical-500 via-clinical-600 to-ink-900 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-5 h-5 text-clinical-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
                    LungSense
                  </span>
                  <span className="px-2 py-0.5 rounded-xs bg-white/10 text-[10px] font-mono font-bold uppercase tracking-wider text-clinical-300 border border-white/15">
                    RESEARCH
                  </span>
                </div>
                <span className="text-xs font-mono text-pearl-400 block tracking-wide font-normal">
                  Pulmonary Risk Intelligence Platform
                </span>
              </div>
            </div>

            <p className="text-caption text-pearl-300 leading-relaxed font-normal max-w-md">
              Interpretable machine learning for AI-assisted pulmonary risk assessment. Built with transparent logistic regression parameters and clear clinical boundaries.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 font-mono text-caption text-pearl-400">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">React 18 + Vite</span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">FastAPI REST API</span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">Scikit-Learn 1.5</span>
            </div>
          </div>

          {/* Platform Navigation Group (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-caption font-mono uppercase tracking-widest text-clinical-300 font-extrabold">
              PLATFORM MODULES
            </h4>
            <ul className="space-y-2.5 text-caption font-mono text-pearl-300">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dashboard Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('assessment')}
                  className="hover:text-white transition-colors font-bold text-white cursor-pointer"
                >
                  Risk Assessment Workstation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('lung-insights')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Lung Insights Knowledge Base
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('ai-engine')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Engine & Inference Pipeline
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us & Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Technical Specs & Resources Group (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-caption font-mono uppercase tracking-widest text-clinical-300 font-extrabold">
              RESEARCH & TECHNICAL SPECS
            </h4>
            <ul className="space-y-2.5 text-caption font-mono text-pearl-300">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Project Profile & Mission
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenModelInfo}
                  className="hover:text-white transition-colors cursor-pointer text-left font-bold text-clinical-300"
                >
                  Model Metadata Inspector & Coefficients
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('ai-engine')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Standardized Inference Specifications
                </button>
              </li>
              <li>
                <a
                  href={`${API_BASE_URL}/docs`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 hover:text-white transition-colors text-pearl-200"
                >
                  <span>Interactive Swagger REST API</span>
                  <ExternalLink className="w-3.5 h-3.5 text-clinical-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. SYSTEM STATUS & TECHNICAL METADATA PANEL */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-caption">
          <div className="space-y-1">
            <span className="text-[10px] text-pearl-400 uppercase font-bold block">SYSTEM STATUS</span>
            <span className="font-extrabold text-emerald-400 block flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>PLATFORM READY</span>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-pearl-400 uppercase font-bold block">MODEL CLASSIFIER</span>
            <span className="font-extrabold text-white block">LOGISTIC REGRESSION</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-pearl-400 uppercase font-bold block">DECISION BOUNDARY</span>
            <span className="font-extrabold text-white block">THRESHOLD θ = 0.50</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-pearl-400 uppercase font-bold block">RESEARCH BUILD</span>
            <span className="font-extrabold text-clinical-300 block">LUNGSENSE v1.0</span>
          </div>
        </div>

        {/* 4. RESPONSIBLE AI DISCLAIMER BANNER */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-caption font-mono text-pearl-300 flex items-start space-x-3.5 leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-clinical-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold uppercase tracking-wider text-white block text-[11px]">
              Responsible Use & Clinical Disclaimer
            </span>
            <p className="font-normal text-pearl-300">
              LungSense provides an AI-assisted statistical risk estimate for educational and research purposes. It does not constitute a medical diagnosis, patient triage, or substitute for professional medical evaluation.
            </p>
          </div>
        </div>

        {/* 5. COPYRIGHT & SUB-FOOTER */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-caption font-mono text-pearl-400 gap-4">
          <p>© 2026 LungSense • Pulmonary Risk Intelligence Platform. Academic Capstone Project.</p>

          <div className="flex items-center space-x-3 text-[11px] text-clinical-300 font-bold uppercase tracking-wider">
            <span>AI-ASSISTED</span>
            <span>•</span>
            <span>RESEARCH ORIENTED</span>
            <span>•</span>
            <span>INTERPRETABLE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
