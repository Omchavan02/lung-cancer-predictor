import React from 'react';

export default function FormSection({ title, description, children }) {
  return (
    <div className="rounded-sm bg-white border border-pearl-300 p-6 space-y-4 shadow-subtle">
      <div className="pb-3 border-b border-pearl-300">
        <h3 className="text-meta font-bold uppercase tracking-wider text-ink-900">
          {title}
        </h3>
        {description && (
          <p className="text-caption text-pearl-600 font-normal mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
