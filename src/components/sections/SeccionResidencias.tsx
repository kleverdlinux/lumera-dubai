// Componente SeccionResidencias: Catálogo de residencias con scroll horizontal fijado
import React, { useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import StaggeredLink from '../ui/StaggeredLink';
import { FadeUp } from '../ui/FadeUp';
import { useEnquiryModal } from '../EnquiryModal';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const ID_SECCION_CARACTERISTICAS = 'lumera-features';
export const FEATURE_SECTION_ID = ID_SECCION_CARACTERISTICAS;
const SELECTOR_CARACTERES_SPLIT = '.split-chars';

// Catálogo de propiedades de alta gama con especificaciones arquitectónicas
const RESIDENCIAS = [
  {
    number: '01',
    title: 'Residencia La Palmera',
    description:
      'Una villa contemporánea frente al mar, diseñada con espacios abiertos, vistas infinitas y vida fluida hacia el exterior.',
    image: '/assets/media/project-1-new.0u9fesgwq9skw.webp',
    thumbnails: [
      '/assets/media/project-1.1.21wo08edq9jq7.webp',
      '/assets/media/project-1.2.21k1kt3dkict_.webp',
      '/assets/media/project-1.3.3_wrhlpce9-tl.webp',
      '/assets/media/project-1.4.22gdyyx_nlxmj.webp',
    ],
    cta: 'Ver Residencia',
    stats: [
      { value: '1,152 m²', label: 'Área Total' },
      { value: '06', label: 'Dormitorios' },
      { value: '08', label: 'Baños' },
      { value: '$13.0M USD', label: 'Precio de Venta' },
    ],
  },
  {
    number: '02',
    title: 'Penthouse Mirador Panorámico',
    description:
      'Un exclusivo penthouse con terrazas panorámicas, techos de doble altura y vistas 360° a toda la silueta de la metrópoli.',
    image: '/assets/media/project-2.0pf4-s2q1w0m3.webp',
    thumbnails: [
      '/assets/media/project-2.1.1vw2y5tubmey_.webp',
      '/assets/media/project-2.2.14tsc4sqavahh.webp',
      '/assets/media/project-2.3.1aji03tnwxy_s.webp',
      '/assets/media/project-2.4.0-xw3j0pmljz9.webp',
    ],
    cta: 'Ver Penthouse',
    stats: [
      { value: '915 m²', label: 'Área Total' },
      { value: '05', label: 'Dormitorios' },
      { value: '07', label: 'Baños' },
      { value: '$9.9M USD', label: 'Precio de Venta' },
    ],
  },
  {
    number: '03',
    title: 'Villa Jardín de la Laguna',
    description:
      'Serena colección de villas rodeadas de jardines privados, salones hacia el agua e interiores refinados para el confort.',
    image: '/assets/media/project-3-new.1fr3t03j3hm3-.webp',
    thumbnails: [
      '/assets/media/project-3.1.0eu2b8jfet59o.webp',
      '/assets/media/project-3.2.1_b9ln-xt6650.webp',
      '/assets/media/project-3.3.2u_h5ill-wmmr.webp',
      '/assets/media/project-3.4.27awdgq7i-imo.webp',
    ],
    cta: 'Ver Villa',
    stats: [
      { value: '948 m²', label: 'Área Total' },
      { value: '05', label: 'Dormitorios' },
      { value: '06', label: 'Baños' },
      { value: '$8.1M USD', label: 'Precio de Venta' },
    ],
  },
  {
    number: '04',
    title: 'Mansión Horizonte Marina',
    description:
      'Una majestuosa propiedad sobre el agua, con amenidades de spa, áreas de recepción y una exclusiva atmósfera resort.',
    image: '/assets/media/project-4-new.3svcowi2h1ysr.webp',
    thumbnails: [
      '/assets/media/project-4.1.0wywf8j8wp-7u.webp',
      '/assets/media/project-4.2.2gwfdmcnvnqm-.webp',
      '/assets/media/project-4.3.0mrx5t7ctnat9.webp',
      '/assets/media/project-4.4.2b-cyrddiu4n4.webp',
    ],
    cta: 'Ver Mansión',
    stats: [
      { value: '1,310 m²', label: 'Área Total' },
      { value: '07', label: 'Dormitorios' },
      { value: '09', label: 'Baños' },
      { value: '$14.7M USD', label: 'Precio de Venta' },
    ],
  },
];

export default function SeccionResidencias() {
  const rawId = useId().replace(/:/g, '');
  const textFillId = `lumera-residences-${rawId}-textfill`;
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const { openEnquiryModal } = useEnquiryModal();

  // Detección de dispositivo para alternar entre scroll horizontal fijado y vertical
  useEffect(() => {
    const checkViewport = () => setIsMobileOrTablet(window.innerWidth <= 1025);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Animaciones GSAP: ScrollTrigger Pinning + SplitText + Desplazamiento horizontal
  useEffect(() => {
    const styleId = `lumera-tfa-style-${textFillId}`;
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
      @keyframes lumera-color-transition-${textFillId} {
        0% { color: rgba(28, 27, 26, 0.18); }
        30% { color: rgba(28, 27, 26, 0.7); }
        100% { color: #1c1b1a; }
      }

      #${textFillId} .split__wrapper ${SELECTOR_CARACTERES_SPLIT} {
        transition: color .4s;
        color: rgba(28, 27, 26, 0.18);
      }

      #${textFillId} .split__wrapper ${SELECTOR_CARACTERES_SPLIT}.show {
        animation: lumera-color-transition-${textFillId} .5s;
        color: #1c1b1a;
      }
    `;
    document.head.appendChild(styleEl);

    const ctx = gsap.context(() => {
      let trackTween: gsap.core.Tween | undefined;
      const isDesktop = window.innerWidth > 1025;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const heading = headingRef.current;
      let splitInstance: SplitText | null = null;
      let charElements: Element[] = [];

      // 1. Divide el texto del encabezado en caracteres individuales para el efecto de llenado
      if (heading) {
        splitInstance = SplitText.create(heading, {
          type: 'words chars',
          aria: 'none',
          tag: 'span',
          charsClass: 'split-chars',
        });
        gsap.set(heading, { opacity: 1 });
        charElements = Array.from(heading.querySelectorAll(SELECTOR_CARACTERES_SPLIT));
      }

      // 2. Animación en escritorio: riel horizontal fijo durante el scroll vertical
      if (isDesktop) {
        gsap.set(
          '.lumera-residence-image, .lumera-residence-number, .lumera-residence-title, .lumera-residence-copy, .lumera-residence-stat, .lumera-residence-cta',
          { opacity: 1 }
        );
        trackTween = gsap.to('.lumera-residence-track', {
          xPercent: -80.24,
          ease: 'none',
          scrollTrigger: {
            trigger: `#${ID_SECCION_CARACTERISTICAS}`,
            start: 'top+=100vh top',
            end: 'bottom bottom',
            scrub: true,
          },
        });

        // Revelación de caracteres conforme avanza el scroll
        if (charElements.length) {
          if (reducedMotion) {
            gsap.set(charElements, { className: 'split-chars show' });
          } else {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: `#${ID_SECCION_CARACTERISTICAS}`,
                  start: 'top 40%',
                  end: 'top+=50vh top',
                  scrub: 0.3,
                },
              })
              .to(
                charElements,
                {
                  className: 'split-chars show',
                  duration: 0.4,
                  stagger: 0.04,
                  ease: 'power2.inOut',
                },
                0
              );
          }
        }
      } else if (charElements.length) {
        // En móviles, la revelación ocurre por posición relativa
        if (reducedMotion) {
          gsap.set(charElements, { className: 'split-chars show' });
        } else {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: `#${textFillId}`,
                start: 'top 80%',
                end: 'bottom 40%',
                scrub: 0.3,
              },
            })
            .to(
              charElements,
              {
                className: 'split-chars show',
                duration: 0.4,
                stagger: 0.04,
                ease: 'power2.inOut',
              },
              0
            );
        }
      }

      // 3. Animaciones sincronizadas de las tarjetas sobre el contenedor horizontal
      if (isDesktop && trackTween) {
        gsap.utils.toArray<HTMLElement>('.lumera-residence-card').forEach((card) => {
          const animateSplit = (
            selector: string,
            fromVars: gsap.TweenVars,
            splitType: 'lines' | 'chars,lines' = 'lines',
            delay = 0
          ) => {
            const target = card.querySelector(selector);
            if (!target) return;
            const split = new SplitText(target, { type: splitType, mask: 'lines' });
            const items = splitType === 'chars,lines' ? split.chars : split.lines;
            gsap.from(items, {
              ...fromVars,
              stagger: 0.05,
              duration: 0.7,
              delay,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'left center',
                toggleActions: 'play none none reverse',
                horizontal: true,
                containerAnimation: trackTween,
              },
            });
          };

          animateSplit('.lumera-residence-number', { y: 120, rotate: 8 }, 'chars,lines');
          animateSplit('.lumera-residence-title', { yPercent: 100 });

          card.querySelectorAll('.lumera-residence-copy').forEach((copyEl, idx) => {
            const split = new SplitText(copyEl, { type: 'lines', mask: 'lines' });
            gsap.from(split.lines, {
              yPercent: 100,
              stagger: 0.05,
              duration: 0.7,
              delay: 0.05 * idx,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'left center',
                toggleActions: 'play none none reverse',
                horizontal: true,
                containerAnimation: trackTween,
              },
            });
          });

          gsap.from(card.querySelectorAll('.lumera-residence-stat'), {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'left center',
              toggleActions: 'play none none reverse',
              horizontal: true,
              containerAnimation: trackTween,
            },
          });

          const imgEl = card.querySelector('.lumera-residence-image');
          if (imgEl) {
            gsap.fromTo(
              imgEl,
              { xPercent: -20 },
              {
                xPercent: 20,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'left right',
                  end: '50% left',
                  scrub: true,
                  horizontal: true,
                  containerAnimation: trackTween,
                },
              }
            );
          }
        });
        ScrollTrigger.refresh();
      }

      return () => {
        splitInstance?.revert();
      };
    });

    return () => {
      ctx.revert();
      document.getElementById(styleId)?.remove();
    };
  }, [textFillId]);

  return (
    <section
      id={ID_SECCION_CARACTERISTICAS}
      className="relative h-[850vh] bg-[#F3F3F3] text-[#1c1b1a] max-[1025px]:h-auto"
    >
      <div className="sticky top-0 h-screen overflow-hidden max-[1025px]:static max-[1025px]:h-auto">
        <div
          className="lumera-residence-track flex h-full w-fit gap-0 max-[1025px]:flex-col max-[1025px]:gap-[12vw] max-[1025px]:pb-[15%]"
          style={{ '--card-gap': '4vw' } as React.CSSProperties}
        >
          {/* Panel Introductorio: Llenado cinemático de texto tipográfico */}
          <div
            id={textFillId}
            ref={panelRef}
            className="flex h-screen w-screen flex-none items-center justify-center overflow-hidden bg-white px-[5vw] max-[1025px]:h-auto max-[1025px]:w-full max-[1025px]:py-[20vh]"
          >
            <div className="split__wrapper relative z-10 mx-auto w-[80%] max-[1025px]:w-[90%]">
              <h2
                ref={headingRef}
                className="text-center text-[3.8vw] font-heading leading-[1.3] font-medium! text-[#1c1b1a] opacity-0 max-[1025px]:opacity-100 max-[1025px]:text-[5vw] max-md:text-[8.5vw] max-[1025px]:leading-[1.08]"
              >
                Vida Sobre La Ciudad, Donde Cada Instante Se Enmarca En Vistas Panorámicas Y Luz
                Natural.
              </h2>
            </div>
          </div>

          {/* Tarjetas Horizontales de Cada Residencia Exclusiva */}
          {RESIDENCIAS.map((residence) => {
            const CardWrapper = isMobileOrTablet ? FadeUp : 'article';
            const wrapperProps = isMobileOrTablet ? { as: 'article' as const } : {};
            return (
              <CardWrapper
                key={residence.number}
                {...wrapperProps}
                className="lumera-residence-card max-[1025px]:px-[6%] flex h-screen w-[98vw] flex-none overflow-hidden rounded-none bg-[#F3F3F3] max-[1025px]:h-auto max-[1025px]:w-full max-[1025px]:flex-col"
              >
                {/* Fotografía principal de la residencia */}
                <div className="h-full w-[42%] overflow-hidden max-md:h-[60vh] max-[1025px]:h-[60vh] max-[1025px]:w-full max-[1025px]:rounded-[4vw]">
                  <img
                    src={residence.image}
                    alt={residence.title}
                    width={1000}
                    height={1000}
                    className="lumera-residence-image h-full w-full object-cover opacity-0 scale-[1.2] max-[1025px]:translate-x-0 max-[1025px]:scale-100 max-[1025px]:opacity-100"
                  />
                </div>

                {/* Ficha técnica: Número, Título, Descripción, Métricas y Miniaturas */}
                <div className="flex flex-col justify-between px-[3.5vw] py-[3.5vw] max-[1025px]:w-full max-[1025px]:px-0 max-[1025px]:pt-[7vw]">
                  <div>
                    <p className="lumera-residence-number text-[#1c1b1a] font-heading text-[5.8vw] font-medium! leading-none max-[1025px]:text-[7vw] opacity-0 max-md:text-[12vw] max-[1025px]:opacity-100">
                      {residence.number}
                    </p>
                    <h3 className="lumera-residence-title mt-[2vw] max-[1025px]:text-[5vw] font-heading text-[3.8vw] font-medium! leading-[1.2] text-[#1c1b1a] tracking-tighter opacity-0 max-[1025px]:mt-[5vw] max-[1025px]:max-w-full max-md:text-[7vw] max-[1025px]:opacity-100">
                      {residence.title}
                    </h3>
                    <p className="lumera-residence-copy mt-[3vw] max-w-[38vw] text-[1.25vw] leading-[1.6] text-[#1c1b1a] opacity-0 max-[1025px]:mt-[6vw] max-[1025px]:max-w-full max-[1025px]:text-[3vw] max-md:text-[4vw] max-[1025px]:opacity-100">
                      {residence.description}
                    </p>

                    {/* Especificaciones: Metros cuadrados, dormitorios, baños y precio */}
                    <div className="mt-[2.2vw] grid grid-cols-4 max-[1025px]:mt-[7vw] max-[1025px]:grid-cols-2">
                      {residence.stats.map((stat, statIdx) => (
                        <div
                          key={`${residence.number}-${stat.label}`}
                          className={`lumera-residence-stat w-[14vw] max-[1025px]:w-[45vw] relative py-[0.95vw] opacity-0 max-[1025px]:py-[4vw] max-[1025px]:opacity-100 ${
                            statIdx === 0 ? 'pr-[2vw]' : 'pl-[2vw] pr-[1.2vw]'
                          } ${
                            statIdx === residence.stats.length - 1 ? 'pr-0' : ''
                          } max-[1025px]:px-0`}
                        >
                          {statIdx !== 0 ? (
                            <span
                              aria-hidden="true"
                              className="absolute left-0 top-1/2 h-[6vw] w-px -translate-y-1/2 bg-[#DADADA] max-[1025px]:hidden"
                            />
                          ) : null}
                          <p className="text-[1.45vw] font-medium! leading-none tracking-[-0.04em] max-[1025px]:text-[3.5vw] max-md:text-[5vw]">
                            {stat.value}
                          </p>
                          <p className="mt-[0.8vw] text-[1.25vw] text-black max-[1025px]:mt-[1.8vw] max-[1025px]:text-[2.5vw] max-md:text-[3.2vw]">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vistas previas en miniatura y enlace de consulta directa */}
                  <div className="mt-[1vw] flex flex-col items-start justify-between gap-[2vw] max-md:flex-wrap max-[1025px]:mt-[8vw] max-[1025px]:flex-col max-[1025px]:items-start">
                    <div className="flex max-md:flex-gap gap-[1vw] max-[1025px]:gap-[3vw]">
                      {residence.thumbnails.map((thumb, thumbIdx) => (
                        <div
                          key={`${residence.number}-thumb-${thumbIdx}`}
                          className="overflow-hidden h-[6.2vw] w-[6.2vw] rounded-md bg-[#ddd4ca] max-[1025px]:rounded-[4vw] group max-[1025px]:h-[20vw] max-[1025px]:w-[20vw]"
                        >
                          <img
                            src={thumb}
                            alt={`${residence.title} vista previa ${thumbIdx + 1}`}
                            width={1000}
                            height={1000}
                            className="object-cover group-hover:scale-[1.2] duration-300 ease-in-out transition-all h-full w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <StaggeredLink
                      text={residence.cta}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        openEnquiryModal();
                      }}
                      hoverColor="#1c1b1a"
                      className="lumera-residence-cta gap-[1vw] pb-[0.6vw] text-[#1c1b1a] opacity-0 transition-opacity max-[1025px]:pb-[1.8vw] max-[1025px]:pt-[4vw] max-[1025px]:opacity-100"
                      textClassName="font-heading text-[1.2vw] leading-none max-[1025px]:text-[6vw]"
                    />
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}

