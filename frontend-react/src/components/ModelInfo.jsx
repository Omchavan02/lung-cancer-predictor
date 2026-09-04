import React from 'react';
import { X, Database } from 'lucide-react';

export default function ModelInfo({ isOpen, onClose, modelInfo }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/40 backdrop-blur-xs animate-in fade-in">
      <div className="rounded-sm bg-white border border-pearl-300 max-w-2xl w-full p-8 space-y-6 shadow-panel relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-pearl-500 hover:text-ink-900 rounded-sm hover:bg-pearl-200 transition-colors cursor-pointer"
          title="Close Modal"
          aria-label="Close Model Info Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-sm bg-ink-900 text-white shadow-xs">
            <Database className="w-5 h-5 text-clinical-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-ink-900">Frozen Model Architecture & Metadata</h3>
            <p className="text-caption text-pearl-600">Verified parameters of the production machine learning pipeline.</p>
          </div>
        </div>

        <div className="space-y-4 text-meta leading-relaxed text-pearl-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xs bg-pearl-100 border border-pearl-300">
              <span className="text-pearl-600 font-semibold block uppercase text-[10px] tracking-wider">Production Classifier</span>
              <span className="font-mono font-bold text-ink-900 text-body-md mt-0.5 block">Logistic Regression</span>
            </div>
            <div className="p-4 rounded-xs bg-pearl-100 border border-pearl-300">
              <span className="text-pearl-600 font-semibold block uppercase text-[10px] tracking-wider">Class Balancing</span>
              <span className="font-mono font-bold text-ink-900 text-body-md mt-0.5 block">class_weight='balanced'</span>
            </div>
            <div className="p-4 rounded-xs bg-pearl-100 border border-pearl-300">
              <span className="text-pearl-600 font-semibold block uppercase text-[10px] tracking-wider">Regularization</span>
              <span className="font-mono font-bold text-ink-900 text-body-md mt-0.5 block">C = 0.1 (L2 Penalty)</span>
            </div>
            <div className="p-4 rounded-xs bg-pearl-100 border border-pearl-300">
              <span className="text-pearl-600 font-semibold block uppercase text-[10px] tracking-wider">Operating Threshold</span>
              <span className="font-mono font-bold text-ink-900 text-body-md mt-0.5 block">θ = 0.50 (Frozen)</span>
            </div>
          </div>

          <div className="p-5 rounded-xs bg-pearl-100 border border-pearl-300 space-y-2">
            <h4 className="font-bold text-ink-900 uppercase tracking-wider text-[11px]">
              Expected 15-Feature Order (FEATURE_ORDER)
            </h4>
            <div className="flex flex-wrap gap-1.5 font-mono text-caption">
              {[
                "GENDER", "AGE", "SMOKING", "YELLOW_FINGERS", "ANXIETY",
                "PEER_PRESSURE", "CHRONIC_DISEASE", "FATIGUE", "ALLERGY", "WHEEZING",
                "ALCOHOL_CONSUMING", "COUGHING", "SHORTNESS_OF_BREATH", "SWALLOWING_DIFFICULTY", "CHEST_PAIN"
              ].map((feat, idx) => (
                <span key={feat} className="px-2 py-0.5 rounded-xs bg-white border border-pearl-300 text-ink-900 font-medium">
                  {idx + 1}. {feat}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xs bg-pearl-100 border border-pearl-300 space-y-2">
            <h4 className="font-bold text-ink-900 uppercase tracking-wider text-[11px]">
              Statistical Performance on Frozen Holdout Test Set (n=56)
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-pearl-700">
              <li>Holdout Accuracy: <strong className="text-ink-900">91.07% (51/56)</strong></li>
              <li>Balanced Accuracy: <strong className="text-ink-900">84.38%</strong></li>
              <li>Macro F1-Score: <strong className="text-ink-900">83.54%</strong></li>
              <li>Minority Class (NO) Recall: <strong className="text-ink-900">75.00% (6 of 8 negative cases detected)</strong></li>
              <li>25-Fold Repeated CV PR-AUC: <strong className="text-ink-900">0.943 ± 0.041</strong></li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-pearl-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-sm text-meta font-semibold bg-ink-900 hover:bg-ink-800 text-white shadow-xs cursor-pointer transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
