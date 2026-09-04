import React from 'react';
import { ArrowRight, ShieldCheck, Database, Target, Cpu, CheckCircle2, FileText, Layers, Activity } from 'lucide-react';

export default function DashboardHero({ onStartAssessment }) {
  return (
    <div className="space-y-8">
      {/* Workstation Welcome & Command Header */}
      <div className="p-8 sm:p-10 rounded-sm bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 text-white border border-ink-800 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Background Mesh Grid */}
        <div className="hero-grid absolute inset-0 opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xs bg-ink-800 border border-ink-700 text-caption font-mono text-clinical-300 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-clinical-400 animate-pulse" />
            <span>AI Risk Assessment Workstation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            LungSense — Pulmonary Risk Intelligence
          </h1>

          <p className="text-body-xl text-pearl-200 leading-relaxed font-normal">
            Evaluate a patient profile using our transparent, regularized statistical risk classification model trained on 309 empirical survey records.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              onClick={onStartAssessment}
              className="px-8 py-4 rounded-full bg-white text-ink-950 hover:bg-pearl-100 font-extrabold text-body-md flex items-center justify-center space-x-2.5 shadow-xl hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer"
            >
              <span>Start Risk Assessment</span>
              <ArrowRight className="w-5 h-5 text-ink-950" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Dynamic Metric Fact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-sm bg-white border border-pearl-300 space-y-2 shadow-subtle hover:border-pearl-400 transition-all">
          <div className="flex items-center justify-between text-caption font-mono text-pearl-500 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-clinical-600" />
              <span>SCHEMA</span>
            </span>
            <span className="text-ink-900 bg-pearl-100 px-2 py-0.5 rounded-xs border border-pearl-300">FROZEN</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-ink-900 tracking-tight">
            15 Features
          </div>
          <p className="text-caption text-pearl-600 font-normal">
            Demographics, exposures, and respiratory symptoms.
          </p>
        </div>

        <div className="p-5 rounded-sm bg-white border border-pearl-300 space-y-2 shadow-subtle hover:border-pearl-400 transition-all">
          <div className="flex items-center justify-between text-caption font-mono text-pearl-500 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-clinical-600" />
              <span>DATASET</span>
            </span>
            <span className="text-ink-900 bg-pearl-100 px-2 py-0.5 rounded-xs border border-pearl-300">n = 309</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-ink-900 tracking-tight">
            309 Cases
          </div>
          <p className="text-caption text-pearl-600 font-normal">
            Peer-reviewed dataset with validated holdouts.
          </p>
        </div>

        <div className="p-5 rounded-sm bg-white border border-pearl-300 space-y-2 shadow-subtle hover:border-pearl-400 transition-all">
          <div className="flex items-center justify-between text-caption font-mono text-pearl-500 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-clinical-600" />
              <span>THRESHOLD</span>
            </span>
            <span className="text-ink-900 bg-pearl-100 px-2 py-0.5 rounded-xs border border-pearl-300">θ = 0.50</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-ink-900 tracking-tight">
            50.00%
          </div>
          <p className="text-caption text-pearl-600 font-normal">
            Fixed decision boundary for positive risk classification.
          </p>
        </div>

        <div className="p-5 rounded-sm bg-white border border-pearl-300 space-y-2 shadow-subtle hover:border-pearl-400 transition-all">
          <div className="flex items-center justify-between text-caption font-mono text-pearl-500 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>VALIDATION</span>
            </span>
            <span className="text-ink-900 bg-pearl-100 px-2 py-0.5 rounded-xs border border-pearl-300">Holdout</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-ink-900 tracking-tight">
            25× CV
          </div>
          <p className="text-caption text-pearl-600 font-normal">
            91.07% holdout accuracy and 0.9392 PR-AUC.
          </p>
        </div>
      </div>

      {/* Interactive 3-Step Workflow Card */}
      <div className="p-6 rounded-sm bg-white border border-pearl-300 space-y-4 shadow-subtle">
        <span className="text-caption font-mono uppercase text-clinical-700 block font-bold">
          APPLICATION WORKFLOW
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xs bg-pearl-100 border border-pearl-300 space-y-1.5">
            <div className="flex items-center space-x-2 font-mono text-caption font-bold text-ink-900">
              <FileText className="w-4 h-4 text-clinical-600" />
              <span>01 CONFIGURE</span>
            </div>
            <p className="text-caption text-pearl-700 font-normal">
              Enter 15 patient demographics, exposures, and clinical indicators into open grouped cards.
            </p>
          </div>

          <div className="p-4 rounded-xs bg-pearl-100 border border-pearl-300 space-y-1.5">
            <div className="flex items-center space-x-2 font-mono text-caption font-bold text-ink-900">
              <Cpu className="w-4 h-4 text-clinical-600" />
              <span>02 EVALUATE</span>
            </div>
            <p className="text-caption text-pearl-700 font-normal">
              Execute standardized Logistic Regression inference against our FastAPI REST endpoint.
            </p>
          </div>

          <div className="p-4 rounded-xs bg-pearl-100 border border-pearl-300 space-y-1.5">
            <div className="flex items-center space-x-2 font-mono text-caption font-bold text-ink-900">
              <Activity className="w-4 h-4 text-clinical-600" />
              <span>03 INTERPRET</span>
            </div>
            <p className="text-caption text-pearl-700 font-normal">
              Review computed probability score, status tier, RiskGauge, and model-associated factors.
            </p>
          </div>
        </div>
      </div>

      {/* Clinical Safety Disclaimer Banner */}
      <div className="p-4 rounded-sm bg-pearl-100 border border-pearl-300 text-caption text-pearl-700 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-ink-900 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-normal">
          <strong className="text-ink-900 font-semibold uppercase tracking-wider block">Clinical Safety Notice:</strong>
          LungSense is a research/educational decision-support interface. Model output represents statistical probability computed from survey correlations and must <strong>never</strong> be interpreted as a medical diagnosis or clinical treatment recommendation.
        </p>
      </div>
    </div>
  );
}
