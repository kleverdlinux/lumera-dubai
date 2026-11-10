import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../../utils/motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface FadeUpProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  href?: string;
}

export function FadeUp({
  as: Component = 'div',
  children,
  className = '',
  delay = 0,
  ...rest
}: FadeUpProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 24 });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: 'power2.out',
          });
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = Component as any;
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

export function useLineDraw() {
  useGSAP(() => {
    const elements = document.querySelectorAll('[data-line-draw]');
    const reduced = prefersReducedMotion();
    elements.forEach((el) => {
      if (reduced) {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 65%' },
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      } else {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 75%' },
          scaleX: 0,
          transformOrigin: 'left',
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  });
}
