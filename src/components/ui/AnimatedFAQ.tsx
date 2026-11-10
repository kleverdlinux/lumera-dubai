import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface FAQItemContextValue {
  isOpen: boolean;
  contentOuterRef: React.RefObject<HTMLDivElement | null>;
  contentInnerRef: React.RefObject<HTMLDivElement | null>;
  contentId: string;
  buttonId: string;
  titleClassName: string;
  contentClassName: string;
  iconClassName: string;
  iconSize: number;
  iconStrokeWidth: number;
}

interface FAQGroupContextValue {
  allowMultiple: boolean;
  openItems: string[];
  toggleItem: (id: string) => void;
}

const FAQItemContext = createContext<FAQItemContextValue | null>(null);
const FAQGroupContext = createContext<FAQGroupContextValue | null>(null);

const useFAQItem = () => {
  const ctx = useContext(FAQItemContext);
  if (!ctx) {
    throw new Error('FAQTitle and FAQContent must be used inside FAQWrapper.');
  }
  return ctx;
};

interface FAQGroupProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  value?: string[];
  onChange?: (items: string[]) => void;
}

export function FAQGroup({
  children,
  allowMultiple = false,
  defaultOpenItems = [],
  value,
  onChange,
}: FAQGroupProps) {
  const isControlled = Array.isArray(value);
  const [internalOpen, setInternalOpen] = useState<string[]>(defaultOpenItems);
  const openItems = isControlled ? value! : internalOpen;

  const toggleItem = useCallback(
    (id: string) => {
      const isAlreadyOpen = openItems.includes(id);
      const next = allowMultiple
        ? isAlreadyOpen
          ? openItems.filter((item) => item !== id)
          : [...openItems, id]
        : isAlreadyOpen
        ? []
        : [id];
      if (!isControlled) {
        setInternalOpen(next);
      }
      onChange?.(next);
    },
    [allowMultiple, isControlled, onChange, openItems]
  );

  const contextValue = useMemo(
    () => ({ allowMultiple, openItems, toggleItem }),
    [allowMultiple, openItems, toggleItem]
  );

  return <FAQGroupContext.Provider value={contextValue}>{children}</FAQGroupContext.Provider>;
}

interface FAQWrapperProps {
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
  iconSize?: number;
  iconStrokeWidth?: number;
  duration?: number;
  defaultOpen?: boolean;
  controlledOpen?: boolean;
  onToggle?: (open: boolean) => void;
  itemId?: string;
}

export function FAQWrapper({
  children,
  className = '',
  titleClassName = '',
  contentClassName = '',
  iconClassName = '',
  iconSize = 18,
  iconStrokeWidth = 2,
  duration = 0.45,
  defaultOpen = false,
  controlledOpen,
  onToggle,
  itemId,
}: FAQWrapperProps) {
  const groupCtx = useContext(FAQGroupContext);
  const fallbackId = useId();
  const id = itemId ?? fallbackId;
  const isControlled = typeof controlledOpen === 'boolean';
  const [localOpen, setLocalOpen] = useState(defaultOpen);

  const isOpen = groupCtx
    ? groupCtx.openItems.includes(id)
    : isControlled
    ? controlledOpen!
    : localOpen;

  const contentOuterRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const lastHeightRef = useRef(0);
  const reducedMotionRef = useRef(
    typeof window !== 'undefined' &&
      (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false)
  );
  const contentId = useId();
  const buttonId = useId();

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    reducedMotionRef.current = media.matches;
    media.addEventListener?.('change', handler);
    return () => media.removeEventListener?.('change', handler);
  }, []);

  const handleToggle = () => {
    if (groupCtx) {
      groupCtx.toggleItem(id);
      onToggle?.(!isOpen);
      return;
    }
    if (isControlled) {
      onToggle?.(!controlledOpen);
    } else {
      setLocalOpen((prev) => {
        const next = !prev;
        onToggle?.(next);
        return next;
      });
    }
  };

  useLayoutEffect(() => {
    if (!contentOuterRef.current || !contentInnerRef.current) return;
    const outer = contentOuterRef.current;
    const inner = contentInnerRef.current;
    gsap.killTweensOf([outer, inner]);
    const dur = reducedMotionRef.current ? 0 : duration;

    if (isOpen) {
      gsap.set(outer, { overflow: 'hidden', height: 'auto' });
      const targetHeight = outer.scrollHeight;
      lastHeightRef.current = targetHeight;
      gsap.set(outer, { height: 0 });
      gsap.fromTo(
        outer,
        { height: 0 },
        {
          height: targetHeight,
          duration: dur,
          ease: 'cubic.out',
          onComplete: () => {
            gsap.set(outer, { height: 'auto', overflow: 'visible' });
          },
        }
      );
    } else {
      gsap.set(outer, { overflow: 'hidden' });
      gsap.fromTo(
        outer,
        { height: lastHeightRef.current },
        { height: 0, duration: dur, ease: 'cubic.out' }
      );
    }

    return () => {
      gsap.killTweensOf([outer, inner]);
    };
  }, [isOpen, duration]);

  return (
    <FAQItemContext.Provider
      value={{
        isOpen,
        contentOuterRef,
        contentInnerRef,
        contentId,
        buttonId,
        titleClassName,
        contentClassName,
        iconClassName,
        iconSize,
        iconStrokeWidth,
      }}
    >
      <div
        className={`cursor-pointer ${className}`}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={buttonId}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (!target.closest('a, button, input, textarea, select')) {
            handleToggle();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {children}
      </div>
    </FAQItemContext.Provider>
  );
}

interface FAQTitleProps {
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  iconMode?: 'plus' | 'rotate-left-down' | 'rotate';
}

export function FAQTitle({
  children,
  className = '',
  showIcon = true,
  iconPosition = 'right',
  iconMode = 'rotate',
}: FAQTitleProps) {
  const { isOpen, titleClassName, iconClassName, iconSize, iconStrokeWidth } = useFAQItem();

  const iconEl = showIcon ? (
    <div className={`shrink-0 ${iconClassName}`}>
      {iconMode === 'plus' ? (
        <span className="relative flex h-full w-full items-center justify-center" aria-hidden="true">
          <span className="absolute h-[1.5px] w-[40%] bg-current" />
          <span
            className={`absolute h-[1.5px] w-[40%] bg-current transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${
              isOpen ? 'rotate-0' : 'rotate-90'
            }`}
          />
        </span>
      ) : iconMode === 'rotate-left-down' ? (
        <ChevronRight
          size={iconSize}
          strokeWidth={iconStrokeWidth}
          className={`transition-transform duration-300 ease-out motion-reduce:transition-none ${
            isOpen ? 'rotate-90' : 'rotate-0'
          }`}
          aria-hidden="true"
        />
      ) : (
        <ChevronDown
          size={iconSize}
          strokeWidth={iconStrokeWidth}
          className={`transition-transform duration-300 ease-out motion-reduce:transition-none ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          aria-hidden="true"
        />
      )}
    </div>
  ) : null;

  return (
    <div className={`flex w-full items-center justify-between gap-6 ${titleClassName} ${className}`}>
      {iconPosition === 'left' ? (
        <>
          {iconEl}
          <div className="flex-1">{children}</div>
        </>
      ) : (
        <>
          <div className="flex-1">{children}</div>
          {iconEl}
        </>
      )}
    </div>
  );
}

interface FAQContentProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export function FAQContent({ children, className = '', innerClassName = '' }: FAQContentProps) {
  const { isOpen, contentOuterRef, contentInnerRef, contentId, buttonId, contentClassName } =
    useFAQItem();

  return (
    <div
      id={contentId}
      ref={contentOuterRef}
      role="region"
      aria-labelledby={buttonId}
      style={{ height: isOpen ? 'auto' : 0, overflow: isOpen ? 'visible' : 'hidden' }}
      className={contentClassName}
    >
      <div ref={contentInnerRef} className={className}>
        <div className={innerClassName}>{children}</div>
      </div>
    </div>
  );
}

export const AnimatedFAQ = {
  Group: FAQGroup,
  Wrapper: FAQWrapper,
  Title: FAQTitle,
  Content: FAQContent,
};

export default AnimatedFAQ;
