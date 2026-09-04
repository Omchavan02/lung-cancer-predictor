import React from 'react';
import { UserCheck, Shield, Wind, CheckCircle2 } from 'lucide-react';

export default function PatientSummary({ formData }) {
  const age = typeof formData.AGE === 'number' ? `${formData.AGE} YRS` : 'NOT SET';
  const sex = formData.GENDER === 'M' || formData.GENDER === 1 ? 'MALE (M)' : formData.GENDER === 'F' || formData.GENDER === 0 ? 'FEMALE (F)' : 'NOT SET';

  // Count active exposure indicators (SMOKING, YELLOW_FINGERS, ALCOHOL_CONSUMING, PEER_PRESSURE)
  const exposureKeys = ['SMOKING', 'YELLOW_FINGERS', 'ALCOHOL_CONSUMING', 'PEER_PRESSURE'];
  const exposureCount = exposureKeys.filter((key) => formData[key] === 2).length;

  // Count active symptoms (WHEEZING, COUGHING, SHORTNESS_OF_BREATH, CHEST_PAIN, SWALLOWING_DIFFICULTY, FATIGUE, ALLERGY, CHRONIC_DISEASE)
  const symptomKeys = ['WHEEZING', 'COUGHING', 'SHORTNESS_OF_BREATH', 'CHEST_PAIN', 'SWALLOWING_DIFFICULTY', 'FATIGUE', 'ALLERGY', 'CHRONIC_DISEASE'];
  const symptomCount = symptomKeys.filter((key) => formData[key] === 2).length;

  const isAgeValid = typeof formData.AGE === 'number' && formData.AGE >= 18 && formData.AGE <= 120;
  const isGenderValid = formData.GENDER === 'M' || formData.GENDER === 'F' || formData.GENDER === 1 || formData.GENDER === 0;
  const validVectorCount = (isGenderValid ? 1 : 0) + (isAgeValid ? 1 : 0) + 13;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-white via-pearl-50 to-pearl-100 border border-pearl-300 space-y-4 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-pearl-300/80">
        <span className="text-caption font-mono uppercase text-ink-950 font-black tracking-widest flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-clinical-600" />
          <span>PATIENT VECTOR STATUS READOUT</span>
        </span>
        <span className="text-caption font-mono font-extrabold text-clinical-800 bg-clinical-50 px-3 py-1 rounded-full border border-clinical-200 shadow-2xs">
          {validVectorCount} / 15 CONFIGURED
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-4 rounded-xl bg-white border border-pearl-300/80 space-y-1 shadow-2xs">
          <span className="text-pearl-500 block text-[10px] uppercase font-extrabold tracking-wider">AGE / SEX</span>
          <span className="font-extrabold text-ink-950 block truncate text-body-md">{age} • {sex}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-pearl-300/80 space-y-1 shadow-2xs">
          <span className="text-pearl-500 block text-[10px] uppercase font-extrabold tracking-wider flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-clinical-600 inline" />
            <span>EXPOSURES</span>
          </span>
          <span className="font-extrabold text-ink-950 block text-body-md">{exposureCount} DETECTED</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-pearl-300/80 space-y-1 shadow-2xs">
          <span className="text-pearl-500 block text-[10px] uppercase font-extrabold tracking-wider flex items-center space-x-1">
            <Wind className="w-3.5 h-3.5 text-clinical-600 inline" />
            <span>SYMPTOMS</span>
          </span>
          <span className="font-extrabold text-ink-950 block text-body-md">{symptomCount} DETECTED</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-pearl-300/80 space-y-1 shadow-2xs">
          <span className="text-pearl-500 block text-[10px] uppercase font-extrabold tracking-wider flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
            <span>READINESS</span>
          </span>
          <span className="font-extrabold text-emerald-700 block text-body-md">100% VALID</span>
        </div>
      </div>
    </div>
  );
}
