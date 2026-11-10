// Contenedor modal con animación GSAP, fondo desenfocado y control de scroll
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLenis } from 'lenis/react';
import { X } from 'lucide-react';
import { prefersReducedMotion } from '../../utils/motion';
import { EnquiryModalContext } from './ContextoModal';
import { FormularioCotizacion } from './FormularioCotizacion';

gsap.registerPlugin(useGSAP);

export function ModalCotizacion({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [prevOpen, setPrevOpen] = useState(isOpen);

  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    setIsClosing(!isOpen && prevOpen);
  }

  const shouldRender = isOpen || isClosing;

  const openEnquiryModal = useCallback(() => setIsOpen(true), []);
  const closeEnquiryModal = useCallback(() => setIsOpen(false), []);

  useGSAP(
    () => {
      const backdrop = backdropRef.current;
      const dialog = dialogRef.current;
      if (!backdrop || !dialog) return;
      timelineRef.current?.kill();

      const reduced = prefersReducedMotion();
      const dur = reduced ? 0.2 : isOpen ? 0.7 : 0.5;
      const ease = reduced ? 'none' : isOpen ? 'power3.out' : 'power2.in';

      if (isOpen) {
        const tl = gsap.timeline();
        timelineRef.current = tl;
        tl.fromTo(backdrop, { opacity: 0 }, { opacity: 0.7, duration: dur, ease }).fromTo(
          dialog,
          { opacity: 0, scale: reduced ? 1 : 0.8 },
          { opacity: 1, scale: 1, duration: dur, ease },
          0
        );
        return;
      }

      const tl = gsap.timeline({ onComplete: () => setIsClosing(false) });
      timelineRef.current = tl;
      tl.to(backdrop, { opacity: 0, duration: dur, ease }).to(
        dialog,
        { opacity: 0, scale: reduced ? 1 : 0.8, duration: dur, ease },
        0
      );
    },
    { dependencies: [isOpen], revertOnUpdate: false }
  );

  useEffect(() => () => void timelineRef.current?.kill(), []);

  useEffect(() => {
    if (!shouldRender) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEnquiryModal();
    };
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    lenis?.stop?.();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      lenis?.start?.();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender, lenis, closeEnquiryModal]);

  const contextValue = useMemo(
    () => ({ openEnquiryModal, closeEnquiryModal }),
    [openEnquiryModal, closeEnquiryModal]
  );

  return (
    <EnquiryModalContext.Provider value={contextValue}>
      {children}
      {shouldRender && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center px-[4%] py-[3vw] max-[1025px]:items-start max-[1025px]:overflow-y-auto max-[1025px]:py-[8vw]"
          role="dialog"
          aria-modal="true"
          aria-label="Formulario de consulta Lumera Heights"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEnquiryModal();
          }}
        >
          <div
            ref={backdropRef}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 bg-black backdrop-blur-sm will-change-[opacity]"
          />
          <div
            ref={dialogRef}
            style={{ opacity: 0, transform: 'scale(0.8)' }}
            className="relative h-auto max-h-[92vh] w-full max-w-[58vw] rounded-[1.4vw] bg-white p-[2.2vw] shadow-2xl will-change-[transform,opacity] max-[1200px]:max-w-[72vw] max-[1025px]:max-w-[88vw] max-[1025px]:max-h-[90vh] max-[1025px]:overflow-y-auto max-[1025px]:rounded-[3vw] max-[1025px]:p-[5vw] max-md:max-w-[94vw] max-md:p-[6vw]"
          >
            <button
              type="button"
              aria-label="Cerrar formulario"
              onClick={closeEnquiryModal}
              className="absolute top-[1.8vw] right-[1.8vw] z-20 flex h-[2.5vw] w-[2.5vw] min-h-[34px] min-w-[34px] items-center justify-center rounded-full bg-[#1c1b1a] text-white transition-all duration-300 hover:rotate-180 hover:bg-black max-[1025px]:top-[4vw] max-[1025px]:right-[4vw] max-[1025px]:h-[8vw] max-[1025px]:w-[8vw]"
            >
              <X
                className="h-[1.1vw] w-[1.1vw] min-h-[16px] min-w-[16px] max-[1025px]:h-[3.8vw] max-[1025px]:w-[3.8vw]"
                strokeWidth={1.8}
              />
            </button>
            <FormularioCotizacion />
          </div>
        </div>
      )}
    </EnquiryModalContext.Provider>
  );
}

// Aliases para compatibilidad hacia atrás
export { ModalCotizacion as EnquiryModalProvider };
export default ModalCotizacion;

