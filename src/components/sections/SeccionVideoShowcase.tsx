// Componente SeccionVideoShowcase: Video inmersivo expandible de Dubái y puntos icónicos
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitReveal from '../ui/SplitReveal';

gsap.registerPlugin(ScrollTrigger);

// Puntos de referencia y atractivos mundiales a escasos minutos
const PUNTOS_EMBLEMATICOS = ['Burj Khalifa', 'Dubai Mall', 'Downtown Dubai', 'Palm Jumeirah'];
const RUTA_VIDEO = '/assets/media/dubai-living.0q_n0efbm6xc4.mp4';
const RUTA_POSTER = '/assets/media/video-poster.0gfrgyivwvqfn.webp';

export default function SeccionVideoShowcase() {
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Control de viewport
  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 1024);
    const raf = window.requestAnimationFrame(checkViewport);
    window.addEventListener('resize', checkViewport);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  // 1. Carga inteligente diferida del video mediante IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const vid = videoRef.current;
            if (vid && !loaded) {
              vid.src = RUTA_VIDEO;
              vid.load();
              vid.play().catch(() => {});
              setLoaded(true);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const el = videoRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loaded]);

  // 2. Animación de expansión del video con ScrollTrigger
  useEffect(() => {
    if (window.innerWidth > 1024) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#showcase',
            start: '40% 80%',
            end: 'bottom bottom',
            scrub: 0.25,
          },
        });
        tl.to('.video-block', {
          width: '90vw',
          height: '40vw',
          yPercent: 30,
          right: '5%',
          ease: 'power1.out',
          duration: 5,
        });
        tl.to('.inner-detail', { opacity: 1, duration: 1 });
      });
      return () => ctx.revert();
    }
  }, []);

  return (
    <section
      id="showcase"
      className="py-[10%] relative z-5 max-[1025px]:pb-[15%]"
      data-scroll
      data-scroll-speed={isMobile ? undefined : '-0.3'}
    >
      <div className="px-[5%] h-full relative">
        <div className="flex w-full gap-[10vw] max-[1025px]:flex-col">
          {/* Título de ubicación estratégica */}
          <SplitReveal className="w-[50%] max-[1025px]:w-full">
            <h2
              data-para-anim
              className="text-[#1C1B1A] font-heading font-medium! text-[3.8vw] leading-[1.2] max-[1025px]:text-[6.8vw] max-md:text-[8.8vw] max-[1025px]:w-full"
            >
              En el Corazón
              <br />
              del Lujo en Dubái
            </h2>
          </SplitReveal>

          {/* Bloque expansivo de Video con puntos clave flotantes */}
          <div className="w-[40vw] h-[22vw] overflow-hidden rounded-full video-block absolute right-[10%] rtl:left-[10%] rtl:right-auto max-[1025px]:w-[90vw] max-[1025px]:h-[50vw] max-[1025px]:static max-[1025px]:rounded-[4vw]">
            <video
              ref={videoRef}
              poster={RUTA_POSTER}
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center"
            />
            {/* Detalle flotante sobre el video en desktop */}
            <div className="inner-detail absolute bottom-[8%] left-1/2 translate-x-[-50%] z-6 flex items-center gap-[2vw] rounded-full bg-black/30 backdrop-blur-[10px] px-[2.2vw] py-[1.2vw] opacity-0 max-[1025px]:hidden">
              <p
                data-para-anim
                className="text-[1.1vw] leading-tight text-white"
              >
                Puntos
                <br />
                Cercanos:
              </p>
              <div className="flex items-center gap-[2vw]">
                {PUNTOS_EMBLEMATICOS.map((landmark, idx) => (
                  <React.Fragment key={landmark}>
                    {idx !== 0 && (
                      <span className="h-[1.4vw] w-px shrink-0 bg-white/40" />
                    )}
                    <p
                      data-para-anim
                      className="whitespace-nowrap text-[1.1vw] text-white"
                    >
                      {landmark}
                    </p>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Párrafo complementario de conectividad urbana */}
        <div className="w-full h-full mt-[48vw] flex justify-end max-[1025px]:mt-[7vw]">
          <SplitReveal className="w-[40%] max-[1025px]:w-full">
            <p
              data-para-anim
              className="max-md:text-[4.2vw] max-[1025px]:text-[3vw] mr-[5vw] text-[1.2vw] text-black tracking-wide"
            >
              Estratégicamente ubicado en uno de los distritos más prestigiosos de Dubái, Lumera
              Heights brinda acceso inigualable a la cultura, los negocios y el entretenimiento de
              vanguardia.
            </p>
          </SplitReveal>
        </div>
      </div>
    </section>
  );
}

