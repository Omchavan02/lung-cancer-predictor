import React, { useEffect, useId, useState } from 'react';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';

const navigation = [
  { label: 'Dashboard', id: 'dashboard' },
  { label: 'Assessment', id: 'assessment' },
  { label: 'Lung Insights', id: 'lung-insights' },
  { label: 'AI Engine', id: 'ai-engine' },
  { label: 'About Us', id: 'about' },
];

export default function Navbar({ onOpenModelInfo }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const drawerId = useId();

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 20);
      const current = navigation.find(({ id }) => {
        const section = document.getElementById(id);
        if (!section) return false;
        const { top, bottom } = section.getBoundingClientRect();
        return top <= 140 && bottom > 140;
      });
      if (current) setActive(current.id);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const escape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, []);

  const navigate = (id) => {
    setActive(id);
    setMenuOpen(false);
    window.history.replaceState(null, '', `#${id}`);
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink-950/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3'
          : 'bg-gradient-to-b from-ink-950/80 via-ink-950/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between min-h-[52px]">
        {/* Brand Lockup */}
        <button
          type="button"
          onClick={() => navigate('dashboard')}
          className="flex items-center space-x-3.5 group text-left focus:outline-none cursor-pointer"
          aria-label="LungSense home"
        >
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-clinical-500 via-clinical-600 to-ink-900 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-clinical-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-sans">
                LungSense
              </span>
              <span className="px-2 py-0.5 rounded-xs bg-white/10 text-[10px] font-mono font-bold uppercase tracking-wider text-clinical-300 border border-white/15">
                RESEARCH
              </span>
            </div>
            <span className="text-[11px] font-mono text-pearl-400 block tracking-wide font-normal">
              Pulmonary Risk Intelligence Platform
            </span>
          </div>
        </button>

        {/* Center Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1 border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full shadow-inner">
          {navigation.map(({ label, id }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigate(id)}
                className={`relative px-4 py-2 text-base font-semibold transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/15 shadow-sm font-bold'
                    : 'text-pearl-300 hover:text-white hover:bg-white/5'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{label}</span>
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-clinical-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Desktop CTA */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate('assessment')}
            className="px-6 py-3 rounded-full bg-white text-ink-950 hover:bg-pearl-100 font-extrabold text-base flex items-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer"
          >
            <span>Start Risk Assessment</span>
            <ArrowRight className="w-4 h-4 text-ink-950" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="lg:hidden p-2.5 rounded-sm bg-white/10 text-white border border-white/15 focus:outline-none"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls={drawerId}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <div
        id={drawerId}
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 border-b border-white/10 bg-ink-950/95 backdrop-blur-xl' : 'max-h-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="px-6 py-6 space-y-4">
          <span className="text-caption font-mono uppercase tracking-widest text-pearl-400 block">
            Research Navigation
          </span>
          <div className="flex flex-col space-y-2">
            {navigation.map(({ label, id }, idx) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(id)}
                className={`flex items-center justify-between p-3 rounded-sm font-semibold text-base transition-colors ${
                  active === id ? 'bg-white/15 text-white font-bold' : 'text-pearl-300 hover:text-white'
                }`}
              >
                <span>{label}</span>
                <span className="font-mono text-xs text-pearl-400">0{idx + 1}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('assessment')}
            className="w-full py-3.5 rounded-sm bg-white text-ink-950 font-extrabold text-base flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Start Risk Assessment</span>
            <ArrowRight className="w-4 h-4 text-ink-950" />
          </button>
        </div>
      </div>
    </nav>
  );
}
