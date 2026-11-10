import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const SHADOW_OFFSET = '1.3em';

interface StaggeredLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text?: string;
  href?: string;
  className?: string;
  textClassName?: string;
  linkProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  children?: React.ReactNode;
  staggerStep?: number;
  showLine?: boolean;
  lineClassName?: string;
  lineHeight?: string;
  lineBottom?: string;
  hoverColor?: string;
  showArrow?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconVariant?: 'stacked' | 'single';
  iconClassName?: string;
}

export default function StaggeredLink({
  text = 'Hover me',
  href = '#',
  className = '',
  textClassName = '',
  linkProps = {},
  children,
  staggerStep = 0.01,
  showLine = true,
  lineClassName = '',
  lineHeight = '1px',
  lineBottom = '15%',
  hoverColor = '#111111',
  showArrow = false,
  icon: Icon = ArrowRight,
  iconVariant = 'stacked',
  iconClassName = '',
  onClick,
  ...rest
}: StaggeredLinkProps) {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const touchedRef = useRef(false);
  const mountedRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = (e: MediaQueryList | MediaQueryListEvent) => {
      setReducedMotion('matches' in e ? e.matches : (e as any).currentTarget.matches);
    };
    if (mq) {
      update(mq);
      mq.addEventListener('change', update);
    }
    return () => mq?.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const lineEl = lineRef.current;
    if (!lineEl || hovered || reducedMotion) return;
    lineEl.style.transformOrigin = 'right center';
    const onEnd = () => {
      lineEl.style.transformOrigin = 'left center';
      lineEl.removeEventListener('transitionend', onEnd);
    };
    lineEl.addEventListener('transitionend', onEnd);
  }, [hovered, reducedMotion]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const content = text || el.getAttribute('data-text') || '';
    el.innerHTML = '';
    [...content].forEach((ch, idx) => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.display = 'inline-block';
      span.style.position = 'relative';
      span.style.textShadow = `0px ${SHADOW_OFFSET} currentColor`;
      span.style.transform = 'translateY(0em) rotate(0.001deg)';
      span.style.transition = reducedMotion
        ? 'none'
        : 'transform 0.6s cubic-bezier(0.625, 0.05, 0, 1)';
      span.style.willChange = 'transform';
      span.style.transitionDelay = reducedMotion ? '0s' : `${idx * staggerStep}s`;
      if (ch === ' ') {
        span.style.whiteSpace = 'pre';
      }
      el.appendChild(span);
    });
  }, [text, staggerStep, reducedMotion]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    Array.from(el.children).forEach((child) => {
      (child as HTMLElement).style.transform =
        hovered && !reducedMotion
          ? `translateY(-${SHADOW_OFFSET}) rotate(0.001deg)`
          : 'translateY(0em) rotate(0.001deg)';
    });
  }, [hovered, reducedMotion]);

  const handleMouseEnter = useCallback(() => {
    if (!touchedRef.current) setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!touchedRef.current) setHovered(false);
  }, []);

  const handleTouchStart = useCallback(() => {
    touchedRef.current = true;
    setHovered((prev) => !prev);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (touchedRef.current) e.preventDefault();
  }, []);

  const displayStr = typeof children === 'string' ? children : text;
  const mergedStyle: React.CSSProperties = {
    ...rest.style,
    color: hovered ? hoverColor : rest.style?.color,
  };

  return (
    <a
      href={href}
      {...linkProps}
      {...rest}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      style={mergedStyle}
      className={`inline-flex items-center gap-2 no-underline transition-colors duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] motion-reduce:transition-none max-[1025px]:motion-reduce:transition-none max-md:motion-reduce:transition-none ${className}`.trim()}
    >
      <div className="mt-[0.3vw]">
        <span
          className={['inline-block relative', showLine && 'w-fit', lineClassName]
            .filter(Boolean)
            .join(' ')}
        >
          <span
            ref={textRef}
            data-text={displayStr}
            className={`overflow-hidden relative inline-block leading-[1.2] max-[1025px]:text-[3vw] ${textClassName}`.trim()}
          >
            {displayStr}
          </span>
          {showLine && (
            <span
              ref={lineRef}
              aria-hidden="true"
              className="absolute left-0 w-full bg-current"
              style={{
                bottom: lineBottom,
                height: lineHeight,
                transform: `scaleX(${hovered && !reducedMotion ? 1 : 0})`,
                transformOrigin: 'left center',
                transition: reducedMotion
                  ? 'none'
                  : 'transform 0.5s cubic-bezier(0.625, 0.05, 0, 1)',
              }}
            />
          )}
        </span>
      </div>
      {showArrow && Icon && (
        <div
          className={`relative flex size-[1.18em] items-center justify-start overflow-hidden ${iconClassName}`.trim()}
        >
          {iconVariant === 'single' ? (
            <Icon className="size-[1.18em] shrink-0 motion-reduce:transition-none max-[1025px]:motion-reduce:transition-none max-md:motion-reduce:transition-none" />
          ) : (
            <>
              <Icon
                className={`size-[1.18em] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] motion-reduce:transition-none max-[1025px]:motion-reduce:transition-none max-md:motion-reduce:transition-none ${
                  hovered && !reducedMotion ? 'translate-x-full' : 'translate-x-0'
                }`}
              />
              <Icon
                aria-hidden="true"
                className={`absolute inset-0 size-[1.18em] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] motion-reduce:transition-none max-[1025px]:motion-reduce:transition-none max-md:motion-reduce:transition-none ${
                  hovered && !reducedMotion ? 'translate-x-0' : '-translate-x-full'
                }`}
              />
            </>
          )}
        </div>
      )}
    </a>
  );
}
