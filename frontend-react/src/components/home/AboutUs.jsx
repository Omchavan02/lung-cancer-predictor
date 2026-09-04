import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  Info,
  Activity,
  FileText,
  Database,
  Target,
  BookOpen,
} from 'lucide-react';

const PRINCIPLES = [
  {
    num: '01',
    title: 'TRANSPARENCY',
    subtitle: 'Interpretable Statistical Modeling',
    desc: 'We replace opaque black-box deep learning with transparent L2-regularized logistic regression. Every coefficient, odds ratio, and feature contribution is explicitly inspectable.',
    icon: Layers,
    badge: 'INTERPRETABLE ML',
  },
  {
    num: '02',
    title: 'RESPONSIBLE AI',
    subtitle: 'AI-Assisted Risk Signals',
    desc: 'LungSense outputs probabilistic statistical risk signals to support clinical research and patient awareness — explicitly framing outputs as non-diagnostic educational tools.',
    icon: ShieldCheck,
    badge: 'ETHICAL BOUNDARIES',
  },
  {
    num: '03',
    title: 'RESEARCH FIRST',
    subtitle: 'Rigorous Holdout Benchmarks',
    desc: 'Engineered for open experimentation, cross-validation, and holdout test set evaluation (91.07% accuracy, n=56), demonstrating best practices in medical machine learning.',
    icon: BookOpen,
    badge: 'ACADEMIC RIGOR',
  },
];

const THINKING_NODES = [
  { step: '01', title: 'PATIENT', desc: 'Demographics & Symptoms' },
  { step: '02', title: 'CLINICAL INDICATORS', desc: '15 Encoded Features' },
  { step: '03', title: 'FEATURE STANDARDIZATION', desc: 'StandardScaler Z-Score' },
  { step: '04', title: 'STATISTICAL MODEL', desc: 'L2 Regularized Logit (C=0.1)' },
  { step: '05', title: 'PROBABILITY', desc: 'Sigmoidal Bounded Score' },
  { step: '06', title: 'INTERPRETABLE RISK SIGNAL', desc: 'Thresholded (θ = 0.50) Output' },
];

export default function AboutUs({ onOpenModelInfo }) {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="about" className="py-20 bg-white border-t border-pearl-300 scroll-mt-20 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        {/* ABOUT US HERO */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-clinical-500/10 border border-clinical-500/30 text-caption font-mono text-clinical-800 uppercase tracking-widest font-extrabold shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-clinical-500 animate-pulse" />
            <span>ABOUT LUNGSENSE</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-4xl sm:text-6xl font-black text-ink-950 tracking-tight font-sans uppercase leading-[0.98]">
              Making Pulmonary Risk Intelligence
            </h2>
            <h3 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-clinical-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent tracking-tight font-sans uppercase">
              More Transparent & Accessible.
            </h3>
          </div>

          <p className="text-body-xl text-pearl-700 leading-relaxed font-normal max-w-3xl">
            LungSense is an academic research-oriented pulmonary risk intelligence platform. Designed to make machine learning understandable, interpretable, and accessible in pulmonary risk assessment.
          </p>

          {/* Technical Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 font-mono text-caption">
            <div className="px-3.5 py-1.5 rounded-full bg-pearl-100 border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2">
              <Cpu className="w-3.5 h-3.5 text-clinical-600" />
              <span>INTERPRETABLE AI ARCHITECTURE</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-pearl-100 border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-clinical-600" />
              <span>RESPONSIBLE CLINICAL FRAMEWORK</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs font-extrabold flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>ACADEMIC CAPSTONE DEMONSTRATION</span>
            </div>
          </div>
        </div>

        {/* WHY LUNGSENSE — ASYMMETRIC PIPELINE CARD */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-ink-950 via-slate-900 to-ink-950 text-white border border-white/15 shadow-2xl relative overflow-hidden space-y-8">
          <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
            <div>
              <span className="text-caption font-mono uppercase font-black text-clinical-300 tracking-widest block">
                MISSION & RATIONALE
              </span>
              <h3 className="text-3xl font-black text-white tracking-tight font-sans mt-1">
                Why LungSense Exists
              </h3>
            </div>
            <p className="text-caption text-pearl-300 font-mono max-w-md leading-relaxed">
              Bridging the gap between raw medical surveys, quantitative machine learning, and human-interpretable clinical decision support.
            </p>
          </div>

          {/* Asymmetric Pipeline Flow Representation */}
          <div className="space-y-4 relative z-10">
            <span className="text-caption font-mono uppercase text-pearl-400 font-bold block tracking-wider">
              INTELLIGENT RISK TRANSFORMATION PIPELINE
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono text-caption">
              <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-white">
                <span className="text-[10px] text-pearl-400 block uppercase">01 PROFILE</span>
                <span className="font-extrabold block text-body-md mt-1">PATIENT VECTOR</span>
              </div>
              <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-white">
                <span className="text-[10px] text-pearl-400 block uppercase">02 INPUTS</span>
                <span className="font-extrabold block text-body-md mt-1">15 INDICATORS</span>
              </div>
              <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-white">
                <span className="text-[10px] text-pearl-400 block uppercase">03 SCALER</span>
                <span className="font-extrabold block text-body-md mt-1">STANDARDIZED</span>
              </div>
              <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-white">
                <span className="text-[10px] text-pearl-400 block uppercase">04 MODEL</span>
                <span className="font-extrabold block text-body-md mt-1">LOGISTIC LOGIT</span>
              </div>
              <div className="p-4 rounded-xl bg-clinical-500/20 border border-clinical-400/40 text-clinical-300 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-clinical-300 block uppercase">05 OUTPUT</span>
                <span className="font-black block text-body-md mt-1 text-white">RISK SIGNAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* HOW LUNGSENSE THINKS (ARCHITECTURE DIAGRAM) */}
        <div className="p-8 sm:p-10 rounded-3xl bg-pearl-50 border border-pearl-300 space-y-8 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-pearl-300">
            <div>
              <span className="text-caption font-mono uppercase text-clinical-700 block font-black tracking-widest">
                SYSTEM ARCHITECTURE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-ink-950 tracking-tight font-sans">
                How LungSense Thinks
              </h3>
            </div>
            <span className="text-caption font-mono font-bold text-pearl-500 bg-white px-3 py-1 rounded-full border border-pearl-300">
              6 DETERMINISTIC STAGES
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-caption">
            {THINKING_NODES.map((node) => (
              <div
                key={node.step}
                className="p-4 rounded-2xl bg-white border border-pearl-300 shadow-2xs space-y-2 hover:border-clinical-400 transition-colors"
              >
                <span className="w-7 h-7 rounded-lg bg-ink-950 text-white text-[11px] font-black flex items-center justify-center">
                  {node.step}
                </span>
                <span className="font-extrabold text-ink-950 block text-caption tracking-tight leading-tight">
                  {node.title}
                </span>
                <span className="text-[11px] text-pearl-600 block leading-normal">
                  {node.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* THREE CORE PRINCIPLES */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-caption font-mono uppercase text-clinical-700 block font-black tracking-widest">
              CORE PHILOSOPHY
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-ink-950 tracking-tight font-sans uppercase">
              Three Core Principles
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRINCIPLES.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.num}
                  className="p-8 rounded-3xl bg-white border border-pearl-300 space-y-5 shadow-md hover:border-clinical-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-ink-950 text-white font-mono font-black text-body-md flex items-center justify-center shadow-xs">
                        {p.num}
                      </span>
                      <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-md bg-pearl-100 text-pearl-700 border border-pearl-300">
                        {p.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-2xl font-black text-ink-950 tracking-tight font-sans uppercase">
                        {p.title}
                      </h4>
                      <span className="text-caption font-mono text-clinical-700 font-bold block">
                        {p.subtitle}
                      </span>
                    </div>

                    <p className="text-body-md text-pearl-700 font-normal leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-pearl-200 flex items-center space-x-2 text-caption font-mono text-pearl-600 font-bold">
                    <Icon className="w-4 h-4 text-clinical-600" />
                    <span>LUNGSENSE CORE STANDARD</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PROJECT PROFILE TECHNICAL PANEL & RESPONSIBLE USE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left (7 cols): Project Profile */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-pearl-300 space-y-6 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-pearl-300">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-ink-950 text-white shadow-xs">
                  <Database className="w-5 h-5 text-clinical-300" />
                </div>
                <div>
                  <span className="text-caption font-mono uppercase text-clinical-700 block font-black tracking-widest">
                    SYSTEM IDENTITY
                  </span>
                  <h3 className="text-2xl font-black text-ink-950 tracking-tight font-sans">
                    Project Profile & Specifications
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-caption">
              <div className="p-4 rounded-xl bg-pearl-100/80 border border-pearl-300 space-y-1">
                <span className="text-pearl-500 font-bold text-[10px] uppercase">DOMAIN</span>
                <span className="font-extrabold text-ink-950 block text-body-md">Pulmonary Health + ML</span>
              </div>

              <div className="p-4 rounded-xl bg-pearl-100/80 border border-pearl-300 space-y-1">
                <span className="text-pearl-500 font-bold text-[10px] uppercase">APPROACH</span>
                <span className="font-extrabold text-ink-950 block text-body-md">Interpretable Logit</span>
              </div>

              <div className="p-4 rounded-xl bg-pearl-100/80 border border-pearl-300 space-y-1">
                <span className="text-pearl-500 font-bold text-[10px] uppercase">MODEL</span>
                <span className="font-extrabold text-ink-950 block text-body-md">Logistic Regression</span>
              </div>

              <div className="p-4 rounded-xl bg-pearl-100/80 border border-pearl-300 space-y-1">
                <span className="text-pearl-500 font-bold text-[10px] uppercase">INPUT SPACE</span>
                <span className="font-extrabold text-ink-950 block text-body-md">15 Clinical Indicators</span>
              </div>

              <div className="p-4 rounded-xl bg-pearl-100/80 border border-pearl-300 space-y-1">
                <span className="text-pearl-500 font-bold text-[10px] uppercase">OUTPUT</span>
                <span className="font-extrabold text-ink-950 block text-body-md">Binary Risk Class / Prob</span>
              </div>

              <div className="p-4 rounded-xl bg-pearl-100/80 border border-pearl-300 space-y-1">
                <span className="text-pearl-500 font-bold text-[10px] uppercase">PURPOSE</span>
                <span className="font-extrabold text-emerald-700 block text-body-md">Academic & Research</span>
              </div>
            </div>
          </div>

          {/* Right (5 cols): Responsible Use Panel */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-pearl-50 to-pearl-100 border border-pearl-300 space-y-6 shadow-md">
            <div className="flex items-center space-x-3 pb-4 border-b border-pearl-300">
              <div className="p-2.5 rounded-xl bg-emerald-700 text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-caption font-mono uppercase text-emerald-800 block font-black tracking-widest">
                  ETHICAL BOUNDARIES
                </span>
                <h3 className="text-2xl font-black text-ink-950 tracking-tight font-sans">
                  Responsible Use Notice
                </h3>
              </div>
            </div>

            <p className="text-body-md text-pearl-800 leading-relaxed font-normal">
              LungSense provides an AI-assisted statistical risk estimate based on the configured input profile. It is intended for educational and research purposes and does not constitute a medical diagnosis, clinical decision, or substitute for professional medical evaluation.
            </p>

            <div className="p-4 rounded-xl bg-white border border-pearl-300 text-caption font-mono text-pearl-700 flex items-start space-x-3 leading-relaxed">
              <Info className="w-4 h-4 text-pearl-600 shrink-0 mt-0.5" />
              <span>
                Always consult a licensed medical professional for personal health concerns or diagnostic decisions.
              </span>
            </div>
          </div>
        </div>

        {/* FINAL CALL-TO-ACTION */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-ink-950 via-slate-900 to-ink-950 text-white border border-white/15 shadow-2xl space-y-6 text-center relative overflow-hidden max-w-5xl mx-auto">
          <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />

          <div className="space-y-2 relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-clinical-500/20 border border-clinical-500/40 text-caption font-mono text-clinical-300 uppercase tracking-widest font-extrabold">
              <Sparkles className="w-4 h-4 text-clinical-300 animate-pulse" />
              <span>EXPERIENCE LUNGSENSE</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans uppercase">
              Explore Pulmonary Risk Intelligence
            </h3>
            <p className="text-body-xl text-pearl-300 font-normal leading-relaxed">
              Experience transparent AI risk evaluation or inspect our deterministic model architecture.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
            <button
              type="button"
              onClick={() => scrollToSection('assessment')}
              className="w-full sm:w-auto py-4 px-8 rounded-full bg-white text-ink-950 hover:bg-pearl-100 font-extrabold text-body-md flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-98 transition-all cursor-pointer uppercase tracking-wider"
            >
              <span>Start Risk Assessment</span>
              <ArrowRight className="w-4 h-4 text-ink-950" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('ai-engine')}
              className="w-full sm:w-auto py-4 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-body-md border border-white/20 flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer uppercase tracking-wider font-mono"
            >
              <span>Explore AI Engine →</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
