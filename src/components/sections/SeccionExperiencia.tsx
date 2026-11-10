// Componente SeccionExperiencia: Trayectoria, cinemática de video y estadísticas
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DarkOutlineFillButton } from '../ui/AnimatedFillButton';
import { prefersReducedMotion } from '../../utils/motion';
import SplitReveal from '../ui/SplitReveal';
import { useEnquiryModal } from '../EnquiryModal';
import { FadeUp, useLineDraw } from '../ui/FadeUp';

gsap.registerPlugin(ScrollTrigger);

const RUTA_VIDEO_EXPERIENCIA = '/assets/media/dubai-experience.3wn6u3ehiwmks.mp4';
const RUTA_POSTER_EXPERIENCIA = '/assets/media/video-poster-2.40j1e10donl84.webp';

// Lista interactiva de cifras históricas y proyectos
export function SeccionEstadisticasExperiencia() {
  useLineDraw();

  return (
    <section className="py-[10%] bg-[#161616] max-md:py-[20%] max-[1025px]:py-[10%]">
      <div className="px-[5%] max-md:px-[6%] flex items-center justify-center">
        <div className="w-[90%] flex flex-col font-medium">
          
          {/* Fila 1: 25+ Años De Experiencia */}
          <FadeUp>
            <div className="text-center group" id="p1">
              <div className="flex w-fit mx-auto items-center justify-center mb-[2.8vw] relative gap-[1.5vw]">
                <p className="uppercase font-heading text-white group-hover:translate-x-[-4.5vw] rtl:group-hover:translate-x-[4.5vw] duration-300 text-[4vw] leading-none ease-out max-[1025px]:text-[5vw] max-[1025px]:group-hover:translate-x-0 rtl:max-[1025px]:group-hover:translate-x-0">
                  <span className="max-[1025px]:text-[7vw]">25+</span> Años De Experiencia
                </p>
                <div className="w-[6vw] absolute right-[-9%] h-[6vw] rtl:right-auto rtl:left-[-20%] top-[-25%] rounded-full overflow-hidden ml-[1.5vw] scale-0 duration-300 ease-out group-hover:scale-100 max-[1025px]:group-hover:scale-0">
                  <img
                    src="/assets/media/exp01.2q4rfxbiv_k2w.webp"
                    alt="Detalle arquitectónico Lumera Heights"
                    width={200}
                    height={200}
                    className="object-cover h-full w-full"
                  />
                </div>
              </div>
              <span
                data-line-draw
                className="w-full block h-px bg-white max-md:my-[7vw] max-[1025px]:my-[4vw]"
              />
            </div>
          </FadeUp>

          {/* Fila 2: 50K+ Hogares Entregados */}
          <FadeUp>
            <div className="text-center group" id="p2">
              <div className="flex items-center justify-center mt-[3.5vw] mb-[2.8vw] relative gap-[1.5vw]">
                <p className="uppercase font-heading text-white group-hover:translate-x-[-4.8vw] rtl:group-hover:translate-x-[5.5vw] duration-300 text-[4vw] leading-none ease-out max-[1025px]:text-[5vw] max-[1025px]:group-hover:translate-x-0 rtl:max-[1025px]:group-hover:translate-x-0">
                  <span className="max-[1025px]:text-[7vw]">50K+</span> Hogares
                </p>{' '}
                <div className="w-[6vw] absolute right-[47%] h-[6vw] top-[-10%] rtl:right-auto rtl:left-[35%] overflow-hidden ml-[1.5vw] scale-0 duration-300 ease-out group-hover:scale-100 [clip-path:circle(100%_at_0_100%)] max-[1025px]:hidden">
                  <img
                    src="/assets/media/exp02.0le1snxwamry1.jpg"
                    alt="Interior residencial entregado"
                    width={250}
                    height={250}
                    className="object-cover h-full w-full"
                  />
                </div>
                <p className="uppercase font-heading text-white group-hover:translate-x-[2.4vw] rtl:group-hover:translate-x-[-4vw] duration-300 text-[4vw] leading-none ease-out max-[1025px]:text-[5vw] max-[1025px]:group-hover:translate-x-0 rtl:max-[1025px]:group-hover:translate-x-0 max-[1025px]:pt-[1vw]">
                  Entregados
                </p>
              </div>
              <span
                data-line-draw
                className="w-full block h-px bg-white max-md:my-[7vw] max-[1025px]:my-[4vw]"
              />
            </div>
          </FadeUp>

          {/* Fila 3: 20+ Proyectos De Lujo */}
          <FadeUp>
            <div className="text-center group" id="p3">
              <div className="flex items-center justify-center mt-[3.5vw] mb-[2.8vw] relative gap-[1.5vw]">
                <p className="uppercase font-heading text-white group-hover:translate-x-[-7.2vw] rtl:group-hover:translate-x-[7.5vw] duration-300 text-[4vw] leading-none ease-out max-[1025px]:text-[7vw] max-[1025px]:group-hover:translate-x-0 rtl:max-[1025px]:group-hover:translate-x-0">
                  20+
                </p>{' '}
                <div className="w-[12vw] absolute right-[62%] h-[6vw] top-[-15%] rtl:right-auto rtl:left-[48%] overflow-hidden ml-[1.5vw] scale-0 duration-300 ease-out group-hover:scale-100 rounded-xl max-[1025px]:hidden">
                  <img
                    src="/assets/media/exp03.161bupvil6rql.jpg"
                    alt="Exterior de proyecto de lujo"
                    width={250}
                    height={250}
                    className="object-cover h-full w-full"
                  />
                </div>
                <p className="uppercase font-heading text-white group-hover:translate-x-[5.2vw] rtl:group-hover:translate-x-[-7.5vw] duration-300 text-[4vw] leading-px ease-out max-[1025px]:text-[5vw] max-[1025px]:group-hover:translate-x-0 rtl:max-[1025px]:group-hover:translate-x-0">
                  Proyectos De Lujo
                </p>
              </div>
              <span
                data-line-draw
                className="w-full block h-px bg-white max-md:my-[7vw] max-[1025px]:my-[4vw]"
              />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export default function SeccionExperiencia() {
  const { openEnquiryModal } = useEnquiryModal();
  const desktopSectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Carga diferida del video mediante IntersectionObserver
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const videos = [desktopVideoRef.current, mobileVideoRef.current].filter(
      (v): v is HTMLVideoElement => v !== null
    );
    if (!videos.length) return;
    const loadedSet = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && !loadedSet.has(vid)) {
            vid.src = RUTA_VIDEO_EXPERIENCIA;
            vid.load();
            vid.play().catch(() => {});
            loadedSet.add(vid);
            observer.unobserve(vid);
          }
        });
      },
      { threshold: 0.5 }
    );
    videos.forEach((v) => observer.observe(v));
    return () => {
      videos.forEach((v) => observer.unobserve(v));
    };
  }, []);

  // Animación cinemática de textos cruzados y zoom de video en pantalla grande
  useEffect(() => {
    if (!prefersReducedMotion() && window.innerWidth > 1024 && desktopSectionRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: desktopSectionRef.current,
            start: 'top 50%',
            end: '+=2000 bottom',
            scrub: true,
          },
          defaults: { ease: 'none' },
        });
        tl.from(line1Ref.current, { xPercent: 120, duration: 3, ease: 'power2.inout' }, 0);
        tl.from(line2Ref.current, { xPercent: -120, duration: 3, ease: 'power2.inout' }, 0);
        tl.from(line3Ref.current, { xPercent: 120, duration: 3, ease: 'power2.inout' }, 0);
        tl.to(
          videoBoxRef.current,
          { scale: 4, xPercent: -140, yPercent: -30, position: 'absolute', duration: 3 },
          2.8
        );
        tl.from(descRef.current, { y: 50, opacity: 0, duration: 1 }, '>');
      }, desktopSectionRef);
      return () => ctx.revert();
    }
  }, []);

  return (
    <>
      {/* Vista Responsiva para Dispositivos Móviles y Tablets */}
      <section
        id="bringing"
        className="hidden max-[1025px]:block bg-white isolate py-[10%] max-md:py-[20%] max-[1025px]:py-[10%]"
      >
        <div className="px-[5%] w-full">
          <div className="flex flex-col items-center justify-center w-full gap-[5vw]">
            <div className="flex flex-col gap-2 items-center justify-center">
              <SplitReveal>
                <p className="text-[9vw] font-medium text-[#353430] font-heading leading-[1.1] uppercase text-center max-[1025px]:leading-[1.3] max-[1025px]:text-[9vw]">
                  Otra Forma De
                </p>
              </SplitReveal>
              <SplitReveal>
                <p className="text-[9vw] font-medium text-[#353430] font-heading leading-[1.1] uppercase text-center max-[1025px]:leading-[1.3] max-[1025px]:text-[9vw]">
                  Descubrir
                </p>
              </SplitReveal>
              <SplitReveal>
                <p className="text-[9vw] font-medium text-[#353430] font-heading leading-[1.1] uppercase text-center max-[1025px]:leading-[1.3] max-[1025px]:text-[9vw]">
                  Inmuebles Dubái
                </p>
              </SplitReveal>
            </div>

            <div className="w-[90vw] h-[50vw] max-md:h-[70vw] rounded-lg overflow-hidden">
              <video
                ref={mobileVideoRef}
                poster={RUTA_POSTER_EXPERIENCIA}
                muted
                loop
                playsInline
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>

            <div className="w-full flex flex-col items-center gap-[2.5vw]">
              <SplitReveal>
                <p className="font-body text-[1.25vw] max-[1025px]:text-[3vw] max-md:text-[4.2vw] text-center">
                  Miramos más allá del catálogo para entender qué hace única a cada propiedad:
                  desde su ubicación y diseño hasta su plusvalía y relevancia a largo plazo.
                  El resultado es una experiencia transparente, personalizada y sin fricción.
                </p>
              </SplitReveal>
              <FadeUp>
                <div className="max-md:pt-4">
                  <DarkOutlineFillButton
                    btnText="Hablar con Asesor"
                    link="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openEnquiryModal();
                    }}
                    className="bg-[#1c1b1a]"
                    borderColor="#1c1b1a"
                  />
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Vista de Escritorio con Efecto Cinemático de Textos Fijos y Zoom de Video */}
      <section
        id="bringing-desktop"
        className="max-[1025px]:hidden bg-white isolate h-[200vh]"
        ref={desktopSectionRef}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="px-[5%] w-full h-full py-[10%] relative max-md:py-[20%] max-[1025px]:py-[10%]">
            <div className="flex flex-col items-center justify-center w-full h-full gap-[5vw]">
              <div className="flex flex-col gap-8 items-center justify-center">
                <div ref={line1Ref}>
                  <p className="text-[9vw] font-medium text-[#353430] leading-[1.1] font-heading uppercase max-[1025px]:leading-[1.3] max-[1025px]:text-[9vw]">
                    Otra Forma De
                  </p>
                </div>
                <div ref={line2Ref} className="w-full h-full flex justify-center gap-[3vw]">
                  <p className="text-[9vw] font-medium text-[#353430] leading-[1.1] font-heading uppercase max-[1025px]:leading-[1.3] max-[1025px]:text-[9vw]">
                    Descubrir
                  </p>
                  <div className="h-full w-[20vw] relative rounded-lg max-[1025px]:absolute max-md:top-[30%] max-[1025px]:w-[90vw] max-[1025px]:top-[35%]">
                    <div
                      ref={videoBoxRef}
                      className="w-[20vw] h-[10vw] absolute z-100 top-0 rounded-[0.6vw] overflow-hidden max-[1025px]:w-[90vw] max-md:h-[70vw] max-[1025px]:h-[50vw]"
                    >
                      <video
                        ref={desktopVideoRef}
                        poster={RUTA_POSTER_EXPERIENCIA}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover transition-opacity duration-500"
                      />
                    </div>
                  </div>
                </div>
                <div ref={line3Ref} className="relative z-[-1] max-[1025px]:z-1">
                  <p className="text-[9vw] font-medium text-[#353430] leading-[1.1] font-heading uppercase max-[1025px]:leading-[1.3] max-[1025px]:text-[9vw]">
                    Inmuebles Dubái
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bloque de asesoría tras la cinemática en Desktop */}
      <div className="max-[1025px]:hidden w-[60%] pb-[10vw] flex flex-col items-center gap-[2.5vw] mx-auto bg-white">
        <SplitReveal>
          <p ref={descRef} className="font-body text-[1.25vw] max-[1025px]:text-[3.5vw] text-center">
            Miramos más allá del catálogo para entender qué hace única a cada propiedad: desde
            su ubicación y diseño hasta su plusvalía y relevancia a largo plazo. El
            resultado es una experiencia transparente, personalizada y sin fricción.
          </p>
        </SplitReveal>
        <FadeUp>
          <div className="max-md:pt-4">
            <DarkOutlineFillButton
              btnText="Hablar con Asesor"
              link="#"
              onClick={(e) => {
                e.preventDefault();
                openEnquiryModal();
              }}
              className="bg-[#1c1b1a]"
              borderColor="#1c1b1a"
            />
          </div>
        </FadeUp>
      </div>

      {/* Estadísticas de Experiencia */}
      <SeccionEstadisticasExperiencia />
    </>
  );
}

// Compatibilidad hacia atrás
export { SeccionEstadisticasExperiencia as ExperienceStatsSection };
export { SeccionExperiencia as ExperienceSection };

