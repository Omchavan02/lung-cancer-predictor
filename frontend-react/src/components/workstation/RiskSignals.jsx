import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

const SIGNAL_WEIGHTS = {
  SMOKING: { label: 'Smoking History', level: 'Strong Model Weight', color: 'text-rose-800 bg-rose-50/90 border-rose-200' },
  COUGHING: { label: 'Persistent Coughing', level: 'Strong Model Weight', color: 'text-rose-800 bg-rose-50/90 border-rose-200' },
  SWALLOWING_DIFFICULTY: { label: 'Swallowing Difficulty', level: 'Moderate Model Weight', color: 'text-amber-800 bg-amber-50/90 border-amber-200' },
  SHORTNESS_OF_BREATH: { label: 'Shortness of Breath', level: 'Moderate Model Weight', color: 'text-amber-800 bg-amber-50/90 border-amber-200' },
  CHEST_PAIN: { label: 'Thoracic Chest Pain', level: 'Moderate Model Weight', color: 'text-amber-800 bg-amber-50/90 border-amber-200' },
  CHRONIC_DISEASE: { label: 'Chronic Pulmonary Conditions', level: 'Moderate Model Weight', color: 'text-amber-800 bg-amber-50/90 border-amber-200' },
  YELLOW_FINGERS: { label: 'Nicotine Staining / Yellow Fingers', level: 'Contextual Indicator', color: 'text-sky-800 bg-sky-50/90 border-sky-200' },
  FATIGUE: { label: 'Systemic Fatigue', level: 'Contextual Indicator', color: 'text-sky-800 bg-sky-50/90 border-sky-200' },
  ALLERGY: { label: 'Allergic Sensitivities', level: 'Contextual Indicator', color: 'text-sky-800 bg-sky-50/90 border-sky-200' },
  WHEEZING: { label: 'Wheezing Symptoms', level: 'Contextual Indicator', color: 'text-sky-800 bg-sky-50/90 border-sky-200' },
  ALCOHOL_CONSUMING: { label: 'Alcohol Consumption', level: 'Contextual Indicator', color: 'text-sky-800 bg-sky-50/90 border-sky-200' },
};

export default function RiskSignals({ formData }) {
  if (!formData) return null;

  // Filter factors present (value === 2)
  const activeSignals = Object.keys(SIGNAL_WEIGHTS).filter((key) => formData[key] === 2);
  const isOlderAge = typeof formData.AGE === 'number' && formData.AGE >= 60;

  return (
    <div className="p-6 rounded-2xl bg-white border border-pearl-300 space-y-4 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-pearl-300">
        <span className="text-caption font-mono uppercase text-ink-950 font-extrabold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-clinical-600" />
          <span>MODEL-ASSOCIATED RISK SIGNALS</span>
        </span>
        <span className="text-caption font-mono font-extrabold text-pearl-500 bg-pearl-100 px-2.5 py-0.5 rounded-full border border-pearl-300">
          {activeSignals.length + (isOlderAge ? 1 : 0)} SIGNALS PRESENT
        </span>
      </div>

      <div className="space-y-2.5">
        {isOlderAge && (
          <div className="p-4 rounded-xl border text-caption flex items-center justify-between font-mono font-extrabold text-amber-900 bg-amber-50 border-amber-200 shadow-2xs">
            <span>Patient Age ≥ 60 Years</span>
            <span className="text-[10px] uppercase tracking-wider bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300">Demographic Baseline</span>
          </div>
        )}

        {activeSignals.map((key) => {
          const info = SIGNAL_WEIGHTS[key];
          return (
            <div
              key={key}
              className={`p-4 rounded-xl border text-caption flex items-center justify-between font-mono font-extrabold shadow-2xs ${info.color}`}
            >
              <span>{info.label}</span>
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/80 border border-current opacity-90">{info.level}</span>
            </div>
          );
        })}

        {activeSignals.length === 0 && !isOlderAge && (
          <div className="p-5 rounded-xl border border-pearl-300 bg-pearl-100/60 text-pearl-600 text-caption font-mono text-center">
            No high-association symptoms or environmental risk signals detected in current profile.
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-pearl-100/80 border border-pearl-300 text-[11px] text-pearl-700 flex items-start space-x-2.5 leading-relaxed">
        <Info className="w-4 h-4 text-pearl-600 shrink-0 mt-0.5" />
        <span>
          <strong>Methodological Note:</strong> Feature associations reflect statistical correlations learned by the fitted logistic model. They do not constitute direct biological causation or medical diagnosis.
        </span>
      </div>
    </div>
  );
}
