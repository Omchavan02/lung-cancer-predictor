import { useEffect, useRef, useState } from 'react';

export function useInView(options = { threshold: 0.2, once: true }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        if (options.once) observer.unobserve(node);
      } else if (!options.once) setVisible(false);
    }, { threshold: options.threshold ?? 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [options.once, options.threshold]);
  return [ref, visible];
}

export function CountUp({ value, decimals = 0, suffix = '', duration = 850 }) {
  const [ref, visible] = useInView();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!visible) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setDisplay(value); return undefined; }
    let frame; const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(value * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, value, visible]);
  return <span ref={ref}>{display.toFixed(decimals)}{suffix}</span>;
}
