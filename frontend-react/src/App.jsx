import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import HonestFramingStrip from './components/home/HonestFramingStrip';
import ModelIntelligence from './components/workstation/ModelIntelligence';
import AboutUs from './components/home/AboutUs';
import LungInsights from './components/home/LungInsights';
import PatientForm from './components/PatientForm';
import PredictionPanel from './components/PredictionPanel';
import ModelInfo from './components/ModelInfo';
import { INITIAL_FORM_STATE } from './constants/features';
import { checkHealth, getModelInfo, predictRisk } from './services/api';
import { ShieldCheck, Cpu, Activity } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [isModelInfoOpen, setIsModelInfoOpen] = useState(false);

  const [assessmentStage, setAssessmentStage] = useState('input'); // 'input' | 'processing' | 'result'

  // Poll backend health and model metadata on mount
  useEffect(() => {
    async function loadSystemStatus() {
      try {
        const health = await checkHealth();
        setSystemHealth(health);
      } catch (err) {
        setSystemHealth({ status: 'offline', error: err.message });
      }

      try {
        const info = await getModelInfo();
        setModelInfo(info);
      } catch (err) {
        // Fallback
      }
    }
    loadSystemStatus();
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setPredictionResult(null);
    setError(null);
    setAssessmentStage('input');
  };

  const handleBackToForm = () => {
    setAssessmentStage('input');
    setTimeout(() => {
      document.getElementById('assessment')?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 50);
  };

  const handleLoadPreset = (preset) => {
    setFormData(preset);
    setError(null);
  };

  const scrollToAssessment = () => {
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    setLoading(true);
    setAssessmentStage('processing');
    setError(null);

    // Immediately scroll viewport to top of #assessment:
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'auto', block: 'start' });

    // Yield to event loop so React paints the processing loading state before starting fetch:
    await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 50)));

    const minTimer = new Promise((resolve) => setTimeout(resolve, 2500));

    try {
      const [result] = await Promise.all([
        predictRisk(formData),
        minTimer,
      ]);
      setPredictionResult(result);
      setAssessmentStage('result');

      // Automatically move viewport to top of result report:
      document.getElementById('assessment')?.scrollIntoView({ behavior: 'auto', block: 'start' });
    } catch (err) {
      setError(err.message || 'Failed to generate risk prediction. Please ensure the backend server is reachable.');
      setAssessmentStage('input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pearl-100 text-ink-900 selection:bg-ink-900 selection:text-white font-sans antialiased">
      {/* 1. Global Navigation Bar */}
      <Navbar
        systemHealth={systemHealth}
        onOpenModelInfo={() => setIsModelInfoOpen(true)}
      />

      {/* AREA 1: DASHBOARD (Original Full Editorial Hero Canvas) */}
      <section id="dashboard" className="scroll-mt-20">
        <Hero />
        <HonestFramingStrip />
      </section>

      {/* AREA 2 & 3: DEDICATED WORKSTATION ASSESSMENT SECTION */}
      <section id="assessment" className="py-20 bg-white border-t border-pearl-300 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
          {/* Section Header & Status Chips */}
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-clinical-500/10 border border-clinical-500/30 text-caption font-mono text-clinical-800 uppercase tracking-widest font-extrabold shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-clinical-500 animate-pulse" />
              <span>CLINICAL RISK ASSESSMENT</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-4xl sm:text-6xl font-black text-ink-950 tracking-tight font-sans uppercase leading-[0.98]">
                Patient Assessment
              </h2>
              <h3 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-clinical-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent tracking-tight font-sans uppercase">
                Live Pulmonary Risk Intelligence
              </h3>
            </div>

            <p className="text-body-xl text-pearl-700 leading-relaxed font-normal max-w-3xl">
              Configure patient indicators and evaluate the frozen statistical classification model in real time.
            </p>

            {/* Premium System-Status Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 font-mono text-caption">
              <div className="px-3.5 py-1.5 rounded-full bg-white border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2 hover:border-pearl-400 transition-colors">
                <Cpu className="w-3.5 h-3.5 text-clinical-600" />
                <span>15 INPUT FEATURES</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-white border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2 hover:border-pearl-400 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-clinical-600" />
                <span>FROZEN LOGISTIC MODEL</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-white border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2 hover:border-pearl-400 transition-colors">
                <Activity className="w-3.5 h-3.5 text-clinical-600" />
                <span>STANDARDIZED INFERENCE</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-white border border-pearl-300 shadow-2xs font-extrabold text-ink-950 flex items-center space-x-2 hover:border-pearl-400 transition-colors">
                <span>THRESHOLD θ = 0.50</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs font-extrabold flex items-center space-x-2 hover:bg-emerald-100 transition-colors">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>LIVE API CONNECTION</span>
              </div>
            </div>
          </div>

          {/* DEDICATED 3-STAGE WORKSTATION VIEW CONTAINER */}
          {/* STATE 1: PATIENT PROFILE CONFIGURATION (INPUT VIEW) */}
          {assessmentStage === 'input' && !loading && (
            <div className="w-full space-y-6 animate-in fade-in duration-300">
              <PatientForm
                formData={formData}
                onChange={handleFieldChange}
                onReset={handleReset}
                onSubmit={handleSubmit}
                onLoadPreset={handleLoadPreset}
                loading={false}
                error={error}
              />
            </div>
          )}

          {/* STATE 2: MODEL PROCESSING EXPERIENCE (LOADING VIEW) */}
          {loading && (
            <div className="max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
              <PredictionPanel
                result={null}
                modelInfo={modelInfo}
                loading={true}
                formData={formData}
                onReset={handleReset}
              />
            </div>
          )}

          {/* STATE 3: DEDICATED MODEL RESULT EXPERIENCE (RESULT VIEW) */}
          {assessmentStage === 'result' && !loading && predictionResult && (
            <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
              {/* Result Stage Top Navigation Control */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-pearl-100 border border-pearl-300 shadow-sm font-mono text-caption">
                <button
                  type="button"
                  onClick={handleBackToForm}
                  className="py-3 px-5 rounded-xl bg-ink-950 text-white hover:bg-slate-800 font-extrabold flex items-center space-x-2 transition-all cursor-pointer shadow-md uppercase tracking-wider"
                >
                  <span>← Back to Assessment (Edit Patient Profile)</span>
                </button>
                <span className="text-pearl-600 font-bold">
                  All 15 patient parameters preserved
                </span>
              </div>

              {/* Dynamic Result Panel */}
              <PredictionPanel
                result={predictionResult}
                modelInfo={modelInfo}
                loading={false}
                formData={formData}
                onReset={handleReset}
                onBackToForm={handleBackToForm}
              />
            </div>
          )}
        </div>
      </section>

      {/* NEW LUNG INSIGHTS SECTION */}
      <LungInsights />

      {/* AREA 4: MODEL INTELLIGENCE & TRANSPARENCY */}
      <section id="ai-engine" className="py-20 bg-pearl-100 border-t border-pearl-300 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
          <ModelIntelligence
            predictionResult={predictionResult}
            formData={formData}
            modelInfo={modelInfo}
            onOpenModelInfo={() => setIsModelInfoOpen(true)}
          />
        </div>
      </section>

      {/* AREA 5: ABOUT LUNGSENSE */}
      <AboutUs onOpenModelInfo={() => setIsModelInfoOpen(true)} />

      {/* Global Application Footer */}
      <Footer onOpenModelInfo={() => setIsModelInfoOpen(true)} />

      {/* Model Metadata Modal */}
      <ModelInfo
        isOpen={isModelInfoOpen}
        onClose={() => setIsModelInfoOpen(false)}
        modelInfo={modelInfo}
      />
    </div>
  );
}
