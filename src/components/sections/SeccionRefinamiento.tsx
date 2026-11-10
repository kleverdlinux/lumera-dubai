// Componente SeccionRefinamiento: Espacios de distinción y carrusel continuo con barra
import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DarkOutlineFillButton } from '../ui/AnimatedFillButton';
import HorizontalDragCarousel, { GsapCarousel } from '../ui/HorizontalDragCarousel';
import SplitReveal from '../ui/SplitReveal';
import { useEnquiryModal } from '../EnquiryModal';
import { FadeUp } from '../ui/FadeUp';
import { computeScrollProgressBar } from '../../utils/carouselMath';

gsap.registerPlugin(ScrollTrigger);

// Galería fotográfica de acabados nobles, iluminación y texturas
const IMAGENES_REFINAMIENTO = [
  '/assets/media/refinement-1.14jmvps39m2i0.webp',
  '/assets/media/refinement-2.3ljzp2xwxhwq9.webp',
  '/assets/media/refinement-3.3nbbttyhaw53l.webp',
  '/assets/media/refinement-4.1wavwr_hjdvzw.webp',
  '/assets/media/refinement-5.1t_i_dut5sdy2.webp',
  '/assets/media/refinement-6.0bohiobt-5-30.webp',
];

export default function SeccionRefinamiento() {
  const { openEnquiryModal } = useEnquiryModal();
  const carouselRef = useRef<GsapCarousel | null>(null);
  const rafRef = useRef<number | null>(null);
  const [bar, setBar] = useState({ width: 100, left: 0 });

  // Configuración del carrusel horizontal
  const carouselConfig = useMemo(
    () => ({
      infinite: false,
      snap: false,
      setOffset: ({ wrapperWidth }: { wrapperWidth: number }) => {
        const wrapper = carouselRef.current?.wrapper;
        if (!wrapper) return wrapperWidth;
        const style = getComputedStyle(wrapper);
        const pl = parseFloat(style.paddingLeft || '0');
        const pr = parseFloat(style.paddingRight || '0');
        const gap = parseFloat(style.columnGap || '0');
        return wrapperWidth - pr - pl - Math.max(0, wrapper.children.length - 1) * gap;
      },
    }),
    []
  );

  // Sincronización continua de la barra de desplazamiento
  useEffect(() => {
    const syncBar = () => {
      const inst = carouselRef.current;
      if (inst) {
        setBar(
          computeScrollProgressBar(
            inst.viewport.wrapperWidth,
            inst.viewport.totalWidth,
            inst.progress
          )
        );
      }
      rafRef.current = requestAnimationFrame(syncBar);
    };
    rafRef.current = requestAnimationFrame(syncBar);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Transición suave del color de fondo de la página a blanco
  useEffect(() => {
    if (window.innerWidth > 1024) {
      const ctx = gsap.context(() => {
        const body = document.body;
        const tweenBg = (color: string) => {
          gsap.to(body, { backgroundColor: color, duration: 1, ease: 'power2.out' });
        };
        ScrollTrigger.create({
          trigger: '#project',
          start: 'top 60%',
          end: 'bottom 20%',
          onEnter: () => tweenBg('#ffffff'),
          onLeaveBack: () => tweenBg('#1C1B1A'),
        });
      });
      return () => ctx.revert();
    }
  }, []);

  return (
    <section
      id="project"
      className="w-screen overflow-hidden pt-[8%] pb-[12%] text-[#1c1b1a] max-md:pt-[20%] max-md:pb-[16%] max-[1025px]:py-[10%]"
    >
      <div className="px-[5%]">
        <SplitReveal>
          <h2
            data-para-anim
            className="font-medium! text-[#1C1B1A] font-heading text-[3.8vw] leading-[1.06] tracking-[-0.04em] max-[1025px]:text-[6.8vw] max-md:text-[10vw]"
          >
            Un Mundo de Distinción
          </h2>
        </SplitReveal>
        
        {/* Línea divisoria minimalista */}
        <div className="my-[3.5vw] h-px w-full bg-black/15 lineDraw max-md:my-[8vw] max-[1025px]:my-[5vw]" />
        
        {/* Bloque descriptivo con botón de cotización */}
        <div className="mb-[4.5vw] grid grid-cols-[minmax(0,1fr)_minmax(18rem,34vw)] items-start gap-[4vw] pl-[23%] pr-[2%] max-[1025px]:grid-cols-1 max-[1025px]:gap-[7vw] max-[1025px]:px-0 max-md:mb-[10vw]">
          <FadeUp>
            <div className="fadeup max-[1025px]:order-1">
              <DarkOutlineFillButton
                btnText="Cotizar Ahora"
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
          <SplitReveal>
            <p
              data-para-anim
              className="max-w-[38vw] text-[1.25vw] leading-[1.75] tracking-[-0.02em] text-[#1C1B1A] max-[1025px]:max-w-full max-[1025px]:text-[2.5vw] max-md:text-[4.6vw]"
            >
              Sumérgete en el encanto exclusivo de Lumera Heights, donde cada rincón destila
              sofisticación. No es solo una residencia: es un sello de distinción que
              encarna el estilo de vida extraordinario que siempre anhelaste.
            </p>
          </SplitReveal>
        </div>
      </div>

      {/* Carrusel horizontal continuo de fotos de interiores */}
      <FadeUp>
        <div>
          <HorizontalDragCarousel
            config={carouselConfig}
            wrapperClassName="fadeup pl-[25.5%] pr-[5%] pb-[1vw] gap-[1.2vw] max-[1025px]:pl-[5%] max-[1025px]:gap-[8vw]"
            itemClassName="cursor-grab active:cursor-grabbing"
            onReady={(inst) => {
              carouselRef.current = inst;
            }}
          >
            {IMAGENES_REFINAMIENTO.map((src, idx) => (
              <div
                key={idx}
                className="relative h-[29vw] w-[43vw] shrink-0 overflow-hidden rounded-[1.8vw] max-[1025px]:h-[50vw] max-[1025px]:w-[72vw] max-md:h-[62vw] max-md:w-[84vw]"
              >
                <img
                  src={src}
                  alt={`interior-refinamiento-${idx + 1}`}
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                />
              </div>
            ))}
          </HorizontalDragCarousel>

          {/* Barra de arrastre y progreso visual */}
          <div
            className="relative overflow-hidden rounded-full bg-[#e5e5e5] mt-[3.6vw] ml-[25.5%] h-[0.4vw] w-[65vw] max-md:mt-[7vw] max-md:mx-auto max-md:h-[1.2vw] max-md:w-[85vw] max-[1025px]:ml-[8%]"
            aria-hidden="true"
          >
            <div
              className="absolute inset-y-0 rounded-full bg-black"
              style={{ width: `${bar.width}%`, left: `${bar.left}%` }}
            />
          </div>
        </div>
      </FadeUp>
    </section>
  );
}

