import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { IMAGES } from '../../constants/images';

const slides = [
  {
    id: 'risk',
    tag: '01 // CLINICAL RISK INSTRUMENT',
    line1: 'AI-POWERED',
    line2: 'LUNG CANCER',
    highlight: 'RISK ASSESSMENT.',
    copy: 'A scientific literacy platform connecting clinical risk factors, pulmonary anatomy, and a transparent 15-feature machine learning classification model.',
    primaryCta: { label: 'Assess My Risk', href: '#assessment' },
    secondaryCta: { label: 'Explore AI Engine', href: '#ai-engine', icon: 'down' },
    image: IMAGES.hero,
    imageAlt: 'AI pulmonary neural network scan visualization',
    annotation: 'SPECM // 01 — NEURAL SIGNAL MATRIX',
    gradientBg: 'from-[#020712] via-[#081529] to-[#040D1C]',
    glowColor: 'rgba(56, 189, 248, 0.22)',
    glowSecondary: 'rgba(129, 140, 248, 0.12)',
    accentGradient: 'from-sky-300 via-cyan-200 to-indigo-300',
    accentTagBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  },
  {
    id: 'anatomy',
    tag: '02 // PULMONARY ANATOMY & PHYSIOLOGY',
    line1: 'UNDERSTAND',
    line2: 'LUNG HEALTH',
    highlight: 'THROUGH EVIDENCE.',
    copy: 'Discover how bronchial airways, lobes, and alveoli coordinate gas exchange, and learn how clinical symptoms relate to respiratory wellbeing.',
    primaryCta: { label: 'Explore Anatomy', href: '#ai-engine' },
    secondaryCta: { label: 'Assess My Risk', href: '#assessment', icon: 'right' },
    image: IMAGES.lungAnatomy,
    imageAlt: '3D Human pulmonary anatomical structure',
    annotation: 'SPECM // 02 — BRONCHIAL LOBAR ATLAS',
    gradientBg: 'from-[#010D14] via-[#06202D] to-[#03151F]',
    glowColor: 'rgba(45, 212, 191, 0.25)',
    glowSecondary: 'rgba(192, 132, 252, 0.10)',
    accentGradient: 'from-teal-300 via-emerald-300 to-cyan-200',
    accentTagBg: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
  },
  {
    id: 'factors',
    tag: '03 // EPIDEMIOLOGICAL RISK ASSOCIATIONS',
    line1: 'FACTORS THAT',
    line2: 'SHAPE RESPIRATORY',
    highlight: 'RISK PROFILES.',
    copy: 'Inspect model-fitted odds ratios for tobacco habit, environmental exposure, and clinical indicators without treating single variables as causal.',
    primaryCta: { label: 'Explore Risk Factors', href: '#ai-engine' },
    secondaryCta: { label: 'Assess My Risk', href: '#assessment', icon: 'right' },
    image: IMAGES.smokingRisk,
    imageAlt: 'Microscopic pulmonary cellular stress visualization',
    annotation: 'SPECM // 03 — MULTI-FACTOR CORRELATIONS',
    gradientBg: 'from-[#140608] via-[#260D13] to-[#16080B]',
    glowColor: 'rgba(248, 113, 113, 0.22)',
    glowSecondary: 'rgba(251, 191, 36, 0.12)',
    accentGradient: 'from-rose-400 via-amber-300 to-orange-300',
    accentTagBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  },
  {
    id: 'engine',
    tag: '04 // DETERMINISTIC AI PIPELINE',
    line1: 'TRACE HOW THE',
    line2: 'AI MODEL REACHES',
    highlight: 'ITS ESTIMATE.',
    copy: 'Trace how 15 raw survey inputs are standardized via StandardScaler and transformed through regularized logistic regression into a bounded probability score.',
    primaryCta: { label: 'Explore AI Engine', href: '#ai-engine' },
    secondaryCta: { label: 'Assess My Risk', href: '#assessment', icon: 'right' },
    image: IMAGES.aiNeuralNetwork,
    imageAlt: 'Computational neural network data matrix',
    annotation: 'SPECM // 04 — LOGISTIC REGRESSION MATRIX',
    gradientBg: 'from-[#080616] via-[#161038] to-[#0A071E]',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    glowSecondary: 'rgba(99, 102, 241, 0.14)',
    accentGradient: 'from-purple-400 via-violet-300 to-indigo-300',
    accentTagBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
];

const metricData = [
  { value: '309', label: 'SURVEY CASES', desc: 'Peer-reviewed dataset' },
  { value: '91.07%', label: 'HOLDOUT ACCURACY', desc: 'Unseen test partition (n=56)' },
  { value: '0.9392', label: 'PR-AUC METRIC', desc: 'True positive precision' },
];

const SLIDE_DURATION = 3000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const heroRef = useRef(null);

  // Unconditional 3000ms Autoplay Loop (0 -> 1 -> 2 -> 3 -> 0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrent((index + slides.length) % slides.length);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  // Touch / Swipe support
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
  };

  const activeSlide = slides[current];

  return (
    <section
      id="home"
      ref={heroRef}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      aria-label="LungSense Product Highlights Carousel"
      className={`relative min-h-[760px] lg:min-h-[820px] flex flex-col justify-between bg-gradient-to-br ${activeSlide.gradientBg} text-white overflow-hidden pt-28 pb-6 transition-colors duration-800 focus:outline-none`}
    >
      {/* Dynamic Radial Ambient Glow Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-800 ease-out"
        style={{
          background: `radial-gradient(circle at 70% 38%, ${activeSlide.glowColor} 0%, ${activeSlide.glowSecondary} 42%, transparent 75%)`,
        }}
      />

      {/* Fine Scientific Mesh Overlay */}
      <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />

      {/* Main Content & Track Wrapper */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full my-auto space-y-8 z-10 overflow-hidden">
        {/* Top Control Bar Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-xs font-mono text-[11px] font-bold uppercase tracking-widest border ${activeSlide.accentTagBg} transition-colors duration-500`}>
              {activeSlide.tag}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-caption font-mono text-white/70 font-extrabold tracking-widest">
              0{current + 1} / 0{slides.length}
            </span>
          </div>
        </div>

        {/* PHYSICAL FLEX CAROUSEL TRACK (All 4 slides positioned horizontally side-by-side) */}
        <div className="overflow-hidden w-full relative">
          <div
            className="flex w-full will-change-transform"
            style={{
              transform: `translate3d(-${current * 100}%, 0, 0)`,
              transition: 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {slides.map((slide, idx) => {
              const isActive = idx === current;
              return (
                <div
                  key={slide.id}
                  className="w-full shrink-0 flex-none min-w-full relative"
                  aria-hidden={!isActive}
                >
                  {/* Slide Viewport: Full-Bleed Artwork (Right side) + Content Grid (Left side) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[380px] lg:min-h-[400px] relative">
                    
                    {/* Slide Artwork Background Mask (Right 62%) */}
                    <div className="absolute top-0 right-0 w-full lg:w-[62%] h-full pointer-events-none overflow-hidden rounded-lg">
                      <img
                        src={slide.image}
                        alt={slide.imageAlt}
                        className="w-full h-full object-cover object-center mix-blend-screen opacity-75 lg:opacity-90"
                      />
                      {/* Vignette Gradients */}
                      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent lg:via-ink-950/45" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/50" />
                      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-transparent to-ink-950" />
                    </div>

                    {/* Left Column (7 cols): Editorial Typography */}
                    <div className="lg:col-span-7 space-y-5 relative z-10">
                      {/* Headline */}
                      <div className="space-y-0.5">
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.96] text-white uppercase font-sans">
                          <span className="block">{slide.line1}</span>
                          <span className="block text-white/85">{slide.line2}</span>
                          <span className={`block bg-gradient-to-r ${slide.accentGradient} bg-clip-text text-transparent`}>
                            {slide.highlight}
                          </span>
                        </h1>
                      </div>

                      {/* Sub-Lead Paragraph */}
                      <p className="text-body-lg sm:text-xl text-white/80 leading-relaxed max-w-xl font-normal font-sans">
                        {slide.copy}
                      </p>

                      {/* Dual Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                        <a
                          href={slide.primaryCta.href}
                          className="px-7 py-3.5 rounded-full bg-white text-ink-950 hover:bg-pearl-100 font-extrabold text-body-md flex items-center justify-center space-x-2.5 shadow-xl hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer"
                        >
                          <span>{slide.primaryCta.label}</span>
                          <ArrowRight className="w-4 h-4 text-ink-950" />
                        </a>

                        <a
                          href={slide.secondaryCta.href}
                          className="px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-body-md flex items-center justify-center space-x-2 backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-98"
                        >
                          <span>{slide.secondaryCta.label}</span>
                          {slide.secondaryCta.icon === 'down' ? (
                            <ChevronDown className="w-4 h-4 text-white/70" />
                          ) : (
                            <ArrowRight className="w-4 h-4 text-white/70" />
                          )}
                        </a>
                      </div>
                    </div>

                    {/* Right Column (5 cols): Floating Glass Annotation Badge */}
                    <div className="lg:col-span-5 hidden lg:flex flex-col items-end justify-center relative z-10">
                      <div className="p-5 rounded-sm bg-ink-950/50 backdrop-blur-xl border border-white/15 space-y-2 max-w-xs shadow-2xl">
                        <div className="flex items-center space-x-2 font-mono text-[11px] uppercase text-white/70 tracking-widest">
                          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span>LIVE RESEARCH CANVAS</span>
                        </div>
                        <p className="font-mono text-caption font-bold text-white tracking-wide">
                          {slide.annotation}
                        </p>
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
                          <span>FROZEN MODEL</span>
                          <span className="text-white font-bold">θ = 0.50</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation Strip & Synchronized 3000ms Progress Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10">
          {/* Slide Indicator Tabs */}
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto" role="tablist" aria-label="Hero slides">
            {slides.map((slide, idx) => {
              const isActive = current === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide 0${idx + 1}: ${slide.line1}`}
                  onClick={() => goToSlide(idx)}
                  className={`py-1.5 px-3.5 rounded-full transition-all text-caption font-mono cursor-pointer flex items-center space-x-2 ${
                    isActive
                      ? 'bg-white text-ink-950 font-extrabold shadow-lg'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                >
                  <span>0{idx + 1}</span>
                  <span className="hidden md:inline font-sans text-xs font-bold">{slide.id.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Prev/Next Controls & Synchronized 3s Progress Line */}
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="hidden lg:block w-36 h-1 bg-white/15 rounded-full overflow-hidden relative">
              <div
                key={`progress-bar-${current}`}
                className="h-full bg-white origin-left"
                style={{
                  animation: 'heroProgressBar 3000ms linear forwards',
                }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Integrated Factual Metrics Rail (Editorial Metadata Strip) */}
        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {metricData.map((metric, idx) => (
              <div key={metric.label} className={`${idx > 0 ? 'sm:pl-8 pt-3 sm:pt-0' : ''} space-y-0.5`}>
                <div className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {metric.value}
                </div>
                <div className="space-y-0.5">
                  <span className="text-caption font-mono font-bold tracking-widest text-white/90 block">
                    {metric.label}
                  </span>
                  <span className="text-caption text-white/60 block font-normal">
                    {metric.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar Keyframe Animation Definition */}
      <style>{`
        @keyframes heroProgressBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}
