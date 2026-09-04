import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Shield, Heart, FileText, UserCheck, ArrowRight, X, Sparkles, CheckCircle2, Info, BookOpen } from 'lucide-react';

const INSIGHT_MODULES = [
  {
    id: 'diseases',
    num: '01',
    category: 'PATHOLOGY & AIRWAYS',
    title: 'Lung Diseases & Airway Disorders',
    shortDesc: 'Structural and functional conditions affecting respiratory airways, lung tissue, and pulmonary gas exchange.',
    icon: Activity,
    badge: 'FEATURED MODULE',
    featured: true,
    detail: {
      overview: 'Lung diseases encompass a broad spectrum of conditions affecting the airways, alveolar parenchyma, and pulmonary vasculature. Understanding how structural changes impact gas exchange is fundamental to respiratory medicine.',
      keyPoints: [
        'Obstructive conditions (e.g., COPD, asthma) involve narrowed airways that impede exhalation.',
        'Restrictive diseases limit lung expansion, reducing total lung capacity and vital capacity.',
        'Parenchymal & interstitial disorders cause structural changes in alveolar tissue and membranes.',
        'Neoplastic processes involve abnormal cell proliferation requiring specialized clinical imaging and histopathology.'
      ],
      clinicalContext: 'Structural changes in the bronchial tree directly influence gas exchange efficiency. Identifying persistent alterations early supports appropriate diagnostic evaluation.',
      actionNote: 'Educational concept only — not a clinical diagnosis or personal risk score.'
    }
  },
  {
    id: 'warning-signs',
    num: '02',
    category: 'SYMPTOMATOLOGY',
    title: 'Warning Signs & Clinical Manifestations',
    shortDesc: 'Key persistent respiratory indicators that warrant professional clinical assessment.',
    icon: AlertTriangle,
    badge: 'CLINICAL INDICATOR',
    featured: false,
    detail: {
      overview: 'Respiratory symptoms are the primary clinical signals of underlying airway or parenchymal changes. Recognizing persistent or evolving manifestations allows for timely medical evaluation.',
      keyPoints: [
        'Persistent Cough: A cough lasting longer than 3–8 weeks should be evaluated by a healthcare professional.',
        'Unexplained Shortness of Breath: Exertional dyspnea or breathlessness at rest indicates altered pulmonary mechanics.',
        'Localized Chest Discomfort: Pain exacerbated by deep inspiration or coughing warrants clinical examination.',
        'Hemoptysis & Systemic Fatigue: Blood-tinged sputum or unexplained lethargy requires prompt medical consultation.'
      ],
      clinicalContext: 'Individual symptoms alone do not establish a diagnosis. However, combinations of persistent indicators provide essential context during clinical consultation.',
      actionNote: 'If you experience sudden or severe shortness of breath, seek immediate emergency medical care.'
    }
  },
  {
    id: 'risk-factors',
    num: '03',
    category: 'ETIOLOGY & EXPOSURE',
    title: 'Primary Risk Factors & Exposures',
    shortDesc: 'Environmental exposures, tobacco history, age baselines, and chronic pulmonary conditions.',
    icon: Shield,
    badge: 'EXPOSURE MATRIX',
    featured: false,
    detail: {
      overview: 'Pulmonary risk profiles are shaped by a combination of cumulative environmental exposures, behavioral habits, demographic factors, and underlying health history.',
      keyPoints: [
        'Tobacco Smoke: Active smoking and prolonged secondhand smoke remain the leading preventable risk factors for pulmonary pathology.',
        'Environmental & Occupational Hazards: Exposure to asbestos, silica, radon gas, diesel exhaust, and industrial particulate matter.',
        'Advanced Age: Chronological age (>60 years) correlates with cumulative cellular exposure and natural changes in lung elasticity.',
        'Pre-Existing Conditions: History of chronic bronchitis, emphysema, or pulmonary fibrosis increases baseline susceptibility.'
      ],
      clinicalContext: 'Risk factors act cumulatively over time. Assessing exposure duration and intensity provides a more accurate picture than single data points alone.',
      actionNote: 'Identifying personal risk factors empowers informed discussions with primary care physicians.'
    }
  },
  {
    id: 'prevention',
    num: '04',
    category: 'PREVENTIVE CARE',
    title: 'Prevention Strategies & Lung Protection',
    shortDesc: 'Proactive measures to preserve pulmonary reserve and reduce environmental damage.',
    icon: Heart,
    badge: 'WELLNESS PROTOCOL',
    featured: false,
    detail: {
      overview: 'Protecting lung health involves minimizing harmful exposures, adopting protective lifestyle habits, and maintaining regular preventive medical care.',
      keyPoints: [
        'Tobacco Cessation: Discontinuing tobacco use at any stage yields immediate and long-term improvements in respiratory function.',
        'Air Quality Management: Minimizing indoor air pollutant exposure, testing home radon levels, and avoiding high-smog environments.',
        'Occupational Protection: Using recommended respiratory protection equipment (PPE) when working around airborne dusts or chemicals.',
        'Immunization & Fitness: Keeping influenza and pneumococcal vaccinations current while maintaining regular aerobic physical activity.'
      ],
      clinicalContext: 'Preventive intervention provides the highest return on long-term respiratory reserve and overall cardiovascular vitality.',
      actionNote: 'Consult healthcare providers for evidence-based cessation programs and preventive screening schedules.'
    }
  },
  {
    id: 'diagnostics',
    num: '05',
    category: 'DIAGNOSTIC PATHWAYS',
    title: 'Diagnostic Evaluations & Imaging',
    shortDesc: 'Clinical tools used by medical professionals to evaluate respiratory function and structure.',
    icon: FileText,
    badge: 'CLINICAL TOOLS',
    featured: false,
    detail: {
      overview: 'Modern pulmonary medicine relies on a structured sequence of objective diagnostic evaluations to examine airway function, tissue architecture, and cellular characteristics.',
      keyPoints: [
        'Pulmonary Function Testing (PFTs): Spirometry measures forced expiratory volume (FEV1) and forced vital capacity (FVC).',
        'Low-Dose Computed Tomography (LDCT): High-resolution cross-sectional imaging recommended for eligible high-risk populations.',
        'Chest Radiography: Initial screening tool to detect pulmonary opacities, lobar consolidation, or pleural effusions.',
        'Histopathology & Bronchoscopy: Direct airway visualization and tissue biopsy for definitive anatomical and cellular diagnosis.'
      ],
      clinicalContext: 'Diagnostic tools are prescribed and interpreted by qualified physicians based on individual clinical presentation and medical history.',
      actionNote: 'LungSense provides AI-assisted statistical risk estimation, not diagnostic imaging or biopsy analysis.'
    }
  },
  {
    id: 'care-next-steps',
    num: '06',
    category: 'CLINICAL MANAGEMENT',
    title: 'Care Management & Next Steps',
    shortDesc: 'Recommended pathways for discussing concerning symptoms with healthcare providers.',
    icon: UserCheck,
    badge: 'PATIENT PATHWAY',
    featured: false,
    detail: {
      overview: 'Navigating lung health decisions is best accomplished through open communication with primary care physicians and pulmonology specialists.',
      keyPoints: [
        'Document Symptom History: Track symptom onset, frequency, intensity, and triggering factors prior to your appointment.',
        'Compile Exposure Timeline: Prepare details regarding smoking history (pack-years) and occupational environment exposure.',
        'Engage Qualified Clinicians: Discuss whether personalized diagnostic evaluation or LDCT screening is recommended.',
        'Establish Routine Monitoring: Schedule periodic clinical follow-ups to monitor respiratory status over time.'
      ],
      clinicalContext: 'Collaborative care between patients and clinical teams ensures diagnostic thoroughness and personalized management plans.',
      actionNote: 'Always consult a licensed medical professional for personal health concerns or diagnostic decisions.'
    }
  }
];

export default function LungInsights() {
  const [activeModule, setActiveModule] = useState(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModule(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (activeModule) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModule]);

  return (
    <section id="lung-insights" className="py-20 bg-pearl-100 border-t border-pearl-300 scroll-mt-20 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-clinical-500/10 border border-clinical-500/30 text-caption font-mono text-clinical-800 uppercase tracking-widest font-extrabold shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-clinical-500 animate-pulse" />
            <span>KNOWLEDGE // PULMONARY HEALTH</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-4xl sm:text-6xl font-black text-ink-950 tracking-tight font-sans uppercase leading-[0.98]">
              Lung Health Intelligence
            </h2>
          </div>

          <p className="text-body-xl text-pearl-700 leading-relaxed font-normal max-w-3xl">
            Explore clinically relevant lung-health concepts, warning signs, risk factors, prevention strategies, and diagnostic pathways through an interactive knowledge layer.
          </p>

          {/* Technical Metadata Indicators */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 font-mono text-caption">
            <div className="px-3.5 py-1.5 rounded-full bg-white border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2">
              <BookOpen className="w-3.5 h-3.5 text-clinical-600" />
              <span>06 KNOWLEDGE MODULES</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-white border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2">
              <Info className="w-3.5 h-3.5 text-clinical-600" />
              <span>CLINICAL CONTEXT</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-clinical-50 text-clinical-800 border border-clinical-300 shadow-2xs font-extrabold flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-clinical-600" />
              <span>RESEARCH-ORIENTED</span>
            </div>
          </div>
        </div>

        {/* 6 Interactive Insight Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {INSIGHT_MODULES.map((module) => {
            const Icon = module.icon;
            const isFeatured = module.featured;

            return (
              <div
                key={module.id}
                onClick={() => setActiveModule(module)}
                className={`group cursor-pointer rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative overflow-hidden border ${
                  isFeatured
                    ? 'bg-gradient-to-br from-white via-cyan-50/40 to-sky-50/60 border-clinical-500/50 shadow-lg hover:shadow-xl hover:-translate-y-1 ring-1 ring-clinical-500/20 md:col-span-2 lg:col-span-1'
                    : 'bg-white border-pearl-300 hover:border-clinical-400 shadow-md hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Top Card Bar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-8 h-8 rounded-lg bg-ink-950 text-white font-mono font-black text-caption flex items-center justify-center shrink-0 shadow-sm">
                        {module.num}
                      </span>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-pearl-600">
                        {module.category}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-md border ${
                        isFeatured
                          ? 'bg-clinical-600 text-white border-clinical-700 shadow-2xs'
                          : 'bg-pearl-100 text-pearl-700 border-pearl-300'
                      }`}
                    >
                      {module.badge}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-extrabold text-ink-950 tracking-tight font-sans group-hover:text-clinical-700 transition-colors leading-snug">
                        {module.title}
                      </h3>
                      <div className="p-2.5 rounded-xl bg-pearl-100/80 group-hover:bg-clinical-50 text-clinical-600 transition-colors shrink-0 border border-pearl-200">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-caption text-pearl-600 font-normal leading-relaxed">
                      {module.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Affordance */}
                <div className="pt-6 mt-6 border-t border-pearl-200/80 flex items-center justify-between text-caption font-mono font-bold text-ink-950">
                  <span className="group-hover:text-clinical-700 transition-colors flex items-center space-x-1.5">
                    <span>EXPLORE INSIGHT</span>
                  </span>
                  <div className="w-7 h-7 rounded-full bg-pearl-100 group-hover:bg-clinical-600 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-2xs">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Insight Area (Pulmonary Health Note) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-ink-950 via-slate-900 to-ink-950 text-white border border-white/15 shadow-xl relative overflow-hidden space-y-4">
          <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-clinical-400 animate-ping" />
              <span className="text-caption font-mono uppercase font-bold text-clinical-300 tracking-widest">
                PULMONARY HEALTH NOTE
              </span>
            </div>
            <span className="text-caption font-mono font-extrabold text-pearl-300 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              CLINICAL CONTEXT
            </span>
          </div>

          <p className="text-body-xl sm:text-2xl font-bold font-sans text-white leading-relaxed relative z-10 max-w-4xl">
            “Persistent respiratory symptoms deserve attention, particularly when they are new, worsening, or unexplained.”
          </p>

          <p className="text-caption text-pearl-300 font-mono relative z-10">
            Proactive clinical evaluation and transparent symptom documentation are the foundation of early pulmonary risk management.
          </p>
        </div>

        {/* Methodological Disclaimer */}
        <div className="text-center pt-2">
          <p className="text-caption font-mono text-pearl-600 max-w-2xl mx-auto leading-relaxed">
            Educational information only. LungSense provides AI-assisted statistical risk assessment and does not replace professional medical evaluation or diagnosis.
          </p>
        </div>
      </div>

      {/* Interactive Intelligence Module Modal */}
      {activeModule && (
        <div className="fixed inset-x-0 bottom-0 top-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full border border-pearl-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-ink-950 via-slate-900 to-ink-950 text-white space-y-3 relative shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-clinical-500/20 text-clinical-300 text-[10px] font-mono font-extrabold uppercase border border-clinical-500/30">
                    MODULE {activeModule.num} // {activeModule.category}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModule(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                {activeModule.title}
              </h3>
              <p className="text-caption text-pearl-300 font-normal">
                {activeModule.shortDesc}
              </p>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-ink-950">
              {/* Overview */}
              <div className="space-y-2">
                <h4 className="text-caption font-mono uppercase font-black text-clinical-700 tracking-wider">
                  OVERVIEW & PHYSIOLOGY
                </h4>
                <p className="text-body-md text-pearl-800 leading-relaxed font-normal">
                  {activeModule.detail.overview}
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-3">
                <h4 className="text-caption font-mono uppercase font-black text-clinical-700 tracking-wider">
                  KEY CLINICAL TAKEAWAYS
                </h4>
                <div className="space-y-2.5">
                  {activeModule.detail.keyPoints.map((point, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-pearl-50 border border-pearl-200 text-caption text-ink-950 flex items-start space-x-3 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Context Box */}
              <div className="p-4 rounded-xl bg-clinical-50 border-l-4 border-clinical-600 space-y-1">
                <span className="text-[10px] font-mono uppercase font-extrabold text-clinical-800 block tracking-wider">
                  CLINICAL CONTEXT
                </span>
                <p className="text-caption text-ink-950 font-normal leading-relaxed">
                  {activeModule.detail.clinicalContext}
                </p>
              </div>

              {/* Action Note */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-caption font-mono flex items-start space-x-2.5 leading-relaxed">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Clinical Notice:</strong> {activeModule.detail.actionNote}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-pearl-50 border-t border-pearl-200 flex items-center justify-between shrink-0 font-mono text-caption">
              <span className="text-pearl-600">LUNGSENSE KNOWLEDGE BASE</span>
              <button
                type="button"
                onClick={() => setActiveModule(null)}
                className="px-5 py-2.5 rounded-xl bg-ink-950 hover:bg-slate-800 text-white font-bold transition-all cursor-pointer shadow-md"
              >
                Close Module
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
