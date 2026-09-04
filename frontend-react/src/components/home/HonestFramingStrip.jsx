import React from 'react';
import { ShieldCheck, Database, AlertCircle } from 'lucide-react';

export default function HonestFramingStrip() {
  return (
    <section className="bg-pearl-100 border-y border-pearl-300 py-4">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center text-caption text-pearl-700">
          {/* Statement 1: Academic Model */}
          <div className="flex items-center justify-center md:justify-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-clinical-600 shrink-0" />
            <span className="font-normal">
              <strong className="text-ink-900 font-semibold">Academic Research Model</strong> — Not a medical device.
            </span>
          </div>

          {/* Statement 2: Verified Dataset */}
          <div className="flex items-center justify-center space-x-2.5 border-t md:border-t-0 md:border-l border-pearl-300 pt-2 md:pt-0 md:pl-6">
            <Database className="w-4 h-4 text-clinical-600 shrink-0" />
            <span className="font-normal">
              Trained on <strong className="text-ink-900 font-semibold font-mono">309 survey cases</strong> from peer-reviewed data.
            </span>
          </div>

          {/* Statement 3: Non-Diagnostic Disclaimer */}
          <div className="flex items-center justify-center md:justify-end space-x-2.5 border-t md:border-t-0 md:border-l border-pearl-300 pt-2 md:pt-0 md:pl-6">
            <AlertCircle className="w-4 h-4 text-clinical-600 shrink-0" />
            <span className="font-normal">
              <strong className="text-ink-900 font-semibold">Not a Diagnosis</strong> — Consult a qualified physician.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
