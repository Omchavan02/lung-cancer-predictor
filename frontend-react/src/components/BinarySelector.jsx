import React from 'react';
import { Check, X } from 'lucide-react';

export default function BinarySelector({ label, description, value, onChange, id }) {
  const isYes = value === 2;
  const isNo = value === 1;

  return (
    <div
      className={`flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 min-h-[148px] ${
        isYes
          ? 'bg-gradient-to-br from-cyan-950/10 via-white to-sky-950/5 border-clinical-500/50 shadow-md ring-1 ring-clinical-500/20'
          : isNo
          ? 'bg-white/90 border-pearl-300/80 hover:border-pearl-400 shadow-2xs'
          : 'bg-white/70 border-pearl-200 hover:border-pearl-300'
      }`}
    >
      {/* Title & Subtitle */}
      <div className="mb-3 space-y-1">
        <label
          htmlFor={`${id}-toggle`}
          className="text-body-md font-extrabold text-ink-950 block cursor-pointer tracking-tight font-sans leading-snug"
        >
          {label}
        </label>
        {description && (
          <p className="text-caption text-pearl-600 font-normal leading-relaxed text-xs">
            {description}
          </p>
        )}
      </div>

      {/* Segmented Control (Equal Height & Equal Width) */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-pearl-200/80 border border-pearl-300/70 w-full mt-auto">
        <button
          type="button"
          id={`${id}-toggle-no`}
          onClick={() => onChange(1)}
          className={`h-9 px-3 rounded-lg text-caption font-mono font-bold flex items-center justify-center space-x-1.5 transition-all duration-200 cursor-pointer ${
            isNo
              ? 'bg-white text-ink-950 shadow-2xs border border-pearl-300 font-extrabold'
              : 'text-pearl-600 hover:text-ink-950 hover:bg-white/50'
          }`}
        >
          <X className={`w-3.5 h-3.5 ${isNo ? 'text-ink-950' : 'text-pearl-400'}`} />
          <span>NO / ABSENT</span>
        </button>

        <button
          type="button"
          id={`${id}-toggle-yes`}
          onClick={() => onChange(2)}
          className={`h-9 px-3 rounded-lg text-caption font-mono font-bold flex items-center justify-center space-x-1.5 transition-all duration-200 cursor-pointer ${
            isYes
              ? 'bg-gradient-to-r from-clinical-600 to-cyan-600 text-white shadow-md font-extrabold border border-clinical-500 shadow-clinical-500/20'
              : 'text-pearl-600 hover:text-ink-950 hover:bg-white/50'
          }`}
        >
          <Check className={`w-3.5 h-3.5 ${isYes ? 'text-cyan-200 font-bold' : 'text-pearl-400'}`} />
          <span>YES / PRESENT</span>
        </button>
      </div>
    </div>
  );
}
