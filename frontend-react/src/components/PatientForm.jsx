import React, { useState } from 'react';
import { RotateCcw, AlertCircle, CheckCircle2, Shield, User, Activity, Wind, AlertTriangle, Sparkles, Sliders } from 'lucide-react';
import BinarySelector from './BinarySelector';
import PatientSummary from './workstation/PatientSummary';
import { FEATURE_GROUPS, POSITIVE_REFERENCE_PROFILE, NEGATIVE_REFERENCE_PROFILE } from '../constants/features';

const GROUP_METADATA = {
  behavioral: {
    num: '02',
    icon: Shield,
    title: 'EXPOSURE & BEHAVIORAL INDICATORS',
    desc: 'Environmental particulate exposure, tobacco habits, and behavioral risk factors.',
  },
  respiratory: {
    num: '03',
    icon: Wind,
    title: 'RESPIRATORY & BREATH SYMPTOMS',
    desc: 'Clinical symptoms affecting lower airway mechanics and gas exchange.',
  },
  upper_airway: {
    num: '04',
    icon: Activity,
    title: 'UPPER AIRWAY & THROAT SYMPTOMS',
    desc: 'Upper airway constriction, vocal cord irritation, and swallowing dysphagia.',
  },
  clinical: {
    num: '05',
    icon: AlertTriangle,
    title: 'SYSTEMIC CLINICAL SIGNS',
    desc: 'Thoracic wall sensations and systemic musculoskeletal clinical indicators.',
  },
};

export default function PatientForm({
  formData,
  onChange,
  onReset,
  onSubmit,
  onLoadPreset,
  loading,
  error,
}) {
  const [activePreset, setActivePreset] = useState(null);

  const handleGenderChange = (genderVal) => {
    onChange('GENDER', genderVal);
    setActivePreset(null);
  };

  const handleAgeChange = (e) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onChange('AGE', '');
      return;
    }
    const val = parseFloat(rawVal);
    onChange('AGE', isNaN(val) ? '' : val);
    setActivePreset(null);
  };

  const handlePresetSelect = (profile, name, type) => {
    onLoadPreset(profile);
    setActivePreset(type);
  };

  // Calculate dynamic completion percentage
  const totalFields = 15;
  const isAgeValid = typeof formData.AGE === 'number' && formData.AGE >= 18 && formData.AGE <= 120;
  const isGenderValid = formData.GENDER === 'M' || formData.GENDER === 'F' || formData.GENDER === 1 || formData.GENDER === 0;

  const surveyCount = 13;
  const validCount = (isGenderValid ? 1 : 0) + (isAgeValid ? 1 : 0) + surveyCount;
  const completionPercent = Math.round((validCount / totalFields) * 100);

  return (
    <form onSubmit={onSubmit} className="space-y-8 relative pb-28 lg:pb-0">
      {/* Reference Profiles Header Module */}
      <div className="p-6 rounded-2xl bg-white border border-pearl-300 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-caption font-mono font-black text-clinical-700 uppercase tracking-widest block">
              REFERENCE PROFILES & CONTEXT
            </span>
            <h3 className="text-xl font-extrabold tracking-tight text-ink-950 mt-0.5 font-sans">
              Configure Patient Profile Vector
            </h3>
            <p className="text-caption text-pearl-600 font-normal">
              Set 15 clinical parameters for real-time inference against our regularized model.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => handlePresetSelect(POSITIVE_REFERENCE_PROFILE, 'High-risk symptomatic profile', 'positive')}
              className={`px-4 py-2.5 rounded-xl text-caption font-mono font-bold transition-all cursor-pointer border ${
                activePreset === 'positive'
                  ? 'bg-rose-50 text-risk-high border-rose-300 shadow-md font-extrabold ring-2 ring-rose-500/20'
                  : 'bg-pearl-100/90 hover:bg-pearl-200 text-ink-950 border-pearl-300'
              }`}
            >
              HIGH-RISK SAMPLE
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect(NEGATIVE_REFERENCE_PROFILE, 'Low-risk asymptomatic control', 'control')}
              className={`px-4 py-2.5 rounded-xl text-caption font-mono font-bold transition-all cursor-pointer border ${
                activePreset === 'control'
                  ? 'bg-emerald-50 text-risk-low border-emerald-300 shadow-md font-extrabold ring-2 ring-emerald-500/20'
                  : 'bg-pearl-100/90 hover:bg-pearl-200 text-ink-950 border-pearl-300'
              }`}
            >
              CONTROL SAMPLE
            </button>
          </div>
        </div>

        {activePreset && (
          <div className="border-l-2 border-clinical-500 bg-clinical-50/90 px-4 py-3 text-caption text-ink-950 animate-in fade-in rounded-xl flex items-center justify-between font-mono">
            <span>
              <strong>REFERENCE VECTOR ACTIVE</strong> — {activePreset === 'positive' ? 'Symptomatic positive case loaded' : 'Asymptomatic control case loaded'}
            </span>
            <span className="text-clinical-700 font-bold bg-white px-2 py-0.5 rounded-md border border-clinical-200">15/15 READY</span>
          </div>
        )}

        {/* Validation Error Notice */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start space-x-3 text-caption leading-relaxed animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-risk-high shrink-0 mt-0.5" />
            <div>
              <strong className="text-risk-high font-bold">Validation Notice: </strong>
              {error}
            </div>
          </div>
        )}
      </div>

      {/* 01. Demographics Card */}
      <div className="rounded-2xl bg-white border border-pearl-300 p-6 space-y-6 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-pearl-300/80">
          <div className="flex items-center space-x-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-ink-950 to-slate-900 text-white font-mono font-black text-caption flex items-center justify-center shrink-0 shadow-sm">
              01
            </span>
            <div>
              <h3 className="text-meta font-black tracking-tight text-ink-950 uppercase font-sans flex items-center space-x-2">
                <User className="w-4 h-4 text-clinical-600" />
                <span>PATIENT PROFILE DEMOGRAPHICS</span>
              </h3>
              <p className="text-caption text-pearl-600 font-normal">
                Biological sex and chronological age baseline parameters.
              </p>
            </div>
          </div>

          <span className="font-mono text-caption font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            2 / 2 READY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Biological Sex Segmented Control */}
          <div className="p-5 rounded-xl bg-pearl-100/70 border border-pearl-300 space-y-3">
            <label className="text-caption font-extrabold text-ink-950 uppercase tracking-widest block font-mono">
              BIOLOGICAL SEX (GENDER)
            </label>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Biological sex selection">
              <button
                type="button"
                role="radio"
                aria-checked={formData.GENDER === 'M' || formData.GENDER === 1}
                onClick={() => handleGenderChange('M')}
                className={`py-3.5 px-4 rounded-lg text-caption font-mono font-extrabold border transition-all cursor-pointer ${
                  formData.GENDER === 'M' || formData.GENDER === 1
                    ? 'bg-gradient-to-r from-ink-950 to-slate-900 text-white border-ink-950 shadow-md font-black'
                    : 'bg-white text-pearl-700 border-pearl-300 hover:border-pearl-400'
                }`}
              >
                ♂ MALE (M)
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={formData.GENDER === 'F' || formData.GENDER === 0}
                onClick={() => handleGenderChange('F')}
                className={`py-3.5 px-4 rounded-lg text-caption font-mono font-extrabold border transition-all cursor-pointer ${
                  formData.GENDER === 'F' || formData.GENDER === 0
                    ? 'bg-gradient-to-r from-ink-950 to-slate-900 text-white border-ink-950 shadow-md font-black'
                    : 'bg-white text-pearl-700 border-pearl-300 hover:border-pearl-400'
                }`}
              >
                ♀ FEMALE (F)
              </button>
            </div>
          </div>

          {/* Prominent Patient Age Control */}
          <div className="p-5 rounded-xl bg-pearl-100/70 border border-pearl-300 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="patient-age" className="text-caption font-extrabold text-ink-950 uppercase tracking-widest block font-mono">
                PATIENT AGE
              </label>
              <span className="text-2xl font-black font-mono text-ink-950 tracking-tight">
                {isAgeValid ? `${formData.AGE} YEARS` : 'AGE NOT SET'}
              </span>
            </div>

            <div className="space-y-3">
              <input
                id="patient-age"
                type="number"
                min="18"
                max="120"
                value={formData.AGE}
                onChange={handleAgeChange}
                placeholder="e.g. 60"
                className="w-full bg-white border border-pearl-300 rounded-lg px-4 py-2.5 text-body-md font-bold text-ink-950 focus:outline-none focus:ring-2 focus:ring-clinical-500 font-mono shadow-2xs"
              />
              <input
                type="range"
                min="18"
                max="120"
                value={typeof formData.AGE === 'number' ? formData.AGE : 60}
                onChange={handleAgeChange}
                className="w-full h-2 bg-pearl-300 rounded-lg appearance-none cursor-pointer accent-clinical-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 02–05. Open Grouped Symptom Cards (2-Column Desktop Grid) */}
      {FEATURE_GROUPS.map((group) => {
        const meta = GROUP_METADATA[group.id] || {
          num: '00',
          icon: Shield,
          title: group.title.toUpperCase(),
          desc: group.description,
        };
        const GroupIcon = meta.icon;
        const configuredCount = group.features.filter(
          (feature) => formData[feature.id] === 1 || formData[feature.id] === 2
        ).length;

        return (
          <div key={group.id} className="rounded-2xl bg-white border border-pearl-300 p-6 space-y-6 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-pearl-300/80">
              <div className="flex items-center space-x-3">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-ink-950 to-slate-900 text-white font-mono font-black text-caption flex items-center justify-center shrink-0 shadow-sm">
                  {meta.num}
                </span>
                <div>
                  <h3 className="text-meta font-black tracking-tight text-ink-950 uppercase font-sans flex items-center space-x-2">
                    <GroupIcon className="w-4 h-4 text-clinical-600" />
                    <span>{meta.title}</span>
                  </h3>
                  <p className="text-caption text-pearl-600 font-normal">
                    {meta.desc}
                  </p>
                </div>
              </div>

              <span className="font-mono text-caption font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {configuredCount} / {group.features.length} READY
              </span>
            </div>

            {/* 3-Column Desktop Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {group.features.map((feature) => (
                <BinarySelector
                  key={feature.id}
                  id={feature.id}
                  label={feature.label}
                  description={feature.desc}
                  value={formData[feature.id]}
                  onChange={(val) => {
                    onChange(feature.id, val);
                    setActivePreset(null);
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Live Patient Vector Summary Readout */}
      <PatientSummary formData={formData} />

      {/* Completion Status & High-Impact Action Bar */}
      <div className="rounded-2xl bg-white border border-pearl-300 p-6 sm:p-8 space-y-6 shadow-md">
        {/* Animated Progress Bar */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-caption font-mono font-bold">
            <span className="text-pearl-700 flex items-center space-x-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
              <span>PROFILE COMPLETION: {validCount} OF {totalFields} FEATURES READY</span>
            </span>
            <span className="text-ink-950 font-black text-body-md">{completionPercent}% COMPLETE</span>
          </div>
          <div className="w-full h-3 rounded-full bg-pearl-200 overflow-hidden p-0.5 border border-pearl-300">
            <div
              className="h-full bg-gradient-to-r from-clinical-600 via-cyan-600 to-emerald-500 transition-all duration-500 rounded-full shadow-sm"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* High-Impact Primary Action Button */}
        <div className="hidden lg:flex items-center space-x-4 pt-2">
          <button
            type="submit"
            disabled={loading || !isAgeValid}
            className="flex-1 py-5 px-8 rounded-2xl text-body-lg font-black text-ink-950 bg-white hover:bg-cyan-50/50 border-2 border-clinical-500 hover:border-clinical-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 cursor-pointer tracking-wider font-sans uppercase"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-3 border-clinical-600/30 border-t-clinical-600 rounded-full animate-spin" />
                <span>ANALYZING PATIENT VECTOR...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-clinical-600 animate-pulse" />
                <span>✦ GENERATE AI RISK PREDICTION</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="py-5 px-6 rounded-2xl text-meta font-bold text-pearl-800 bg-pearl-100 hover:bg-pearl-200 border border-pearl-300 focus:outline-none flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98 font-mono uppercase shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-pearl-600" />
            <span>Reset Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile Sticky Action Bar (< lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-ink-950/95 backdrop-blur-md p-4 border-t border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center space-x-3">
          <button
            type="submit"
            disabled={loading || !isAgeValid}
            className="flex-1 py-4 px-5 rounded-xl text-body-md font-black text-ink-950 bg-white hover:bg-cyan-50/50 border-2 border-clinical-500 hover:border-clinical-600 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer active:scale-98 uppercase font-sans tracking-wide transition-all"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-clinical-600/30 border-t-clinical-600 rounded-full animate-spin" />
                <span>Evaluating Model...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-clinical-600" />
                <span>GENERATE PREDICTION</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            aria-label="Reset profile"
            className="p-4 rounded-xl bg-white/10 text-white border border-white/15 hover:bg-white/20 cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
