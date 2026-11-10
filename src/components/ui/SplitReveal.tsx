import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { prefersReducedMotion } from '../../utils/motion';

gsap.registerPlugin(SplitText, ScrollTrigger);

interface SplitRevealProps {
  children?: React.ReactNode;
  animateOnScroll?: boolean;
  stagger?: number;
  duration?: number;
  delay?: number;
  className?: string;
  scrub?: boolean;
  eager?: boolean;
}

const defaultChild = <p className="text-2xl">Pull the words from the noise.</p>;

export default function SplitReveal({
  children = defaultChild,
  animateOnScroll = true,
  stagger = 0.2,
  duration = 5.5,
  delay = 0,
  className = '',
  scrub = false,
  eager = false,
}: SplitRevealProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const splitsRef = useRef<any[]>([]);
  const linesRef = useRef<HTMLElement[]>([]);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    let fontTimeout: number | undefined;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    splitsRef.current = [];
    linesRef.current = [];
    triggersRef.current = [];

    const childElements = Array.from(wrapper.children) as HTMLElement[];
    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const exposeAria = (el: HTMLElement | null) => {
      if (el) {
        el.querySelectorAll('[aria-hidden="true"]').forEach((node) =>
          node.setAttribute('aria-hidden', 'false')
        );
      }
    };

    const applyMaskStyle = (lineEl: HTMLElement) => {
      if (lineEl) {
        lineEl.style.maskSize = '500% 100%';
        lineEl.style.maskImage =
          'linear-gradient(150deg, #e8e8e8 33.3%, rgba(255, 255, 255, 0) 66.6%)';
        (lineEl.style as any).webkitMaskSize = '500% 100%';
        (lineEl.style as any).webkitMaskImage =
          'linear-gradient(150deg, #e8e8e8 33.3%, rgba(255, 255, 255, 0) 66.6%)';
      }
    };

    (async () => {
      await new Promise<void>((resolve) => {
        const rect = wrapper.getBoundingClientRect();
        if (
          rect.top < 1.5 * window.innerHeight &&
          rect.bottom > -window.innerHeight
        ) {
          resolve();
        } else {
          observer = new IntersectionObserver(
            ([entry], obs) => {
              if (entry.isIntersecting) {
                obs.disconnect();
                observer = null;
                resolve();
              }
            },
            { rootMargin: '200% 0px' }
          );
          observer.observe(wrapper);
        }
      });

      if (cancelled) return;

      if (!eager) {
        await new Promise<void>((resolve) => {
          const fonts = document.fonts;
          if (!fonts) {
            resolve();
            return;
          }
          let done = false;
          const finish = () => {
            if (!done) {
              done = true;
              window.clearTimeout(fontTimeout);
              resolve();
            }
          };
          const { fontFamily, fontWeight, fontSize } = getComputedStyle(wrapper);
          try {
            fonts.load(`${fontWeight} ${fontSize} ${fontFamily}`).then(finish, finish);
          } catch {
            fonts.ready.then(finish, finish);
          }
          fontTimeout = window.setTimeout(finish, 300);
        });
      }

      if (cancelled) return;

      exposeAria(wrapper);

      if (prefersReducedMotion()) {
        if (eager) return;
        gsap.set(wrapper, { opacity: 0 });
        const tween = gsap.to(wrapper, {
          opacity: 1,
          duration: Math.min(duration, 0.4),
          delay,
          ease: 'power1.out',
          scrollTrigger: animateOnScroll
            ? { trigger: wrapper, start: 'top 80%', once: true }
            : undefined,
        });
        if (tween?.scrollTrigger) {
          triggersRef.current.push(tween.scrollTrigger);
        }
        return;
      }

      childElements.forEach((child) => {
        const split = SplitText.create(child, {
          type: 'lines',
          linesClass: 'Headingline++',
          lineThreshold: 0.1,
        });
        splitsRef.current.push(split);
        const textIndent = getComputedStyle(child).textIndent;
        if (textIndent && textIndent !== '0px' && split.lines.length > 0) {
          (split.lines[0] as HTMLElement).style.paddingLeft = textIndent;
          child.style.textIndent = '0';
        }
        (split.lines as HTMLElement[]).forEach(applyMaskStyle);
        exposeAria(child);
        linesRef.current.push(...(split.lines as HTMLElement[]));
      });

      if (!linesRef.current.length) return;

      gsap.set(wrapper, { opacity: 1 });
      gsap.set(linesRef.current, { maskPosition: '100% 100%', webkitMaskPosition: '100% 100%' });

      const animVars = {
        maskPosition: '0% 100%',
        webkitMaskPosition: '0% 100%',
        stagger,
        duration,
        ease: 'power3.out',
        delay,
      };

      if (animateOnScroll) {
        const tween = gsap.to(linesRef.current, {
          ...animVars,
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            once: !scrub,
            scrub,
            onEnter: () => childElements.forEach(exposeAria),
          },
        });
        if (tween?.scrollTrigger) {
          triggersRef.current.push(tween.scrollTrigger);
        }
      } else {
        gsap.to(linesRef.current, animVars);
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(fontTimeout);
      observer?.disconnect();
      triggersRef.current.forEach((t) => t?.kill());
      triggersRef.current = [];
      splitsRef.current.forEach((s) => s?.revert());
      splitsRef.current = [];
      linesRef.current = [];
    };
  }, [animateOnScroll, delay, duration, scrub, stagger, eager]);

  return (
    <div
      ref={wrapperRef}
      data-copy-wrapper="true"
      className={`${eager ? '' : 'opacity-0'} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
