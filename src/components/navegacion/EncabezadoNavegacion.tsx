// Barra de navegación fija superior con detección de scroll y control de menú
import React, { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { WhiteFillButton } from '../ui/AnimatedFillButton';
import StaggeredLink from '../ui/StaggeredLink';
import { useEnquiryModal } from '../modal';
import { MenuMovil } from './MenuMovil';
import { BotonHamburguesa } from './BotonHamburguesa';

export const ITEMS_NAVEGACION = [
  { label: 'Visión', target: '#about' },
  { label: 'Detalles', target: '#lumera-features' },
  { label: 'Residencias', target: '#project' },
  { label: 'Ubicación', target: '#highlights' },
];

export function EncabezadoNavegacion() {
  const lenis = useLenis();
  const { openEnquiryModal } = useEnquiryModal();

  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const [visibleAfterPreloader, setVisibleAfterPreloader] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('autostart') === '1';
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 150);
      if (currentY > lastScrollY.current && currentY > 100) {
        setHiddenOnScroll(true);
      } else if (currentY < lastScrollY.current) {
        setHiddenOnScroll(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (visibleAfterPreloader) return;
    const timer = setTimeout(() => setVisibleAfterPreloader(true), 3000);
    return () => clearTimeout(timer);
  }, [visibleAfterPreloader]);

  const scrollToTarget = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (lenis) {
      lenis.scrollTo(target, { duration: 2, offset: -75 });
    } else {
      const el = document.querySelector(target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 75;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-[5%] pt-[1vw] pb-[1vw] transform transition-all ease-in-out duration-500 max-[1025px]:px-[5%] max-[1025px]:py-[4%] ${
        !visibleAfterPreloader
          ? '-translate-y-full'
          : hiddenOnScroll
            ? '-translate-y-full max-[1025px]:translate-y-0'
            : 'translate-y-0'
      } ${scrolled ? 'bg-black/20 backdrop-blur-md shadow-md' : ''}`}
    >
      <div className="flex items-center justify-between">
        {/* Logotipo oficial de Lumera con retorno al inicio */}
        <a
          href="/templates/lumera"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="relative z-60 flex items-center gap-[0.6vw] max-[1025px]:gap-[2vw]"
        >
          <div className="h-fit w-40 max-md:w-30">
            <img
              src="/assets/media/lumera-logo.0ajsegxyytbih.webp"
              alt="Lumera Heights Dubai"
              width={230}
              height={52}
              className="h-full w-full object-contain"
            />
          </div>
        </a>

        {/* Navegación Desktop */}
        <nav className="flex items-center gap-[3vw] max-[1025px]:hidden">
          {ITEMS_NAVEGACION.map((item) => (
            <StaggeredLink
              key={item.label}
              text={item.label}
              href={item.target}
              onClick={(e) => scrollToTarget(e, item.target)}
              hoverColor="#ffffff"
              className="text-white/90"
              textClassName="font-body text-[1.15vw] tracking-wide"
            />
          ))}
        </nav>

        {/* Botón CTA "Cotizar Ahora" */}
        <div className="max-[1025px]:hidden">
          <WhiteFillButton
            link="#footer"
            btnText="Cotizar Ahora"
            onClick={(e) => {
              e.preventDefault();
              openEnquiryModal();
            }}
            className="min-w-0! w-50"
          />
        </div>

        {/* Botón Hamburguesa para Móvil y Tablet */}
        <BotonHamburguesa
          isOpen={mobileMenuOpen}
          onToggle={() => setMobileMenuOpen((prev) => !prev)}
        />
      </div>

      {/* Menú Desplegable Móvil a Pantalla Completa */}
      <MenuMovil
        open={mobileMenuOpen}
        items={ITEMS_NAVEGACION}
        onNavigate={scrollToTarget}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}

export default EncabezadoNavegacion;

