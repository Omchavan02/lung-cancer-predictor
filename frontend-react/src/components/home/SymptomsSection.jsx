import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IMAGES } from '../../constants/images';

export default function SymptomsSection() {
  const [expandedIdx, setExpandedIdx] = useState(0);

  const symptoms = [
    {
      num: '01',
      title: 'Persistent Coughing',
      oddsRatio: 'OR 1.48 (β = +0.3927)',
      summary: 'Continuous cough lasting over three weeks that does not resolve with standard antitussive therapy.',
      details: 'Tumor irritation of bronchial mucosal sensory nerve endings triggers a persistent mechanical cough reflex. A newly developed cough that fails to resolve, or a noticeable change in a chronic smoker cough, warrants direct clinical investigation.',
      advice: 'Consult a physician if coughing persists beyond 3–4 weeks or presents with hemoptysis (blood-streaked sputum).',
    },
    {
      num: '02',
      title: 'Shortness of Breath (Dyspnea)',
      oddsRatio: 'OR 1.07 (β = +0.0712)',
      summary: 'Progressive difficulty catching breath during normal physical exertion or at rest.',
      details: 'Airway lumen narrowing, localized tumor obstruction, or fluid accumulation in the pleural space (effusion) diminishes functional vital capacity.',
      advice: 'Unexplained or progressively worsening shortness of breath requires prompt cardiopulmonary evaluation.',
    },
    {
      num: '03',
      title: 'Respiratory Wheezing',
      oddsRatio: 'OR 1.54 (β = +0.4312)',
      summary: 'Audible high-pitched whistling sounds during inhalation or exhalation.',
      details: 'Airflow turbulence caused by partial bronchial constriction produces distinct wheezing sounds. Ranked among the top four predictive risk coefficients in our dataset.',
      advice: 'New-onset wheezing in adults without a history of childhood asthma should be clinically investigated.',
    },
    {
      num: '04',
      title: 'Chronic Fatigue & Malaise',
      oddsRatio: 'OR 1.29 (β = +0.2514)',
      summary: 'Deep, persistent exhaustion unrelieved by adequate sleep or nutritional intake.',
      details: 'Systemic metabolic shifts, cancer-related cytokine production, and sub-optimal pulmonary oxygenation combine to produce generalized fatigue.',
      advice: 'Fatigue accompanied by unexplained weight loss or night sweats requires comprehensive clinical evaluation.',
    },
    {
      num: '05',
      title: 'Chest, Shoulder & Thoracic Pain',
      oddsRatio: 'OR 1.38 (β = +0.3218)',
      summary: 'Ache, sharp twinges, or localized tightness across the thoracic cage or shoulder girdle.',
      details: 'Peripheral pulmonary lesions contacting the parietal pleura or chest wall nerve pathways produce localized somatic pain, often intensifying during deep inhalation.',
      advice: 'Persistent chest pain should always be evaluated promptly to differentiate cardiac, pleural, and musculoskeletal etiologies.',
    },
    {
      num: '06',
      title: 'Swallowing Difficulty (Dysphagia)',
      oddsRatio: 'OR 1.57 (β = +0.4533)',
      summary: 'Sensation of food or liquid sticking in the mid-chest or throat during swallowing.',
      details: 'Ranked 3rd in predictive weight in our model, dysphagia can arise when enlarged mediastinal lymph nodes compress the adjacent esophageal lumen.',
      advice: 'Progressive difficulty swallowing solids or liquids necessitates prompt clinical and endoscopic examination.',
    },
  ];

  return (
    <section id="symptoms" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-caption uppercase text-ink-800">
            Clinical Reference & Presentation
          </div>
          <h2 className="text-display-xl font-extrabold text-ink-900 tracking-tight">
            Clinical Symptom Indicators & Context
          </h2>
          <p className="text-body-xl text-pearl-700 leading-relaxed font-normal">
            Select any indicator to inspect its underlying physiological mechanism and clinical guidelines on when to seek evaluation.
          </p>
        </div>

        {/* Visual Anchor Frame */}
        <div className="art-image-frame bg-white p-2 border border-pearl-300 shadow-panel">
          <div className="relative rounded-xs overflow-hidden aspect-21/9 bg-ink-950">
            <img
              src={IMAGES.lungSymptoms}
              alt="Clinical Respiratory Symptoms"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/40 to-transparent flex items-center p-8 sm:p-12">
              <div className="max-w-lg text-white space-y-2">
                <span className="text-caption font-mono uppercase text-clinical-300">Symptom Cluster Analysis</span>
                <h3 className="text-headline font-bold">Correlating Survey Indicators with Clinical Profiles</h3>
                <p className="text-body-md text-pearl-300 leading-relaxed font-normal">
                  Our model simultaneously evaluates 13 clinical symptoms to compute calibrated non-linear risk probabilities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Reference List */}
        <div className="space-y-4 pt-4">
          {symptoms.map((symptom, idx) => {
            const isExpanded = expandedIdx === idx;
            return (
              <div
                key={idx}
                className="border-t border-pearl-300 pt-5 pb-5 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIdx(isExpanded ? -1 : idx)}
                  className="flex w-full items-center justify-between cursor-pointer group text-left"
                  aria-expanded={isExpanded}
                  aria-controls={`symptom-details-${idx}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 gap-1">
                    <span className="font-mono text-xs font-bold text-ink-800 uppercase">
                      Indicator {symptom.num}
                    </span>
                    <h3 className="text-headline font-bold text-ink-900 group-hover:text-ink-700">
                      {symptom.title}
                    </h3>
                    <span className="font-mono text-xs font-bold text-ink-900 bg-pearl-200 px-2.5 py-1 rounded-xs border border-pearl-300 w-fit">
                      {symptom.oddsRatio}
                    </span>
                  </div>
                  <span className="p-1 text-pearl-500 group-hover:text-ink-900" aria-hidden="true">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                <p className="text-body-lg text-pearl-700 mt-2 font-normal leading-relaxed">
                  {symptom.summary}
                </p>

                {isExpanded && (
                  <div id={`symptom-details-${idx}`} className="mt-4 p-6 rounded-sm bg-pearl-100 border border-pearl-300 space-y-3 text-meta text-pearl-700 leading-relaxed animate-in fade-in">
                    <div>
                      <strong className="text-ink-900 block text-caption uppercase font-mono mb-1">Pathological Mechanism</strong>
                      <p className="font-normal">{symptom.details}</p>
                    </div>
                    <div className="pt-3 border-t border-pearl-300 text-ink-900">
                      <strong>When to Consult a Physician: </strong>{symptom.advice}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Medical Notice */}
        <div className="p-6 rounded-sm bg-pearl-100 border border-pearl-300 text-meta text-pearl-700 leading-relaxed">
          <strong className="text-ink-900 block mb-1">Medical Notice</strong>
          The presence of one or more of these symptoms does not establish a diagnosis of lung cancer. Common benign conditions (such as asthma, gastroesophageal reflux, or viral bronchitis) frequently present with identical symptoms. Always consult a physician for diagnostic evaluation.
        </div>
      </div>
    </section>
  );
}
