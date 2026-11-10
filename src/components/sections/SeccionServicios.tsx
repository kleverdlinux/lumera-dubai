// Componente SeccionServicios: Marquesina infinita y tarjetas acordeón de amenidades
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { FadeUp } from '../ui/FadeUp';
import { prefersReducedMotion } from '../../utils/motion';
import { useEnquiryModal } from '../EnquiryModal';

gsap.registerPlugin(Draggable);

// Elementos de la marquesina interactiva
interface ElementoMarquesina {
  id: string;
  text: string;
  link: string;
}

const PILDORAS_MARQUESINA: ElementoMarquesina[] = [
  { id: 'brochure', text: 'Descargar Folleto', link: '#' },
  { id: 'floor-plan', text: 'Descargar Planos', link: '#' },
  { id: 'payment-plan', text: 'Plan de Financiación', link: '#' },
  { id: 'drawings', text: 'Planos Arquitectónicos', link: '#' },
  { id: 'amenities', text: 'Ver Amenidades', link: '#' },
  { id: 'visit', text: 'Agendar Visita', link: '#' },
  { id: 'sales', text: 'Equipo de Ventas', link: '#' },
];

// Tarjetas fotográficas de amenidades y servicios de alto estándar
const TARJETAS_SERVICIOS = [
  { title: 'SALÓN DE DESCANSO', img: '/assets/media/service01.438kkt14ef4jq.webp' },
  { title: 'Piscina Olímpica', img: '/assets/media/service02.3gtzb4kz6mvpv.webp' },
  { title: 'Spa y Bienestar', img: '/assets/media/service03.1yepnc98o67gy.webp' },
  { title: 'Zona de Fuego', img: '/assets/media/service04.1u54wlrizp89c.webp' },
  { title: 'Cava de Vinos', img: '/assets/media/service05.0nw4jgl7sz-v8.webp' },
];

interface PropsMarquesinaArrastrable {
  items: ElementoMarquesina[];
  speed?: number;
  repeatCount?: number;
  gapClassName?: string;
  className?: string;
  trackClassName?: string;
  itemClassName?: string;
  pauseOnHover?: boolean;
  renderItem: (item: ElementoMarquesina, index: number) => React.ReactNode;
  throwMultiplier?: number;
  throwFriction?: number;
  maxThrowVelocity?: number;
  initialOffset?: number;
  loopStart?: number;
  loopEndMultiplier?: number;
}

// Marquesina horizontal continua con soporte táctil
function MarquesinaArrastrable({
  items = [],
  speed = 1,
  repeatCount = 4,
  gapClassName = 'gap-[2vw] max-[1025px]:gap-[4vw]',
  className = 'fadeup w-full py-[0.4vw]',
  trackClassName = '',
  itemClassName = 'select-none',
  pauseOnHover = false,
  renderItem,
  throwMultiplier = 2.8,
  throwFriction = 0.975,
  maxThrowVelocity = 60,
  initialOffset = 0,
  loopStart = 0,
  loopEndMultiplier = -1.02,
}: PropsMarquesinaArrastrable) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);

  const repeatedItems = useMemo(
    () => Array.from({ length: repeatCount }).flatMap(() => items),
    [items, repeatCount]
  );

  useLayoutEffect(() => {
    if (!containerRef.current || !trackRef.current || !items.length) return;
    const container = containerRef.current;
    const track = trackRef.current;
    let singleSetWidth = 0;
    let currentX = initialOffset;
    let throwVelocity = 0;
    let isHovered = false;
    let isDragging = false;
    let lastDragX = 0;
    let lastDragTime = 0;
    let wrapFn = (v: number) => v;
    let rafId: number | null = null;
    const reduced = prefersReducedMotion();
    const observers: ResizeObserver[] = [];

    const setX = gsap.quickSetter(track, 'x', 'px');

    const measureTrack = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const setCount = Math.floor(children.length / repeatCount);
      const firstSet = children.slice(0, setCount);
      const computed = window.getComputedStyle(track);
      const gap = parseFloat(String(computed.columnGap || computed.gap || 0));
      if (!firstSet.length) return;

      const prevProgress = (() => {
        if (!singleSetWidth) return 0;
        const endBound = singleSetWidth * loopEndMultiplier;
        const span = loopStart - endBound;
        if (!span) return 0;
        let x = currentX;
        while (x < endBound) x += span;
        while (x > loopStart) x -= span;
        return (x - endBound) / span;
      })();

      singleSetWidth =
        firstSet.reduce((acc, el) => acc + el.getBoundingClientRect().width, 0) +
        gap * Math.max(0, firstSet.length - 1);
      const loopEnd = singleSetWidth * loopEndMultiplier;
      wrapFn = gsap.utils.wrap(loopEnd, loopStart);

      if (Number.isFinite(prevProgress) && singleSetWidth > 0) {
        const endBound = singleSetWidth * loopEndMultiplier;
        const span = loopStart - endBound;
        currentX = wrapFn(endBound + span * prevProgress);
        setX(currentX);
        if (draggableRef.current) {
          draggableRef.current.update();
        }
      } else {
        currentX = wrapFn(initialOffset);
        setX(currentX);
      }
    };

    const scheduleMeasure = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measureTrack);
    };

    const tick = () => {
      if (!isDragging) {
        if (!reduced && !(pauseOnHover && isHovered)) {
          currentX -= speed;
        }
        currentX += throwVelocity;
        throwVelocity *= throwFriction;
        if (Math.abs(throwVelocity) < 0.01) throwVelocity = 0;
      }
      currentX = wrapFn(currentX);
      setX(currentX);
    };

    measureTrack();

    draggableRef.current = Draggable.create(track, {
      type: 'x',
      allowContextMenu: true,
      dragClickables: true,
      onPress() {
        isDragging = true;
        throwVelocity = 0;
        gsap.set(track, { x: currentX });
        this.update();
        lastDragX = this.x;
        lastDragTime = performance.now();
      },
      onDrag() {
        const now = performance.now();
        const dx = this.x - lastDragX;
        const dt = now - lastDragTime;
        currentX = wrapFn(this.x);
        setX(currentX);
        if (dt > 0) {
          throwVelocity = reduced
            ? 0
            : gsap.utils.clamp(-maxThrowVelocity, maxThrowVelocity, (dx / dt) * 36.67 * throwMultiplier);
        }
        lastDragX = this.x;
        lastDragTime = now;
      },
      onRelease() {
        isDragging = false;
      },
    })[0];

    const onMouseEnter = () => {
      isHovered = true;
    };
    const onMouseLeave = () => {
      isHovered = false;
    };

    if (pauseOnHover) {
      container.addEventListener('mouseenter', onMouseEnter);
      container.addEventListener('mouseleave', onMouseLeave);
    }

    window.addEventListener('resize', scheduleMeasure);
    const trackRo = new ResizeObserver(scheduleMeasure);
    trackRo.observe(track);
    observers.push(trackRo);

    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('resize', scheduleMeasure);
      if (pauseOnHover) {
        container.removeEventListener('mouseenter', onMouseEnter);
        container.removeEventListener('mouseleave', onMouseLeave);
      }
      gsap.ticker.remove(tick);
      if (rafId) cancelAnimationFrame(rafId);
      observers.forEach((ro) => ro.disconnect());
      if (draggableRef.current) {
        draggableRef.current.kill();
        draggableRef.current = null;
      }
    };
  }, [
    items,
    speed,
    repeatCount,
    pauseOnHover,
    throwMultiplier,
    throwFriction,
    maxThrowVelocity,
    initialOffset,
    loopStart,
    loopEndMultiplier,
  ]);

  if (!items.length) return null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
    >
      <div ref={trackRef} className={`flex w-max items-center ${gapClassName} ${trackClassName}`}>
        {repeatedItems.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className={`shrink-0 ${itemClassName}`}>
            {renderItem(item, idx % items.length)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SeccionServicios() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollBar, setScrollBar] = useState({ widthPct: 100, leftPct: 0 });
  const { openEnquiryModal } = useEnquiryModal();

  // Controla el ancho y posición del indicador visual de barra de desplazamiento en móvil
  const updateScrollBar = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const widthPct = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const leftPct = (maxScroll > 0 ? el.scrollLeft / maxScroll : 0) * (100 - widthPct);
    setScrollBar({ widthPct, leftPct });
  };

  useEffect(() => {
    updateScrollBar();
    window.addEventListener('resize', updateScrollBar);
    return () => window.removeEventListener('resize', updateScrollBar);
  }, []);

  return (
    <section
      className="w-screen max-md:py-[20%] max-[1025px]:py-[10%] max-[1025px]:overflow-hidden max-md:overflow-hidden"
      id="services"
    >
      <div className="flex flex-col py-[10%] gap-[7vw] max-[1025px]:py-0 max-md:gap-[1vw]">
        
        {/* Marquesina infinita interactiva con enlaces a folletos y planos */}
        <FadeUp>
          <div className="w-full">
            <MarquesinaArrastrable
              items={PILDORAS_MARQUESINA}
              speed={1}
              renderItem={(item) => (
                <a
                  href={item.link}
                  onClick={(e) => {
                    e.preventDefault();
                    openEnquiryModal();
                  }}
                  className="fadeUp group relative inline-flex h-[7.2vw] min-w-[30vw] items-center justify-center overflow-hidden rounded-full border border-[#ca8216] bg-white px-[2.5vw] text-center text-[1.6vw] hover:border-black text-[#111111] [text-rendering:geometricPrecision] transition-colors duration-500 max-[1025px]:h-[7vw] max-[1025px]:min-w-[33.5vw] max-[1025px]:px-[2.5vw] max-[1025px]:text-[2.2vw] max-[1025px]:font-normal max-md:h-[15vw] max-md:min-w-[65vw] max-md:px-[4.5vw] max-md:text-[4.2vw] max-md:font-normal shrink-0"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-black transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                    {item.text}
                  </span>
                </a>
              )}
            />
          </div>
        </FadeUp>

        {/* Galería Acordeón: Cada tarjeta se expande al 50% al pasar el cursor */}
        <div>
          <FadeUp>
            <div
              ref={scrollContainerRef}
              onScroll={updateScrollBar}
              className="w-full h-full px-[5%] no-scrollbar max-[1025px]:overflow-x-auto overflow-hidden max-md:pr-0 max-md:mt-[10%] max-[1025px]:w-screen max-[1025px]:ml-0 max-md:ml-0 max-md:px-[5vw]"
            >
              <div className="flex relative gap-[1.5%] aspect-[2.5] fadeup max-[1025px]:flex max-[1025px]:w-max max-[1025px]:ml-[5%] max-[1025px]:aspect-auto max-[1025px]:overflow-visible max-[1025px]:mb-[5vw] max-[1025px]:gap-[3vw] max-md:gap-[3vw]">
                {TARJETAS_SERVICIOS.map((card, idx) => (
                  <div
                    key={idx}
                    className="group w-[20%] flex rounded-[24px] h-[65vh] overflow-hidden items-start [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)] p-[1vw] no-underline transition-all duration-350 ease-in-out relative hover:w-[50%] focus:w-[50%] max-[1025px]:w-[65vw] max-[1025px]:hover:w-[65vw] max-[1025px]:focus:w-[65vw] max-md:w-[75vw] max-md:hover:w-[75vw] max-md:focus:w-[75vw] max-[1025px]:h-[50vh] max-md:h-[55vh] max-[1025px]:p-[4vw] shrink-0"
                  >
                    <img
                      alt={card.title}
                      src={card.img}
                      loading="lazy"
                      className="absolute inset-0 object-cover object-center h-full w-full transition-all duration-350 ease-in-out scale-110 group-hover:scale-100 group-focus:scale-100"
                    />
                    <div className="stripe-label relative z-10 max-w-[15vw] backdrop-blur-xl px-[2vw] py-[1vw] bg-white/10 rounded-lg overflow-hidden w-fit duration-500 ease-in-out transition-all group-hover:max-w-[42vw] group-focus:max-w-[42vw] max-[1025px]:max-w-[90%] max-[1025px]:py-[2vw] max-[1025px]:px-[3vw]">
                      <p
                        className="truncate text-[1.15vw] font-medium! font-head text-white uppercase whitespace-nowrap max-md:text-[4vw] max-[1025px]:text-[3vw]"
                        title={card.title}
                      >
                        {card.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Indicador de progreso de scroll en dispositivos móviles */}
          <div className="relative mt-[3vw] mx-[5%] hidden h-[0.4vw] overflow-hidden rounded-full bg-[#e5e5e5] max-[1025px]:block max-[1025px]:h-[0.8vw] max-md:mx-[5vw] max-md:mt-[6vw]">
            <div
              className="absolute inset-y-0 rounded-l-full bg-black"
              style={{ width: `${scrollBar.widthPct}%`, left: `${scrollBar.leftPct}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}

