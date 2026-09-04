import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ModelPerformance({ onOpenModelInfo }) {
  return (
    <section id="model-perf" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-caption uppercase text-ink-800">
            Empirical Validation & Benchmark Results
          </div>
          <h2 className="text-display-xl font-extrabold text-ink-900 tracking-tight">
            Built for Transparency, Not Black-Box Hype
          </h2>
          <p className="text-body-xl text-pearl-700 leading-relaxed font-normal">
            Rigorous 25-Fold Repeated Stratified Cross-Validation benchmarked against a frozen holdout test partition (n=56).
          </p>
        </div>

        {/* 4 Unboxed Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="border-t-2 border-ink-900 pt-4 space-y-2">
            <span className="text-caption font-mono uppercase text-pearl-600 block">Holdout Accuracy</span>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-ink-900 block">91.07%</span>
            <p className="text-caption text-pearl-600 leading-relaxed font-normal">51 correct classifications out of 56 unseen test samples.</p>
          </div>

          <div className="border-t-2 border-ink-900 pt-4 space-y-2">
            <span className="text-caption font-mono uppercase text-pearl-600 block">Balanced Accuracy</span>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-ink-900 block">84.38%</span>
            <p className="text-caption text-pearl-600 leading-relaxed font-normal">Accounts for majority class skew (6.26:1 ratio).</p>
          </div>

          <div className="border-t-2 border-ink-900 pt-4 space-y-2">
            <span className="text-caption font-mono uppercase text-pearl-600 block">PR-AUC Metric</span>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-ink-900 block">0.9392</span>
            <p className="text-caption text-pearl-600 leading-relaxed font-normal">Primary benchmark evaluating true positive ranking precision.</p>
          </div>

          <div className="border-t-2 border-ink-900 pt-4 space-y-2">
            <span className="text-caption font-mono uppercase text-pearl-600 block">Minority Recall</span>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-ink-900 block">75.00%</span>
            <p className="text-caption text-pearl-600 leading-relaxed font-normal">6 of 8 negative cases correctly detected despite severe skew.</p>
          </div>
        </div>

        {/* Explicit Academic Distinction Box */}
        <div className="p-8 sm:p-10 rounded-sm bg-pearl-100 border border-pearl-300 space-y-6 shadow-subtle">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-ink-900 shrink-0" />
            <h3 className="text-headline font-bold text-ink-900">
              Crucial Academic Distinction: Model Performance vs Individual Risk Probability
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-meta text-pearl-700">
            <div className="p-6 rounded-xs bg-white border border-pearl-300 space-y-2 shadow-subtle">
              <span className="font-mono uppercase text-caption text-pearl-600 block">Metric A: Global Model Accuracy</span>
              <span className="text-3xl font-extrabold font-mono text-ink-900 block">91.07%</span>
              <p className="text-body-md text-pearl-700 leading-relaxed font-normal">
                Represents the proportion of holdout patients correctly classified across the entire 56-sample test cohort.
              </p>
            </div>

            <div className="p-6 rounded-xs bg-white border border-pearl-300 space-y-2 shadow-subtle">
              <span className="font-mono uppercase text-caption text-pearl-600 block">Metric B: Patient Case Probability</span>
              <span className="text-3xl font-extrabold font-mono text-clinical-800 block">P(YES)</span>
              <p className="text-body-md text-pearl-700 leading-relaxed font-normal">
                Represents the specific sigmoid probability score returned for a configured individual profile. It is NOT model accuracy.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-pearl-300">
            <span className="text-caption text-pearl-700 font-medium">
              Production Classifier: <strong>Logistic Regression (Balanced, C=0.1, L2 Regularization, Solver='lbfgs')</strong>
            </span>
            <button
              onClick={onOpenModelInfo}
              className="px-5 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-800 text-white font-semibold text-meta shrink-0 transition-all cursor-pointer"
            >
              Inspect Model Coefficients & Odds Ratios
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
