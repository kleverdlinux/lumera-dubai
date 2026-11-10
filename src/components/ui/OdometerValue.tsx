import React, { memo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../utils/motion';

gsap.registerPlugin(ScrollTrigger);

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface DigitScrollerProps {
  digit: string;
  index: number;
  duration?: number;
  stagger?: number;
  triggerRef: React.RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
  className?: string;
}

const DigitScroller = memo(function DigitScroller({
  digit,
  index,
  duration = 1.5,
  stagger = 0.1,
  triggerRef,
  reducedMotion = false,
  className = '',
}: DigitScrollerProps) {
  const colRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (
      reducedMotion ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ||
      !colRef.current ||
      !triggerRef.current
    ) {
      return;
    }
    const targetNum = parseInt(digit, 10);
    if (Number.isNaN(targetNum)) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        colRef.current,
        { yPercent: 0 },
        {
          yPercent: -(100 * targetNum),
          duration,
          ease: 'power2.out',
          delay: index * stagger,
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }, triggerRef);

    return () => ctx.revert();
  }, [digit, duration, index, reducedMotion, stagger, triggerRef]);

  if (reducedMotion) {
    return (
      <span
        className={`inline-flex h-[1em] w-[0.64em] items-center justify-center leading-none ${className}`}
      >
        {digit}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex h-[1em] w-[0.64em] overflow-hidden align-baseline leading-none ${className}`}
    >
      <span ref={colRef} className="flex flex-col will-change-transform">
        {DIGITS.map((d) => (
          <span
            key={d}
            className="flex h-[1em] items-center justify-center leading-none"
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
});

interface OdometerValueProps {
  value: string;
  className?: string;
  duration?: number;
  stagger?: number;
  children?: React.ReactNode;
}

export default function OdometerValue({
  value,
  className = '',
  duration = 1.5,
  stagger = 0.08,
  children,
}: OdometerValueProps) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLSpanElement | null>(null);

  return (
    <span ref={containerRef} className={`inline-flex items-end ${className}`}>
      {value.split('').map((ch, idx) =>
        /\d/.test(ch) ? (
          <DigitScroller
            key={`${ch}-${idx}`}
            digit={ch}
            index={idx}
            duration={duration}
            stagger={stagger}
            triggerRef={containerRef}
            reducedMotion={reducedMotion}
          />
        ) : (
          <span key={`${ch}-${idx}`} className="leading-none">
            {ch}
          </span>
        )
      )}
      {children}
    </span>
  );
}
