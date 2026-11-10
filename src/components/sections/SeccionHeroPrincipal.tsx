// Componente SeccionHeroPrincipal: Portada con título principal, paralaje y estadísticas
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { WhiteFillButton, DarkOutlineFillButton } from '../ui/AnimatedFillButton';
import { useEnquiryModal } from '../EnquiryModal';
import OdometerValue from '../ui/OdometerValue';
import { FadeUp } from '../ui/FadeUp';
import SplitReveal from '../ui/SplitReveal';
import { prefersReducedMotion } from '../../utils/motion';

gsap.registerPlugin(ScrollTrigger);

// Estadísticas comerciales y arquitectónicas del rascacielos
const ESTADISTICAS_HERO = [
  { value: '$1.1M+', suffix: 'USD', label: 'Precio Desde' },
  { value: '80+', label: 'Pisos de Altura' },
  { value: '305+', suffix: 'm', label: 'Altura Total' },
  { value: '2027', suffix: 'Dic', label: 'Fecha de Entrega' },
];

export default function SeccionHeroPrincipal() {
  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const { openEnquiryModal } = useEnquiryModal();

  // Animaciones de entrada sincronizadas y efecto Parallax con ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Accesibilidad: respeta la preferencia de movimiento reducido del usuario
      if (prefersReducedMotion()) {
        if (document.querySelector('.hero-fadeup, .linedraw')) {
          gsap.set('.hero-fadeup, .linedraw', { clearProps: 'opacity,transform' });
        }
        if (bgParallaxRef.current) {
          gsap.set(bgParallaxRef.current, { yPercent: 0 });
        }
        return;
      }

      // Animación de aparición escalonada
      if (document.querySelector('.hero-fadeup')) {
        gsap.from('.hero-fadeup', {
          yPercent: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.01,
          delay: 2.5,
        });
      }

      // Animación de trazo de línea decorativa
      if (document.querySelector('.linedraw')) {
        gsap.from('.linedraw', {
          scrollTrigger: { trigger: '.linedraw', start: 'top 95%' },
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1,
          yPercent: 100,
          ease: 'power4.out',
          delay: 2.5,
        });
      }

      // Efecto Parallax en la fotografía panorámica de fondo
      if (bgParallaxRef.current) {
        gsap.fromTo(
          bgParallaxRef.current,
          { yPercent: 0 },
          {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: bgParallaxRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Navegación fluida hacia secciones internas
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
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
    <section id="hero" className="relative overflow-hidden">
      <div className="relative isolate flex min-h-[200vh] w-screen flex-col gap-[5vw] px-[5%] py-[3%] max-[1025px]:min-h-[240vw] max-[1025px]:gap-[8vw] max-[1025px]:py-[7%]">

        {/* Fondo fotográfico arquitectónico con Paralaje */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-[-1]">
          <div ref={bgParallaxRef} className="relative h-full w-full">
            <img
              src="/assets/media/hero.1vkt8ape_254z.webp"
              alt="Residencias de ultra lujo Lumera Heights en Dubái"
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        {/* Bloque Superior: Título Monumental y Botón Indicador de Scroll */}
        <div className="relative z-10 flex h-screen flex-col justify-end gap-[8vw] max-[1025px]:gap-[12vw]">
          <div className="flex flex-col gap-[3vw] max-[1025px]:gap-[6vw] mb-30">
            <SplitReveal delay={2} eager>
              <h1 className="font-heading font-medium! flex flex-col gap-[1vw] text-[10vw] leading-[0.94] uppercase text-[#EEEEEE] max-[1025px]:gap-[4vw] max-md:text-[12vw] max-[1025px]:text-[10vw]">
                <span>Excepcional</span>
                <div className="flex items-end gap-[1.8vw] max-[1025px]:flex-col max-[1025px]:items-start max-[1025px]:gap-[4vw]">
                  <span>Vida En Dubái</span>
                  {/* Botón circular con flecha que navega a #about */}
                  <FadeUp
                    as="a"
                    aria-label="Desplazarse a la sección de visión"
                    href="#about"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleScrollTo(e, '#about')}
                    className="group relative flex h-[6.5vw] w-[6.5vw] items-center justify-center self-center overflow-hidden rounded-full border-4 border-white text-white opacity-100 transition-colors max-[1025px]:h-[18vw] max-[1025px]:w-[18vw] max-[1025px]:self-start"
                  >
                    <img
                      src="/assets/media/arrow-down.14f_bny3qfvye.svg"
                      alt=""
                      className="absolute h-[2.3vw] w-auto object-contain transition-transform duration-500 ease-in-out group-hover:translate-y-[180%] max-[1025px]:h-[7vw]"
                    />
                    <img
                      src="/assets/media/arrow-down.14f_bny3qfvye.svg"
                      alt=""
                      className="absolute h-[2.3vw] w-auto translate-y-[-180%] object-contain transition-transform duration-500 ease-in-out group-hover:translate-y-0 max-[1025px]:h-[7vw]"
                    />
                  </FadeUp>
                </div>
              </h1>
            </SplitReveal>
          </div>
        </div>

        {/* Bloque Inferior: Subtítulo, Botones de Acción y Estadísticas Clave */}
        <div className="relative z-10 flex min-h-screen pb-20 flex-col justify-between gap-[8vw] max-[1025px]:min-h-[110vw] max-[1025px]:gap-[10vw]">
          <div className="flex flex-col gap-[4vw] max-[1025px]:gap-[8vw]">
            <div className="w-[38vw] text-white max-[1025px]:w-full">
              <SplitReveal>
                <p className="text-[1.45vw] max-[1025px]:text-[3vw] max-md:leading-[1.4] max-md:text-[5vw] leading-[1.65] text-[#EEEEEE]">
                  Una cuidada colección de residencias extraordinarias en los destinos más
                  selectos de Dubái, elegidas por su diseño, ubicación y estilo de vida.
                </p>
              </SplitReveal>
            </div>

            {/* Botones de Exploración y Contacto */}
            <div className="flex items-center gap-[1vw] max-md:flex-col max-md:items-start max-md:gap-[4vw] max-md:w-[80%] max-[1025px]:flex-wrap max-[1025px]:gap-[3vw]">
              <FadeUp delay={0.7}>
                <WhiteFillButton
                  link="#works"
                  btnText="Explorar Colección"
                  onClick={(e) => handleScrollTo(e, '#works')}
                  className="max-md:w-[70vw]"
                />
              </FadeUp>
              <FadeUp delay={0.7}>
                <DarkOutlineFillButton
                  link="#"
                  btnText="Hablar con Asesor"
                  onClick={(e) => {
                    e.preventDefault();
                    openEnquiryModal();
                  }}
                  className="border max-md:w-[70vw] border-white shadow-2xl drop-shadow-2xl"
                />
              </FadeUp>
            </div>
          </div>

          {/* Tarjetas Glassmorphism con Estadísticas e Indicadores Numéricos */}
          <div className="grid grid-cols-4 gap-[5vw] self-stretch max-[1025px]:grid-cols-2 max-md:gap-[3vw] max-[1025px]:gap-[3vw]">
            {ESTADISTICAS_HERO.map((stat) => (
              <FadeUp
                key={stat.label}
                className="rounded-[1.2vw] bg-white/5 px-[1.5vw] py-[2vw] max-md:py-[5vw] max-[1025px]:py-[4vw] font-heading text-center backdrop-blur-2xl max-[1025px]:rounded-[4vw] flex flex-col justify-between max-md:min-h-[12vh] min-h-[19vh] border border-[#F9F9F91A]"
              >
                <p className="inline-flex items-end justify-center gap-[0.25vw] text-[2.9vw] font-medium leading-none text-white max-[1025px]:gap-[1vw] max-[1025px]:text-[6vw]">
                  <OdometerValue value={stat.value} />
                  {stat.suffix && (
                    <span className="mb-[0.15vw] text-[0.75vw] font-normal leading-none max-[1025px]:mb-[0.4vw] max-[1025px]:text-[2.5vw]">
                      {stat.suffix}
                    </span>
                  )}
                </p>
                <p className="text-[1.1vw] text-white max-[1025px]:text-[3vw]">{stat.label}</p>
              </FadeUp>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

