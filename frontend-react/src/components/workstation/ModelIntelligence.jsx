import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Target,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  BarChart2,
  Layers,
  Activity,
  FileText,
  HelpCircle,
  Info,
  Sliders,
  GitBranch,
  Sigma,
  Award,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const PIPELINE_STAGES = [
  {
    id: 'inputs',
    num: '01',
    title: 'PATIENT INPUT',
    short: '15 Indicators',
    desc: 'Compiles biological sex, age in years, and 13 binary symptom/exposure indicators into a 15-dimensional vector x.',
    equation: 'x = [x₁, x₂, x₃, ..., x₁₅]',
    categoryGroups: [
      { name: 'DEMOGRAPHICS', detail: 'Age (numeric) & Biological Sex (binary)' },
      { name: 'EXPOSURES', detail: 'Smoking, Yellow Fingers, Alcohol, Peer Pressure' },
      { name: 'RESPIRATORY', detail: 'Fatigue, Wheezing, Coughing, Dyspnea' },
      { name: 'AIRWAY', detail: 'Allergy, Swallowing Dysphagia, Chest Pain' },
      { name: 'SYSTEMIC', detail: 'Pre-existing Chronic Conditions' },
    ],
  },
  {
    id: 'scaling',
    num: '02',
    title: 'STANDARDIZATION',
    short: 'StandardScaler',
    desc: 'Each numeric feature is transformed using the training-set scaling parameters before inference.',
    equation: 'z = (x - μ) / σ',
    formulaExplainer: [
      { symbol: 'x', label: 'Observed Feature Value', note: 'Raw input feature from patient vector' },
      { symbol: 'μ', label: 'Training Set Mean', note: 'Computed mean across 220 training samples' },
      { symbol: 'σ', label: 'Standard Deviation', note: 'Feature variation across training set' },
      { symbol: 'z', label: 'Standardized Z-Score', note: 'Zero-mean, unit-variance scaled feature' },
    ],
  },
  {
    id: 'logit',
    num: '03',
    title: 'LOGISTIC MODEL',
    short: 'Logit β (C=0.1)',
    desc: 'The standardized feature vector is combined with learned model coefficients to produce a linear score z.',
    equation: 'z = β₀ + β₁x₁ + β₂x₂ + ... + β₁₅x₁₅',
    formulaExplainer: [
      { symbol: 'β₀', label: 'Intercept Constant', note: 'Baseline log-odds parameter' },
      { symbol: 'βᵢ', label: 'Feature Weight (Coef)', note: 'Regularized coefficient learned during training' },
      { symbol: 'xᵢ', label: 'Standardized Feature', note: 'Normalized patient input value' },
      { symbol: 'z', label: 'Linear Logit Score', note: 'Unbounded log-odds value' },
    ],
  },
  {
    id: 'sigmoid',
    num: '04',
    title: 'SIGMOID FUNCTION',
    short: 'σ(z) Mapping',
    desc: 'Maps the linear score z into a bounded probability score P(Y=1|X) in the interval [0, 1].',
    equation: 'P(Y=1|X) = 1 / (1 + e⁻ᶻ)',
    formulaExplainer: [
      { symbol: 'z', label: 'Logit Input Score', note: 'Linear output from logistic weight sum' },
      { symbol: 'e', label: 'Euler’s Number', note: 'Base of natural logarithms (~2.71828)' },
      { symbol: 'P(Y=1|X)', label: 'Posterior Probability', note: 'Bounded score between 0.00 and 1.00' },
    ],
  },
  {
    id: 'decision',
    num: '05',
    title: 'RISK PROFILE',
    short: 'θ = 0.50 Threshold',
    desc: 'Classifies the profile as HIGH RISK PROFILE if probability ≥ 0.50, otherwise CONTROL / LOWER RISK PROFILE.',
    equation: 'Class = POSITIVE if P(YES) ≥ 0.50 else CONTROL',
    formulaExplainer: [
      { symbol: 'θ = 0.50', label: 'Decision Boundary', note: 'Fixed classification threshold' },
      { symbol: 'Class 1', label: 'HIGH RISK PROFILE', note: 'Assigned when P(YES) ≥ 0.50' },
      { symbol: 'Class 0', label: 'LOWER RISK PROFILE', note: 'Assigned when P(YES) < 0.50' },
    ],
  },
];

export default function ModelIntelligence({
  predictionResult,
  formData,
  modelInfo,
  onOpenModelInfo,
}) {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = PIPELINE_STAGES[activeStageIndex];

  const hasLivePrediction = Boolean(predictionResult);
  const positiveProb = predictionResult ? predictionResult.positive_probability * 100 : null;
  const isPositiveClass = predictionResult ? predictionResult.prediction === 'YES' : null;

  return (
    <div className="space-y-12">
      {/* SECTION HERO */}
      <div className="max-w-4xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-clinical-500/10 border border-clinical-500/30 text-caption font-mono text-clinical-800 uppercase tracking-widest font-extrabold shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-clinical-500 animate-pulse" />
          <span>MODEL INTELLIGENCE // LIVE ARCHITECTURE</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-4xl sm:text-6xl font-black text-ink-950 tracking-tight font-sans uppercase leading-[0.98]">
            Inside the LungSense
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-clinical-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent tracking-tight font-sans uppercase">
            Prediction Engine
          </h3>
        </div>

        <p className="text-body-xl text-pearl-700 leading-relaxed font-normal max-w-3xl">
          Explore how patient indicators move through the standardized classification pipeline to produce an interpretable pulmonary risk probability.
        </p>

        {/* Compact Metadata Pills */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5 font-mono text-caption">
          <div className="px-3.5 py-1.5 rounded-full bg-white border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-clinical-600" />
            <span>15 INPUT FEATURES</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-white border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-clinical-600" />
            <span>LOGISTIC REGRESSION</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-white border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-clinical-600" />
            <span>STANDARDIZED INFERENCE</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-white border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2">
            <span>THRESHOLD θ = 0.50</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs font-extrabold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>MODEL STATUS: VALIDATED</span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL MODEL STATUS PANEL (4 METRIC BLOCKS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Block 1 */}
        <div className="p-5 rounded-2xl bg-white border border-pearl-300 space-y-2 shadow-md hover:border-clinical-400 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between text-caption font-mono text-pearl-600 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-clinical-600" />
              <span>MODEL</span>
            </span>
            <span className="text-ink-950 bg-pearl-100 px-2 py-0.5 rounded-md border border-pearl-300 text-[10px]">
              C = 0.1
            </span>
          </div>
          <div className="text-lg font-black text-ink-950 tracking-tight font-sans">
            Logistic Regression
          </div>
          <p className="text-caption text-pearl-600 font-normal">
            L2 Regularized Binary Classifier
          </p>
        </div>

        {/* Block 2 */}
        <div className="p-5 rounded-2xl bg-white border border-pearl-300 space-y-2 shadow-md hover:border-clinical-400 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between text-caption font-mono text-pearl-600 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-clinical-600" />
              <span>INPUT SPACE</span>
            </span>
            <span className="text-ink-950 bg-pearl-100 px-2 py-0.5 rounded-md border border-pearl-300 text-[10px]">
              d = 15
            </span>
          </div>
          <div className="text-lg font-black text-ink-950 tracking-tight font-sans">
            15 Clinical Indicators
          </div>
          <p className="text-caption text-pearl-600 font-normal">
            Standardized Feature Vector
          </p>
        </div>

        {/* Block 3 */}
        <div className="p-5 rounded-2xl bg-white border border-pearl-300 space-y-2 shadow-md hover:border-clinical-400 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between text-caption font-mono text-pearl-600 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-clinical-600" />
              <span>DECISION</span>
            </span>
            <span className="text-ink-950 bg-pearl-100 px-2 py-0.5 rounded-md border border-pearl-300 text-[10px]">
              θ = 0.50
            </span>
          </div>
          <div className="text-lg font-black text-ink-950 tracking-tight font-sans">
            Threshold θ = 0.50
          </div>
          <p className="text-caption text-pearl-600 font-normal">
            Binary Risk Classification
          </p>
        </div>

        {/* Block 4 */}
        <div className="p-5 rounded-2xl bg-white border border-pearl-300 space-y-2 shadow-md hover:border-clinical-400 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between text-caption font-mono text-pearl-600 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-clinical-600" />
              <span>INFERENCE</span>
            </span>
            <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300 text-[10px] font-bold">
              100% REPRODUCIBLE
            </span>
          </div>
          <div className="text-lg font-black text-ink-950 tracking-tight font-sans">
            Deterministic
          </div>
          <p className="text-caption text-pearl-600 font-normal">
            Reproducible Output Matrix
          </p>
        </div>
      </div>

      {/* HOW THE MODEL THINKS (5-STAGE INTERACTIVE PIPELINE) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pearl-300 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pearl-300">
          <div>
            <span className="text-caption font-mono uppercase text-clinical-700 block font-black tracking-widest">
              HOW THE MODEL THINKS
            </span>
            <h3 className="text-2xl font-black text-ink-950 tracking-tight font-sans">
              Interactive Inference Pipeline
            </h3>
          </div>
          <span className="text-caption font-mono font-extrabold text-clinical-800 bg-clinical-50 px-3 py-1 rounded-full border border-clinical-200 self-start sm:self-auto">
            STAGE 0{activeStageIndex + 1} OF 05 ACTIVE
          </span>
        </div>

        {/* 5 Stage Horizontal Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {PIPELINE_STAGES.map((stg, idx) => {
            const isActive = activeStageIndex === idx;
            return (
              <button
                key={stg.id}
                type="button"
                onClick={() => setActiveStageIndex(idx)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-br from-ink-950 via-slate-900 to-ink-950 text-white border-clinical-500 shadow-xl ring-2 ring-clinical-500/30'
                    : 'bg-pearl-100/70 hover:bg-pearl-200/80 text-ink-950 border-pearl-300'
                }`}
              >
                <div className="flex items-center justify-between text-caption font-mono font-bold mb-2">
                  <span className={isActive ? 'text-clinical-400 font-black' : 'text-pearl-500'}>
                    {stg.num}
                  </span>
                  {idx < 4 && <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-clinical-400' : 'text-pearl-400'} hidden sm:inline`} />}
                </div>
                <div>
                  <div className="text-caption font-black truncate tracking-wide font-sans">{stg.title}</div>
                  <div className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-pearl-300' : 'text-pearl-600'}`}>{stg.short}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-pearl-50 to-pearl-100/80 border border-pearl-300 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-pearl-300/80">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-ink-950 text-white font-mono font-black text-caption flex items-center justify-center shrink-0 shadow-xs">
                {activeStage.num}
              </span>
              <div>
                <span className="text-caption font-mono uppercase text-clinical-700 font-bold tracking-wider block">
                  STAGE DETAIL EXPLAINER
                </span>
                <h4 className="text-xl font-extrabold text-ink-950 font-sans">
                  {activeStage.title}
                </h4>
              </div>
            </div>

            <span className="font-mono text-caption font-extrabold text-ink-950 bg-white px-3.5 py-1.5 rounded-lg border border-pearl-300 shadow-2xs">
              {activeStage.equation}
            </span>
          </div>

          <p className="text-body-md text-pearl-800 leading-relaxed font-normal">
            {activeStage.desc}
          </p>

          {/* Stage 01 Category Breakdown */}
          {activeStage.categoryGroups && (
            <div className="space-y-3 pt-2">
              <span className="text-caption font-mono uppercase font-black text-ink-950 tracking-wider block">
                FEATURE VECTOR CATEGORY STRUCTURE (15 DIMENSIONS)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-caption">
                {activeStage.categoryGroups.map((grp) => (
                  <div key={grp.name} className="p-3.5 rounded-xl bg-white border border-pearl-300 shadow-2xs space-y-1">
                    <span className="font-extrabold text-clinical-700 block">{grp.name}</span>
                    <span className="text-pearl-600 block text-[11px] leading-normal">{grp.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage Formula Breakdown */}
          {activeStage.formulaExplainer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-caption pt-2">
              {activeStage.formulaExplainer.map((item) => (
                <div key={item.symbol} className="p-3.5 rounded-xl bg-white border border-pearl-300 shadow-2xs space-y-1">
                  <span className="text-clinical-700 font-extrabold text-body-md block">{item.symbol}</span>
                  <span className="font-bold text-ink-950 block">{item.label}</span>
                  <span className="text-pearl-600 block text-[11px] font-normal leading-relaxed">{item.note}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stage 04 Sigmoid Graphic Visualization */}
          {activeStage.id === 'sigmoid' && (
            <div className="p-5 rounded-xl bg-ink-950 text-white space-y-3 font-mono text-caption border border-white/10">
              <div className="flex items-center justify-between text-pearl-300 text-caption font-bold">
                <span>SIGMOID CURVE TRANSFORMATION // S-CURVE BOUNDING</span>
                <span>P ∈ [0, 1]</span>
              </div>
              <div className="w-full h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-clinical-500/20 to-rose-500/20 pointer-events-none" />
                <span className="text-emerald-400 font-extrabold">z &lt;&lt; 0 → P ≈ 0.00 (CONTROL)</span>
                <span className="text-clinical-300 font-extrabold bg-white/10 px-3 py-1 rounded border border-white/20">z = 0 → P = 0.50 (THRESHOLD)</span>
                <span className="text-rose-400 font-extrabold">z &gt;&gt; 0 → P ≈ 1.00 (HIGH RISK)</span>
              </div>
            </div>
          )}

          {/* Stage 05 Risk Profile Result Context */}
          {activeStage.id === 'decision' && (
            <div className="p-5 rounded-xl bg-white border border-pearl-300 space-y-2 font-mono text-caption">
              <span className="font-extrabold text-ink-950 uppercase tracking-wider block">CURRENT ASSESSMENT INFERENCE STATE</span>
              {hasLivePrediction ? (
                <div className="flex items-center justify-between text-body-md">
                  <span>POSTERIOR PROBABILITY: <strong className="text-clinical-700">{positiveProb.toFixed(2)}%</strong></span>
                  <span className={`font-extrabold px-3 py-1 rounded-md border ${isPositiveClass ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'}`}>
                    {isPositiveClass ? 'HIGH RISK PROFILE (P ≥ 0.50)' : 'LOWER RISK PROFILE (P < 0.50)'}
                  </span>
                </div>
              ) : (
                <p className="text-pearl-600 font-normal italic">
                  Awaiting patient assessment — select "Start Risk Assessment" to evaluate a live patient vector.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* LIVE INFERENCE TRACE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-ink-950 via-slate-900 to-ink-950 text-white border border-white/15 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-caption font-mono text-emerald-300 uppercase tracking-widest font-extrabold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE INFERENCE TRACE</span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1 tracking-tight font-sans">
              Real-Time Patient Vector Pipeline Trace
            </h3>
          </div>

          <span className="text-caption font-mono text-pearl-300 bg-white/10 px-3 py-1 rounded-md border border-white/15 font-bold">
            {hasLivePrediction ? 'PREDICTION EVALUATED' : 'NO ACTIVE INFERENCE'}
          </span>
        </div>

        {hasLivePrediction ? (
          <div className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center font-mono text-caption">
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-pearl-200">
                <span className="block text-[10px] text-pearl-400 uppercase">01 VECTOR</span>
                <span className="font-extrabold text-white text-xs block mt-1">15 FEATURES</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-pearl-200">
                <span className="block text-[10px] text-pearl-400 uppercase">02 SCALER</span>
                <span className="font-extrabold text-white text-xs block mt-1">Z-SCORE</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-pearl-200">
                <span className="block text-[10px] text-pearl-400 uppercase">03 LOGIT</span>
                <span className="font-extrabold text-white text-xs block mt-1">β WEIGHTS</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-pearl-200">
                <span className="block text-[10px] text-pearl-400 uppercase">04 SIGMOID</span>
                <span className="font-extrabold text-white text-xs block mt-1">PROBABILITY</span>
              </div>
              <div className="p-3.5 rounded-xl bg-clinical-500/20 border border-clinical-400/40 text-clinical-300 col-span-2">
                <span className="block text-[10px] text-clinical-300 uppercase">05 OUTPUT RESULT</span>
                <span className="font-black text-white text-body-md block mt-0.5">
                  {positiveProb.toFixed(2)}% ({isPositiveClass ? 'HIGH RISK' : 'LOWER RISK'})
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-caption font-mono text-pearl-300 flex items-center justify-between">
              <span>Patient Age: {formData?.AGE || 'N/A'} yrs • Sex: {formData?.GENDER || 'N/A'}</span>
              <a
                href="#assessment"
                className="text-clinical-300 hover:text-white font-bold underline cursor-pointer"
              >
                Modify Patient Features in Assessment →
              </a>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4 relative z-10 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-clinical-400 mx-auto">
              <Activity className="w-7 h-7 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">NO ACTIVE INFERENCE</h4>
              <p className="text-caption text-pearl-300 leading-relaxed font-normal">
                Run a risk assessment to inspect the model's live inference trace and feature vector transformation.
              </p>
            </div>
            <a
              href="#assessment"
              className="inline-flex items-center space-x-2 py-3 px-6 rounded-full bg-white text-ink-950 hover:bg-pearl-100 font-extrabold text-caption uppercase tracking-wider shadow-lg transition-all cursor-pointer"
            >
              <span>START RISK ASSESSMENT</span>
              <ArrowRight className="w-4 h-4 text-ink-950" />
            </a>
          </div>
        )}
      </div>

      {/* FEATURE CONTRIBUTION / MODEL WEIGHTS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pearl-300 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pearl-300">
          <div>
            <span className="text-caption font-mono uppercase text-clinical-700 block font-black tracking-widest">
              FEATURE CONTRIBUTION & WEIGHTS
            </span>
            <h3 className="text-2xl font-black text-ink-950 tracking-tight font-sans">
              How Individual Indicators Influence Model Score
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenModelInfo}
            className="px-3.5 py-1.5 rounded-full bg-pearl-100 hover:bg-pearl-200 text-ink-950 font-mono text-caption font-bold border border-pearl-300 transition-colors cursor-pointer self-start sm:self-auto"
          >
            INSPECT METADATA MATRIX
          </button>
        </div>

        {/* Feature Contribution Matrix Visualization */}
        <div className="p-6 rounded-2xl bg-pearl-100/70 border border-pearl-300 space-y-4 font-mono text-caption">
          <div className="flex items-center justify-between text-pearl-600 font-bold text-[11px] uppercase tracking-wider pb-2 border-b border-pearl-300">
            <span>INDICATOR / FEATURE SYMBOL</span>
            <span>MODEL RELATIVE INFLUENCE SCORE</span>
          </div>

          {[
            { label: 'Smoking History (SMOKING)', weight: 'Strong Positive Weight', fill: 'w-[90%]', color: 'bg-rose-500' },
            { label: 'Persistent Coughing (COUGHING)', weight: 'Strong Positive Weight', fill: 'w-[85%]', color: 'bg-rose-500' },
            { label: 'Swallowing Difficulty (SWALLOWING_DIFFICULTY)', weight: 'Moderate Weight', fill: 'w-[65%]', color: 'bg-amber-500' },
            { label: 'Shortness of Breath (SHORTNESS_OF_BREATH)', weight: 'Moderate Weight', fill: 'w-[60%]', color: 'bg-amber-500' },
            { label: 'Thoracic Chest Pain (CHEST_PAIN)', weight: 'Moderate Weight', fill: 'w-[55%]', color: 'bg-amber-500' },
            { label: 'Chronic Pulmonary Disease (CHRONIC_DISEASE)', weight: 'Moderate Weight', fill: 'w-[50%]', color: 'bg-amber-500' },
            { label: 'Yellow Fingers / Staining (YELLOW_FINGERS)', weight: 'Contextual Weight', fill: 'w-[35%]', color: 'bg-cyan-600' },
            { label: 'Patient Age ≥ 60 Years (AGE)', weight: 'Demographic Weight', fill: 'w-[40%]', color: 'bg-cyan-600' },
          ].map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-ink-950 font-bold">
                <span>{item.label}</span>
                <span className="text-pearl-600 text-[10px] uppercase">{item.weight}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-pearl-200 overflow-hidden border border-pearl-300/60 p-0.5">
                <div className={`h-full ${item.color} ${item.fill} rounded-full transition-all duration-500`} />
              </div>
            </div>
          ))}

          <div className="pt-2 text-pearl-600 text-[11px] leading-relaxed">
            <strong>Research Note:</strong> Feature weights reflect learned L2-regularized logistic regression coefficients ($C=0.1$). Weights denote statistical log-odds contribution, not biological causation.
          </div>
        </div>
      </div>

      {/* MODEL INTERPRETABILITY (3 EXPLANATION CARDS) */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-caption font-mono uppercase text-clinical-700 block font-black tracking-widest">
            MODEL INTERPRETABILITY
          </span>
          <h3 className="text-2xl font-black text-ink-950 tracking-tight font-sans">
            Transparent Architectural Properties
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-pearl-300 space-y-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-clinical-50 text-clinical-600 flex items-center justify-center border border-clinical-200">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-extrabold text-ink-950 font-sans">
              TRANSPARENT
            </h4>
            <p className="text-caption text-pearl-700 font-normal leading-relaxed">
              Linear coefficients provide an interpretable relationship between standardized indicators and model score.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-pearl-300 space-y-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-clinical-50 text-clinical-600 flex items-center justify-center border border-clinical-200">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-extrabold text-ink-950 font-sans">
              DETERMINISTIC
            </h4>
            <p className="text-caption text-pearl-700 font-normal leading-relaxed">
              Identical input vectors produce the exact same numerical model output across all evaluation environments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-pearl-300 space-y-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-clinical-50 text-clinical-600 flex items-center justify-center border border-clinical-200">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-extrabold text-ink-950 font-sans">
              THRESHOLDED
            </h4>
            <p className="text-caption text-pearl-700 font-normal leading-relaxed">
              Probability is converted into a binary risk class using the configured decision threshold (θ = 0.50).
            </p>
          </div>
        </div>
      </div>

      {/* MODEL VALIDATION SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pearl-300 space-y-6 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-pearl-300">
          <div>
            <span className="text-caption font-mono uppercase text-clinical-700 block font-black tracking-widest">
              BENCHMARK VALIDATION
            </span>
            <h3 className="text-2xl font-black text-ink-950 tracking-tight font-sans">
              Model Validation & Holdout Performance
            </h3>
          </div>
          <span className="text-caption font-mono font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
            TEST SET n = 56
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="p-4 rounded-xl bg-pearl-100/80 border border-pearl-300 space-y-1 shadow-2xs">
            <span className="text-pearl-500 text-[10px] uppercase font-extrabold">HOLDOUT ACCURACY</span>
            <span className="text-xl font-black text-ink-950 block">91.07%</span>
            <span className="text-[11px] text-pearl-600 block">51 of 56 test cases</span>
          </div>

          <div className="p-4 rounded-xl bg-pearl-100/80 border border-pearl-300 space-y-1 shadow-2xs">
            <span className="text-pearl-500 text-[10px] uppercase font-extrabold">BALANCED ACCURACY</span>
            <span className="text-xl font-black text-ink-950 block">84.38%</span>
            <span className="text-[11px] text-pearl-600 block">Adjusted class weights</span>
          </div>

          <div className="p-4 rounded-xl bg-pearl-100/80 border border-pearl-300 space-y-1 shadow-2xs">
            <span className="text-pearl-500 text-[10px] uppercase font-extrabold">MACRO F1-SCORE</span>
            <span className="text-xl font-black text-ink-950 block">83.54%</span>
            <span className="text-[11px] text-pearl-600 block">Harmonic precision-recall</span>
          </div>

          <div className="p-4 rounded-xl bg-pearl-100/80 border border-pearl-300 space-y-1 shadow-2xs">
            <span className="text-pearl-500 text-[10px] uppercase font-extrabold">25-FOLD PR-AUC</span>
            <span className="text-xl font-black text-emerald-700 block">0.943 ± 0.04</span>
            <span className="text-[11px] text-pearl-600 block">Precision-recall curve</span>
          </div>
        </div>
      </div>

      {/* TRAINING CONTEXT WORKFLOW */}
      <div className="p-6 sm:p-8 rounded-3xl bg-pearl-50 border border-pearl-300 space-y-6 shadow-md">
        <div className="pb-4 border-b border-pearl-300/80">
          <span className="text-caption font-mono uppercase text-clinical-700 block font-black tracking-widest">
            ML WORKFLOW TRANSFORMATION
          </span>
          <h3 className="text-2xl font-black text-ink-950 tracking-tight font-sans">
            Training Context & Deployment Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center font-mono text-caption">
          <div className="p-4 rounded-xl bg-white border border-pearl-300 shadow-2xs">
            <span className="text-clinical-700 font-extrabold text-body-md block">01</span>
            <span className="font-bold text-ink-950 block mt-1">DATASET</span>
            <span className="text-[10px] text-pearl-600 block">n = 309 cases</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-pearl-300 shadow-2xs">
            <span className="text-clinical-700 font-extrabold text-body-md block">02</span>
            <span className="font-bold text-ink-950 block mt-1">FEATURES</span>
            <span className="text-[10px] text-pearl-600 block">15 indicators</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-pearl-300 shadow-2xs">
            <span className="text-clinical-700 font-extrabold text-body-md block">03</span>
            <span className="font-bold text-ink-950 block mt-1">SCALER</span>
            <span className="text-[10px] text-pearl-600 block">StandardScaler</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-pearl-300 shadow-2xs">
            <span className="text-clinical-700 font-extrabold text-body-md block">04</span>
            <span className="font-bold text-ink-950 block mt-1">TRAINING</span>
            <span className="text-[10px] text-pearl-600 block">C = 0.1 Logit</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-pearl-300 shadow-2xs">
            <span className="text-clinical-700 font-extrabold text-body-md block">05</span>
            <span className="font-bold text-ink-950 block mt-1">VALIDATION</span>
            <span className="text-[10px] text-pearl-600 block">25-Fold CV</span>
          </div>

          <div className="p-4 rounded-xl bg-clinical-50 text-clinical-800 border border-clinical-300 shadow-2xs">
            <span className="font-extrabold text-body-md block">06</span>
            <span className="font-black text-ink-950 block mt-1">INFERENCE</span>
            <span className="text-[10px] text-clinical-700 block">FastAPI REST</span>
          </div>
        </div>
      </div>

      {/* MODEL CARD SUMMARY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pearl-300 space-y-6 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-pearl-300">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-ink-950 text-white shadow-xs">
              <FileText className="w-5 h-5 text-clinical-300" />
            </div>
            <div>
              <span className="text-caption font-mono uppercase text-clinical-700 block font-black tracking-widest">
                SYSTEM SPECIFICATION
              </span>
              <h3 className="text-2xl font-black text-ink-950 tracking-tight font-sans">
                Official Model Card
              </h3>
            </div>
          </div>

          <span className="text-caption font-mono font-bold text-pearl-500">
            SPECIFICATION v1.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-caption">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300 flex justify-between items-center">
              <span className="text-pearl-500 font-bold">MODEL TYPE</span>
              <span className="font-extrabold text-ink-950">Logistic Regression</span>
            </div>
            <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300 flex justify-between items-center">
              <span className="text-pearl-500 font-bold">TASK</span>
              <span className="font-extrabold text-ink-950">Binary Classification</span>
            </div>
            <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300 flex justify-between items-center">
              <span className="text-pearl-500 font-bold">INPUT VECTOR</span>
              <span className="font-extrabold text-ink-950">15 Clinical Indicators</span>
            </div>
            <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300 flex justify-between items-center">
              <span className="text-pearl-500 font-bold">PREPROCESSING</span>
              <span className="font-extrabold text-ink-950">StandardScaler Z-Score</span>
            </div>
            <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300 flex justify-between items-center">
              <span className="text-pearl-500 font-bold">DECISION THRESHOLD</span>
              <span className="font-extrabold text-ink-950">θ = 0.50</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300 flex justify-between items-center">
              <span className="text-pearl-500 font-bold">MODEL ROLE</span>
              <span className="font-extrabold text-ink-950">Risk Classification Support</span>
            </div>
            <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300 flex justify-between items-center">
              <span className="text-pearl-500 font-bold">OUTPUT</span>
              <span className="font-extrabold text-ink-950">Probability + Binary Class</span>
            </div>
            <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300 flex justify-between items-center">
              <span className="text-pearl-500 font-bold">INTERPRETABILITY</span>
              <span className="font-extrabold text-emerald-700">High (Linear Coefficients)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300 flex justify-between items-center">
              <span className="text-pearl-500 font-bold">INFERENCE ENGINE</span>
              <span className="font-extrabold text-ink-950">Deterministic</span>
            </div>
            <div className="p-3.5 rounded-xl bg-pearl-100/80 border border-pearl-300 flex justify-between items-center">
              <span className="text-pearl-500 font-bold">BACKEND SERVER</span>
              <span className="font-extrabold text-emerald-700">FastAPI REST Endpoint</span>
            </div>
          </div>
        </div>

        {/* Limitation Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-pearl-100 border border-pearl-300 text-caption text-pearl-700 flex items-start space-x-3 leading-relaxed">
          <Info className="w-4 h-4 text-pearl-600 shrink-0 mt-0.5" />
          <span>
            <strong>Academic Limitation:</strong> Statistical output is computed from survey correlations and is not a medical diagnosis. Model predictions must never replace professional clinical evaluation or diagnostic medical imaging.
          </span>
        </div>
      </div>
    </div>
  );
}
