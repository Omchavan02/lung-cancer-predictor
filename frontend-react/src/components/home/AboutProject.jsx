import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function AboutProject() {
  const stack = [
    { name: 'React 18 & Vite', category: 'Frontend Architecture', desc: 'Component-based responsive single page application with Tailwind CSS styling.' },
    { name: 'FastAPI 0.115', category: 'Backend REST API', desc: 'Asynchronous Python microservice providing deterministic prediction endpoints.' },
    { name: 'Scikit-Learn 1.5', category: 'Machine Learning Core', desc: 'StandardScaler normalization and cost-sensitive regularized Logistic Regression.' },
    { name: 'Uvicorn ASGI', category: 'Inference Server', desc: 'High-throughput local web server delivering sub-15ms response latencies.' },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-white border-t border-pearl-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-caption uppercase text-ink-800">
            Engineering & Methodology
          </div>
          <h2 className="text-display-xl font-extrabold text-ink-900 tracking-tight">
            About the Academic Architecture
          </h2>
          <p className="text-body-xl text-pearl-700 leading-relaxed font-normal">
            Built following rigorous clinical data science protocols: complete parameter freezing, cross-validation isolation, and mathematical interpretability.
          </p>
        </div>

        {/* 4 Unboxed Stack Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stack.map((item, idx) => (
            <div
              key={idx}
              className="border-t border-pearl-300 pt-5 space-y-2 group"
            >
              <span className="text-caption font-mono uppercase text-ink-800 block">
                {item.category}
              </span>
              <h3 className="text-headline font-bold text-ink-900">
                {item.name}
              </h3>
              <p className="text-body-md text-pearl-700 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Core Principles Summary Row */}
        <div className="p-8 rounded-sm bg-pearl-100 border border-pearl-300 space-y-4 shadow-subtle">
          <h3 className="text-headline font-bold text-ink-900">
            Core Engineering & Data Integrity Guarantees:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-meta text-pearl-700">
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-ink-900 shrink-0 mt-0.5" />
              <span><strong>Frozen Dataset:</strong> Byte-for-byte SHA256 integrity verified throughout pipeline development.</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-ink-900 shrink-0 mt-0.5" />
              <span><strong>Zero Data Leakage:</strong> Normalization parameters fit exclusively on training folds during cross-validation.</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-ink-900 shrink-0 mt-0.5" />
              <span><strong>Deterministic Local Inference:</strong> Constant-time matrix operations with zero third-party cloud data transmission.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
