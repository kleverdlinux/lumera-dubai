// Componente SeccionVision: Filosofía de diseño y carrusel ovalado 3D
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { AnimatePresence, motion } from 'motion/react';
import SplitReveal from '../ui/SplitReveal';
import { FadeUp } from '../ui/FadeUp';
import { usePrefersReducedMotion } from '../../utils/motion';
import {
  computeOvalCarouselMetrics,
  OVAL_CAROUSEL_BREAKPOINTS,
  smoothstep,
} from '../../utils/carouselMath';

gsap.registerPlugin(Draggable, InertiaPlugin);

// Interfaz para los elementos del carrusel arquitectónico
interface ElementoDiapositiva {
  src: string;
  title: string;
  description: string;
}

// Diapositivas de la galería de proyectos y espacios icónicos
const DIAPOSITIVAS_PORTAFOLIO: ElementoDiapositiva[] = [
  {
    src: '/assets/media/portfolio-img-new-1.3ulka13a-n5np.webp',
    title: 'Hito Frente al Mar',
    description: 'Una dirección icónica que fusiona grandeza con hospitalidad moderna.',
  },
  {
    src: '/assets/media/portfolio-img-new-2.37pyq7v19f6jf.webp',
    title: 'Interiores Serenos',
    description: 'Espacios cálidos diseñados para el confort y el lujo silencioso.',
  },
  {
    src: '/assets/media/portfolio-img-new-3.43tkm-o7u7q3-.webp',
    title: 'Identidad Escultural',
    description:
      'Estructura audaz creada para definir el horizonte de Dubái con elegancia y carácter.',
  },
  {
    src: '/assets/media/portfolio-img-new-4.3576ru8031n7i.webp',
    title: 'Refugio de Bienestar',
    description: 'Zonas de spa privadas diseñadas para el descanso, la salud y la calma.',
  },
  {
    src: '/assets/media/portfolio-img-new-5.2mgif7s46rv7a.webp',
    title: 'Vida Junto al Agua',
    description: 'Piscinas estilo resort enmarcadas en piedra noble y luz ambiental.',
  },
  {
    src: '/assets/media/portfolio-img-new-6.0oecmcugucc0f.webp',
    title: 'Playa Privada',
    description:
      'Un refugio sereno con terrazas sombreadas y vistas despejadas al horizonte.',
  },
  {
    src: '/assets/media/portfolio-img-new-7.19toh7j68lyi7.webp',
    title: 'Pabellón Acuático',
    description:
      'Pabellón elevado para tardes soleadas, encuentros privados y desconexión.',
  },
];

interface PropsCarruselOvalado {
  slides?: Array<{ src: string; alt: string }>;
  initialIndex?: number;
  onActiveIndexChange?: (idx: number) => void;
  draggable?: boolean;
  showNav?: boolean;
  className?: string;
}

// Carrusel geométrico de tarjetas elípticas
function CarruselOvalado({
  slides = [],
  initialIndex = 0,
  onActiveIndexChange,
  draggable = true,
  showNav = true,
  className = '',
}: PropsCarruselOvalado) {
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const metricsRef = useRef(
    computeOvalCarouselMetrics(OVAL_CAROUSEL_BREAKPOINTS.desktop, 1440, 1440)
  );
  const progressObj = useRef({ value: initialIndex });
  const lastReportedIdx = useRef(-1);
  const isDraggingRef = useRef(false);
  const draggableInstance = useRef<Draggable | null>(null);

  const [activeIndex, setActiveIndex] = useState(
    slides.length ? ((initialIndex % slides.length) + slides.length) % slides.length : 0
  );
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Duplica diapositivas para asegurar un bucle infinito suave si hay pocas imágenes
  const expandedSlides = useMemo(() => {
    if (!slides.length) return [];
    const copies = slides.length >= 7 ? 1 : Math.ceil(7 / slides.length);
    return Array.from({ length: slides.length * copies }, (_, i) => ({
      slide: slides[i % slides.length],
      sourceIndex: i % slides.length,
      copy: Math.floor(i / slides.length),
    }));
  }, [slides]);

  const totalCount = expandedSlides.length;

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, totalCount);
  }, [totalCount]);

  useEffect(() => {
    onActiveIndexChange?.(activeIndex);
  }, [activeIndex, onActiveIndexChange]);

  // Detección de reducción de movimiento por sistema operativo
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const handler = () => setReducedMotion(media.matches);
    handler();
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Cálculo geométrico de la posición de cada tarjeta en el arco elíptico
  const renderLayout = useCallback(() => {
    if (!totalCount) return;
    const m = metricsRef.current;
    const wrapFn = gsap.utils.wrap(-totalCount / 2, totalCount / 2);
    const val = progressObj.current.value;

    for (let i = 0; i < totalCount; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const diff = wrapFn(i - val);
      const absDiff = Math.abs(diff);
      const clamped = Math.min(absDiff, 1);
      const centerFactor = smoothstep(1 - clamped);
      const xPos = diff * m.unit + Math.sign(diff) * smoothstep(clamped) * m.extra;
      const w = m.smallW + (m.centerW - m.smallW) * centerFactor;
      const h = m.smallH + (m.centerH - m.smallH) * centerFactor;
      const outOfBounds = Math.abs(xPos) - w / 2 >= m.stageHalf;

      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        x: xPos,
        width: w,
        height: h,
        zIndex: 100 - Math.round(10 * absDiff),
        opacity: 1,
        visibility: outOfBounds ? 'hidden' : 'visible',
      });
    }

    const nearest = ((Math.round(val) % totalCount) + totalCount) % totalCount;
    if (nearest !== lastReportedIdx.current) {
      lastReportedIdx.current = nearest;
      setActiveIndex(expandedSlides[nearest]?.sourceIndex ?? 0);
    }
  }, [totalCount, expandedSlides]);

  // Recalcula dimensiones cuando cambia el tamaño de ventana o viewport
  const updateMetrics = useCallback(() => {
    const vw = window.innerWidth;
    const stageW = stageRef.current?.clientWidth || vw;
    const bp =
      vw <= 640
        ? OVAL_CAROUSEL_BREAKPOINTS.mobile
        : vw <= 1024
        ? OVAL_CAROUSEL_BREAKPOINTS.tablet
        : OVAL_CAROUSEL_BREAKPOINTS.desktop;
    metricsRef.current = computeOvalCarouselMetrics(bp, vw, stageW);
    renderLayout();
  }, [renderLayout]);

  useEffect(() => {
    updateMetrics();
    setReady(true);
    window.addEventListener('resize', updateMetrics);
    const stage = stageRef.current;
    const ro = stage ? new ResizeObserver(updateMetrics) : null;
    if (stage && ro) ro.observe(stage);
    return () => {
      window.removeEventListener('resize', updateMetrics);
      ro?.disconnect();
    };
  }, [updateMetrics]);

  // Transición animada al índice seleccionado
  const animateTo = useCallback(
    (targetVal: number) => {
      draggableInstance.current?.tween?.kill();
      gsap.killTweensOf(progressObj.current);
      gsap.to(progressObj.current, {
        value: targetVal,
        duration: reducedMotion ? 0.2 : 0.8,
        ease: reducedMotion ? 'power1.out' : 'power3.out',
        onUpdate: renderLayout,
      });
    },
    [reducedMotion, renderLayout]
  );

  const stepBy = useCallback(
    (delta: number) => animateTo(Math.round(progressObj.current.value) + delta),
    [animateTo]
  );

  // Inicialización de GSAP Draggable con física inercial
  useEffect(() => {
    if (!draggable || !totalCount || !stageRef.current) return;
    const proxy = document.createElement('div');
    let startX = 0;
    let startVal = 0;

    const syncFromProxy = (d: { x: number }) => {
      progressObj.current.value = startVal - (d.x - startX) / metricsRef.current.unit;
      renderLayout();
    };

    const inst = Draggable.create(proxy, {
      trigger: stageRef.current,
      type: 'x',
      inertia: !reducedMotion,
      allowNativeTouchScrolling: false,
      onPress(this: Draggable) {
        gsap.killTweensOf(progressObj.current);
        startX = this.x;
        startVal = progressObj.current.value;
        isDraggingRef.current = false;
      },
      onDrag(this: Draggable) {
        isDraggingRef.current = true;
        syncFromProxy(this);
      },
      onThrowUpdate(this: Draggable) {
        syncFromProxy(this);
      },
      snap(endX: number) {
        const targetVal = startVal - (endX - startX) / metricsRef.current.unit;
        return startX - (Math.round(targetVal) - startVal) * metricsRef.current.unit;
      },
      onRelease() {
        if (reducedMotion) {
          animateTo(Math.round(progressObj.current.value));
        }
      },
      onThrowComplete() {
        progressObj.current.value = Math.round(progressObj.current.value);
        renderLayout();
      },
    })[0];

    draggableInstance.current = inst;
    return () => {
      inst.kill();
      draggableInstance.current = null;
    };
  }, [draggable, totalCount, reducedMotion, renderLayout, animateTo]);

  const currentSlide = slides[activeIndex];
  const liveAnnouncement = slides.length
    ? `${currentSlide?.alt ? `${currentSlide.alt}, ` : ''}slide ${activeIndex + 1} de ${slides.length}`
    : '';

  if (!totalCount) return null;

  return (
    <div className={`relative w-full select-none ${className}`}>
      {/* Accesibilidad por voz para lectores de pantalla */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* Escenario del Carrusel */}
      <div
        ref={stageRef}
        className={`relative h-[30vw] w-full overflow-hidden transition-opacity duration-500 max-[1024px]:h-[47vw] max-md:h-[73vw] ${
          draggable ? 'cursor-grab active:cursor-grabbing' : ''
        } ${ready ? 'opacity-100' : 'opacity-0'}`}
      >
        {expandedSlides.map((item, idx) => (
          <div
            key={`${item.sourceIndex}-${item.copy}`}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            onClick={() => {
              if (isDraggingRef.current) return;
              const diff = gsap.utils.wrap(-totalCount / 2, totalCount / 2)(
                idx - progressObj.current.value
              );
              if (Math.abs(diff) > 0.1) {
                animateTo(progressObj.current.value + diff);
              }
            }}
            aria-hidden={item.copy > 0}
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-full border-[1.5px] border-[#CA8216] will-change-transform"
          >
            <img
              src={item.slide.src}
              alt={item.slide.alt ?? ''}
              draggable={false}
              className="pointer-events-none h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Botones de navegación Anterior / Siguiente */}
      {showNav && (
        <>
          <button
            type="button"
            aria-label="Diapositiva anterior"
            onClick={() => stepBy(-1)}
            className="absolute bottom-[-53%] group left-[calc(50%-2vw)] z-200 flex size-[3vw] -translate-x-1/2 -translate-y-1/2 items-center border border-black justify-center rounded-full text-black transition-colors max-[1024px]:left-[calc(50%-6vw)] max-md:left-[calc(50%-8vw)] max-[1024px]:bottom-[-70%] max-md:bottom-[-60%] max-[1024px]:size-[6vw] max-md:size-[11vw]"
          >
            <svg
              className="size-4 relative group-hover:text-white duration-300 ease-in-out"
              width="22"
              height="15"
              viewBox="0 0 24 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.92891 14.3595C8.14461 14.3595 8.36032 14.2867 8.53061 14.1309C8.85983 13.8295 8.85983 13.3308 8.53061 13.0294L2.24121 7.27302L8.53061 1.51662C8.85983 1.21529 8.85983 0.716535 8.53061 0.415206C8.20138 0.113877 7.65645 0.113877 7.32722 0.415206L0.43613 6.72232C0.106902 7.02365 0.106902 7.5224 0.43613 7.82373L7.32722 14.1309C7.49751 14.2867 7.71321 14.3595 7.92891 14.3595Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.378445"
              />
              <path
                d="M1.23135 8.04981L20.3379 8.04981C20.8034 8.04981 21.1894 7.69653 21.1894 7.27051C21.1894 6.84449 20.8034 6.49121 20.3379 6.49121L1.23135 6.49121C0.765886 6.49121 0.379896 6.84449 0.379896 7.27051C0.379896 7.69653 0.765886 8.04981 1.23135 8.04981Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.378445"
              />
            </svg>
            <span className="bg-black rounded-full scale-0 absolute origin-center group-hover:scale-100 w-full h-full duration-300 ease-in-out z-[-1]" />
          </button>

          <button
            type="button"
            aria-label="Siguiente diapositiva"
            onClick={() => stepBy(1)}
            className="absolute bottom-[-53%] group border border-black left-[calc(50%-1vw)] z-200 flex size-[3vw] translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-black transition-colors max-[1024px]:left-[calc(50%-3vw)] max-[1024px]:bottom-[-70%] max-md:bottom-[-60%] max-md:left-[calc(50%-5vw)] max-[1024px]:size-[6vw] max-md:size-[11vw]"
          >
            <svg
              className="size-4 relative group-hover:text-white duration-300 ease-in-out"
              width="22"
              height="15"
              viewBox="0 0 22 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.4497 14.3595C13.234 14.3595 13.0183 14.2867 12.848 14.1309C12.5188 13.8295 12.5188 13.3308 12.848 13.0294L19.1374 7.27302L12.848 1.51662C12.5188 1.21529 12.5188 0.716535 12.848 0.415206C13.1772 0.113877 13.7222 0.113877 14.0514 0.415206L20.9425 6.72232C21.2717 7.02365 21.2717 7.5224 20.9425 7.82373L14.0514 14.1309C13.8811 14.2867 13.6654 14.3595 13.4497 14.3595Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.378445"
              />
              <path
                d="M20.1473 8.04981L1.04066 8.04981C0.575201 8.04981 0.189209 7.69653 0.189209 7.27051C0.189209 6.84449 0.575201 6.49121 1.04066 6.49121L20.1473 6.49121C20.6127 6.49121 20.9987 6.84449 20.9987 7.27051C20.9987 7.69653 20.6127 8.04981 20.1473 8.04981Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.378445"
              />
            </svg>
            <span className="bg-black rounded-full scale-0 absolute origin-center group-hover:scale-100 w-full h-full duration-300 ease-in-out z-[-1]" />
          </button>
        </>
      )}
    </div>
  );
}

const DIAPOSITIVAS_PROCESADAS = DIAPOSITIVAS_PORTAFOLIO.map(({ src, title }) => ({ src, alt: title }));

export default function SeccionVision() {
  const [activeIndex, setActiveIndex] = useState(2);
  const reducedMotion = usePrefersReducedMotion();
  const activeSlide = DIAPOSITIVAS_PORTAFOLIO[activeIndex] ?? DIAPOSITIVAS_PORTAFOLIO[2];

  return (
    <section
      className="overflow-hidden bg-[#E0D4C6] h-[84vw] max-[1025px]:h-[170vw] max-md:h-[220vw]"
      id="about"
    >
      <div className="py-[5%] pt-[10%] max-md:pt-[20%] max-[1025px]:py-[15%]">
        {/* Cabecera de la sección: Título en dos líneas y párrafo descriptivo */}
        <div className="w-full px-[5%] max-md:px-[6%] flex justify-between max-[1025px]:flex-col max-[1025px]:gap-[8vw]">
          <SplitReveal className="w-[50%] max-md:w-[90%] max-[1025px]:w-[90%]">
            <h2
              data-para-anim
              className="w-full font-heading text-[3.8vw] font-medium! leading-[1.2] max-md:text-[8vw] text-[#1c1b1a] mt-[-1vw] max-[1025px]:text-[8vw]"
            >
              Arquitectura,
              <br />
              Concebida Diferente
            </h2>
          </SplitReveal>
          <div className="w-[40%] space-y-[1.5vw] text-[#1c1b1a] text-[1.25vw] max-md:text-[3.5vw] max-[1025px]:text-[3vw] max-[1025px]:w-full">
            <SplitReveal>
              <p data-para-anim>
                Creemos que hallar el hogar ideal comienza por entender cómo deseas vivir.
              </p>
            </SplitReveal>
            <SplitReveal>
              <p data-para-anim>
                Desde residencias frente al mar hasta villas privadas y penthouses insignia, unimos
                propiedades singulares con asesoría experta para decisiones serenas,
                personales y fluidas.
              </p>
            </SplitReveal>
          </div>
        </div>

        {/* Carrusel elíptico interactivo con descripción dinámica */}
        <FadeUp>
          <div className="mt-[7vw] max-md:mt-[16vw]">
            <CarruselOvalado
              slides={DIAPOSITIVAS_PROCESADAS}
              initialIndex={2}
              onActiveIndexChange={setActiveIndex}
              draggable
            />
            <div
              data-para-anim
              className="mx-auto mt-[1vw] max-md:mt-[5vw] max-w-[24vw] text-center max-[1025px]:max-w-[80vw] max-md:space-y-[2vw]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeIndex}
                  initial={!reducedMotion ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <p className="font-heading text-[2.3vw] leading-[1.2] font-medium max-md:text-[5vw] text-[#1c1b1a] max-[1025px]:text-[5vw]">
                    {activeSlide.title}
                  </p>
                  <p className="mt-[1vw] w-[90%] text-center mx-auto text-[1.01vw] text-[#1C1B1A] max-[1025px]:text-[2.5vw] max-md:text-[3vw]">
                    {activeSlide.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

