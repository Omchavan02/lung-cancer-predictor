import React, { useEffect, useState } from 'react';
import {
  Activity,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  RotateCcw,
  ArrowDown,
  FileText,
  Zap,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import RiskGauge from './RiskGauge';
import RiskSignals from './workstation/RiskSignals';

export default function PredictionPanel({ result, modelInfo, loading, formData, onReset, onBackToForm }) {
  const [analysisStage, setAnalysisStage] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      setAnalysisStage(0);
      return undefined;
    }
    const timer = setInterval(() => setAnalysisStage((stage) => Math.min(stage + 1, 4)), 300);
    return () => clearInterval(timer);
  }, [loading]);

  // 1. STATE B: VIEWPORT-LEVEL FULL-SCREEN PROCESSING MODAL
  if (loading) {
    const stages = [
      { code: '01 // VALIDATING PATIENT VECTOR', label: 'Compiling 15 survey indicators into feature matrix' },
      { code: '02 // STANDARDIZING FEATURES', label: 'Applying frozen StandardScaler parameters (z = (x - μ) / σ)' },
      { code: '03 // EVALUATING LOGISTIC MODEL', label: 'Scoring β coefficients (C=0.1, L2 regularization)' },
      { code: '04 // COMPUTING PROBABILITY', label: 'Mapping logit score to bounded P(YES) estimate' },
      { code: '05 // CLASSIFYING RISK TIER', label: 'Evaluating posterior score against decision threshold θ = 0.50' },
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink-950/95 backdrop-blur-md text-white overflow-y-auto animate-in fade-in duration-300">
        <div className="max-w-xl w-full mx-auto rounded-3xl bg-gradient-to-br from-ink-950 via-slate-900 to-ink-950 text-white border border-clinical-500/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-6 relative overflow-hidden my-auto">
          {/* Background Grid & Ambient Glow */}
          <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-clinical-500/20 blur-3xl pointer-events-none animate-pulse" />

          {/* Modal Header */}
          <div className="space-y-3 pb-4 border-b border-white/10 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-clinical-500/20 border border-clinical-500/40 text-caption font-mono text-clinical-300 uppercase tracking-widest font-extrabold">
              <span className="w-2.5 h-2.5 rounded-full bg-clinical-400 animate-ping" />
              <span>INFERENCE PIPELINE EXECUTING</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight uppercase">
              Evaluating Patient Vector
            </h3>
            <p className="text-caption text-pearl-300 font-normal leading-relaxed">
              Running 15 normalized clinical parameters through regularized Logistic Regression.
            </p>
          </div>

          {/* Stage Progress Tracker */}
          <div className="space-y-3 relative z-10">
            {stages.map((stage, index) => {
              const isFinished = index < analysisStage;
              const isCurrent = index === analysisStage;
              return (
                <div
                  key={stage.code}
                  className={`p-3.5 rounded-xl border transition-all duration-300 text-caption font-mono ${
                    isFinished
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200 shadow-sm'
                      : isCurrent
                      ? 'border-clinical-400 bg-clinical-950/70 text-white translate-x-1 shadow-lg ring-1 ring-clinical-400/40 font-bold'
                      : 'border-white/10 bg-white/5 text-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-extrabold text-[11px] sm:text-caption">
                    <span className="tracking-wide">{stage.code}</span>
                    <span>{isFinished ? '✓ COMPLETED' : isCurrent ? 'EXECUTING...' : 'PENDING'}</span>
                  </div>
                  <p className="text-[11px] font-sans font-normal text-pearl-300 mt-1 leading-relaxed">
                    {stage.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Modal Footer Note */}
          <div className="pt-4 border-t border-white/10 text-center relative z-10">
            <p className="text-caption text-pearl-400 font-mono">
              Scikit-Learn Logistic Regression (C=0.1) · Real-Time FastAPI Server
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. STATE A: WAITING CONSOLE
  if (!result) {
    const presentCount = Object.entries(formData || {}).filter(
      ([key, value]) => key !== 'AGE' && key !== 'GENDER' && value === 2
    ).length;

    const isAgeValid = typeof formData?.AGE === 'number' && formData.AGE >= 18 && formData.AGE <= 120;
    const isGenderValid =
      formData?.GENDER === 'M' || formData?.GENDER === 'F' || formData?.GENDER === 1 || formData?.GENDER === 0;
    const readyCount = (isGenderValid ? 1 : 0) + (isAgeValid ? 1 : 0) + presentCount;

    return (
      <div className="rounded-3xl bg-gradient-to-br from-ink-950 via-slate-900 to-ink-950 text-white border border-white/15 p-8 flex flex-col justify-between min-h-[580px] shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-clinical-500/10 blur-3xl pointer-events-none" />
        <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />

        {/* Header */}
        <div className="space-y-2 pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-caption font-mono text-emerald-300 uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE MODEL INTELLIGENCE</span>
            </div>
            <span className="text-caption font-mono text-pearl-400 font-bold">● SYSTEM READY</span>
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight font-sans mt-2">
            Inference Console Awaiting Vector
          </h3>
          <p className="text-caption text-pearl-300 font-normal leading-relaxed">
            Configure 15 patient parameters to trigger deterministic statistical evaluation.
          </p>
        </div>

        {/* Center Machine Learning Visualizer */}
        <div className="my-auto space-y-6 text-center py-2 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-white mx-auto shadow-inner backdrop-blur-md">
            <Zap className="w-10 h-10 text-clinical-400 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <span className="text-caption font-mono font-bold uppercase text-clinical-300 block tracking-widest">
              {readyCount} OF 15 VECTOR FEATURES READY
            </span>
            <p className="text-body-lg font-bold text-white">
              Ready for Logistic Evaluation
            </p>
            <p className="text-caption text-pearl-300 leading-relaxed font-normal">
              Select <strong className="text-white font-bold">✦ GENERATE AI RISK PREDICTION</strong> to run inference against our frozen FastAPI REST backend.
            </p>
          </div>

          {/* Connected Pipeline Nodes Visualizer */}
          <div className="pt-6 border-t border-white/10 text-left space-y-3">
            <div className="flex items-center justify-between text-caption font-mono font-bold text-pearl-300 uppercase">
              <span className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-clinical-400" />
                <span>Model Pipeline Transformation</span>
              </span>
              <span className="text-white bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                θ = 0.50
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-[10px] text-center font-mono font-extrabold">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-pearl-200 truncate">
                INPUT (15)
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-pearl-200 truncate">
                SCALER
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-pearl-200 truncate">
                LOGIT β
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-pearl-200 truncate">
                SIGMOID
              </div>
              <div className="p-2 rounded-lg bg-clinical-500/20 border border-clinical-400/40 text-clinical-300 truncate">
                PROFILE
              </div>
            </div>
          </div>
        </div>

        {/* Console Footnote */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-caption font-mono text-pearl-400 relative z-10">
          <span>REGULARIZED LOGIT (C=0.1)</span>
          <span className="text-white font-bold">276 UNIQUE RECORDS</span>
        </div>
      </div>
    );
  }

  // 3. STATE C: ACTIVE PREDICTION RESULT PANEL WITH COMPACT CARD & DETAILS TOGGLE
  const isPositive = result.prediction === 'YES';
  const riskPercentage = result.positive_probability * 100;
  const lowRiskPercentage = result.negative_probability * 100;

  return (
    <div id="prediction-panel" className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Flagship Dark Result Card */}
      <div className="rounded-3xl bg-gradient-to-br from-ink-950 via-slate-900 to-ink-950 text-white border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Background Mesh & Glow */}
        <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
            isPositive ? 'bg-rose-500/15' : 'bg-emerald-500/15'
          }`}
        />

        {/* Result Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div>
            <span className="text-caption font-mono font-bold uppercase text-clinical-300 block tracking-widest">
              STATE C // MODEL INFERENCE OUTPUT
            </span>
            <h3 className="text-2xl font-black text-white mt-0.5 tracking-tight font-sans uppercase">
              Model-Estimated Risk Profile
            </h3>
          </div>

          {/* Dynamic Status Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 rounded-xl text-caption font-mono font-black uppercase border shadow-lg ${
              isPositive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isPositive ? (
              <>
                <ShieldAlert className="w-4 h-4 mr-2 text-rose-400" />
                <span>HIGH RISK PROFILE</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
                <span>LOWER RISK PROFILE</span>
              </>
            )}
          </div>
        </div>

        {/* Dominant Model Probability Readout */}
        <div className="text-center py-3 relative z-10 space-y-1">
          <div className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
            {riskPercentage.toFixed(2)}%
          </div>
          <div className="text-caption font-mono font-bold uppercase tracking-widest text-clinical-300">
            MODEL-ESTIMATED POSTERIOR PROBABILITY P(YES)
          </div>
        </div>

        {/* Flagship Precision Radial Risk Gauge */}
        <div className="relative z-10">
          <RiskGauge percentage={riskPercentage} isPositive={isPositive} prediction={result.prediction} />
        </div>

        {/* Dual Probability Comparison Meter */}
        <div className="space-y-2.5 p-4 rounded-xl bg-white/5 border border-white/10 font-mono relative z-10">
          <div className="flex justify-between text-caption font-bold">
            <span className="text-rose-400 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 mr-2" />
              POSITIVE RISK: {riskPercentage.toFixed(2)}%
            </span>
            <span className="text-emerald-400 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2" />
              CONTROL PROFILE: {lowRiskPercentage.toFixed(2)}%
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden flex p-0.5 border border-white/10">
            <div
              className="h-full bg-rose-500 transition-all duration-700 rounded-full"
              style={{ width: `${riskPercentage}%` }}
            />
            <div
              className="h-full bg-emerald-500 transition-all duration-700 rounded-full"
              style={{ width: `${lowRiskPercentage}%` }}
            />
          </div>
        </div>

        {/* Non-Diagnostic Interpretation Disclosure */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-caption text-pearl-300 leading-relaxed font-normal space-y-1.5 relative z-10">
          <strong className="text-white block font-bold uppercase tracking-wider text-[11px] font-mono">
            Model-Associated Interpretation
          </strong>
          {isPositive ? (
            <p>
              The calculated posterior probability ({riskPercentage.toFixed(2)}%) exceeds the model's 0.50 decision boundary, placing this profile into the positive risk tier. <strong>This is an AI-assisted statistical probability score, not a medical diagnosis.</strong>
            </p>
          ) : (
            <p>
              The calculated posterior probability ({riskPercentage.toFixed(2)}%) falls below the model's 0.50 decision boundary, placing this profile into the control/lower-risk tier. <strong>This is an AI-assisted statistical probability score, not a medical diagnosis.</strong>
            </p>
          )}
        </div>
      </div>

      {/* 2. Prominent View Details Toggle Button */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setIsDetailsOpen((prev) => !prev)}
          className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-pearl-100 text-ink-950 font-mono font-black text-caption border-2 border-pearl-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer uppercase tracking-wider"
        >
          <span>{isDetailsOpen ? 'Hide Detailed Analytical Breakdown ↑' : 'View Details & Risk Signals ↓'}</span>
          {isDetailsOpen ? (
            <ChevronUp className="w-4 h-4 text-clinical-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-clinical-600" />
          )}
        </button>

        {/* Action Controls Toolbar (Always Accessible) */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {onBackToForm && (
            <button
              type="button"
              onClick={onBackToForm}
              className="flex-1 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-ink-950 to-slate-900 text-white hover:from-slate-900 hover:to-ink-950 font-mono font-extrabold text-caption border border-white/20 flex items-center justify-center space-x-2 transition-all cursor-pointer uppercase shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 text-clinical-300" />
              <span>← Back to Assessment (Edit Profile)</span>
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="py-4 px-5 rounded-xl bg-pearl-200 hover:bg-pearl-300 text-ink-950 font-mono font-bold text-caption border border-pearl-300 flex items-center justify-center space-x-2 transition-all cursor-pointer uppercase shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-pearl-600" />
              <span>Start New Assessment</span>
            </button>
          )}

          <a
            href="#ai-engine"
            className="py-4 px-5 rounded-xl bg-white hover:bg-pearl-100 text-clinical-800 font-mono font-bold text-caption border border-pearl-300 flex items-center justify-center space-x-2 transition-all text-center uppercase shadow-2xs"
          >
            <span>Review Model Weights</span>
            <ArrowDown className="w-3.5 h-3.5 text-clinical-600" />
          </a>
        </div>
      </div>

      {/* 3. Collapsible Detailed Analytical Breakdown */}
      {isDetailsOpen && (
        <div className="space-y-6 animate-in fade-in duration-300 pt-2">
          {/* Dynamic Risk Signals Card */}
          <RiskSignals formData={formData} />

          {/* Assessment At a Glance Summary Card */}
          <div className="p-6 rounded-2xl bg-white border border-pearl-300 space-y-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-pearl-300">
              <span className="text-caption font-mono uppercase text-ink-950 font-extrabold flex items-center space-x-2">
                <FileText className="w-4 h-4 text-clinical-600" />
                <span>ASSESSMENT AT A GLANCE</span>
              </span>
              <span className="text-caption font-mono font-bold text-pearl-500">
                SESSION RECORD #01
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-caption font-mono">
              <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300">
                <span className="text-pearl-500 block text-[10px] uppercase font-bold">MODEL PROBABILITY</span>
                <span className="font-extrabold text-ink-950 text-meta block">{riskPercentage.toFixed(2)}%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300">
                <span className="text-pearl-500 block text-[10px] uppercase font-bold">PROFILE TIER</span>
                <span className={`font-extrabold text-meta block ${isPositive ? 'text-risk-high' : 'text-risk-low'}`}>
                  {isPositive ? 'HIGH RISK' : 'LOWER RISK'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300">
                <span className="text-pearl-500 block text-[10px] uppercase font-bold">CLASSIFIER</span>
                <span className="font-bold text-ink-950 block">LOGISTIC REGRESSION</span>
              </div>

              <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300">
                <span className="text-pearl-500 block text-[10px] uppercase font-bold">DECISION THRESHOLD</span>
                <span className="font-bold text-ink-950 block">θ = 0.50</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
