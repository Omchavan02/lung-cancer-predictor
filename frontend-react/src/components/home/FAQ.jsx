import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'What is LungSense?',
      a: 'LungSense is an educational pulmonary health intelligence and machine learning research platform. It connects clinical lung health background information with a peer-reviewed statistical classification model to demonstrate how demographic variables and symptom clusters relate to risk profiles.',
    },
    {
      q: 'Is this a medical diagnosis?',
      a: 'No. LungSense is strictly an academic research and educational demonstration. It is not a medical device, nor has it undergone diagnostic clinical trials. Predictions represent statistical probability calculations and must never be used as a substitute for professional clinical evaluation.',
    },
    {
      q: 'What does the 91.07% accuracy figure mean?',
      a: 'The 91.07% accuracy represents the proportion of correct classifications achieved by our frozen model on an unseen 56-patient holdout test set (51 correct out of 56). It reflects global model generalization across holdout data, not an individual patient diagnostic certainty.',
    },
    {
      q: 'What does the individual prediction probability mean?',
      a: 'The individual percentage is the posterior probability P(YES) calculated by the logistic sigmoid function for a specific feature combination. It is the output for one case, distinct from the overall 91.07% model test accuracy.',
    },
    {
      q: 'Why is the decision threshold set to 0.50?',
      a: 'Because class weighting ("balanced") was integrated directly into the optimization loss function during model training, the calibrated decision boundary cleanly aligns with the standard 0.50 threshold while achieving an 84.38% balanced accuracy and 75% minority class recall.',
    },
    {
      q: 'How does the machine learning pipeline operate?',
      a: 'The pipeline takes 15 survey inputs, standardizes them using frozen training parameters (mean and standard deviation), computes the dot-product with regularized logistic regression weights plus intercept (+0.8142), and converts the log-odds into a bounded probability via the sigmoid function.',
    },
    {
      q: 'What dataset was used to train the model?',
      a: 'The model was trained on a benchmark clinical survey dataset consisting of 276 unique records (after exact-duplicate deduplication) covering demographics and 13 binary respiratory indicators, evaluated using 25-fold Repeated Stratified Cross-Validation.',
    },
    {
      q: 'What are the main limitations of the platform?',
      a: 'The dataset relies on categorical survey indicators rather than radiological imaging (such as low-dose CT scans) or genetic biomarkers. The model provides statistical risk estimates for educational study and must not be used for diagnostic triage.',
    },
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 bg-pearl-100 border-t border-pearl-300">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="space-y-4 text-center">
          <div className="text-caption uppercase text-ink-800">
            Technical & Clinical Questions
          </div>
          <h2 className="text-display-lg font-extrabold text-ink-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-body-xl text-pearl-700 font-normal">
            Clear, transparent documentation regarding our methodology, data boundaries, and safety constraints.
          </p>
        </div>

        {/* Accordion Rows */}
        <div className="space-y-4 pt-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border-t border-pearl-300 pt-5 pb-5 transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className="text-headline font-bold text-ink-900 group-hover:text-ink-700">
                    {faq.q}
                  </span>
                  <span className="p-1 text-pearl-500 group-hover:text-ink-900 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-3 text-body-lg text-pearl-700 leading-relaxed font-normal animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
