// Componentes: SeccionPreguntasFrecuentes, SeccionPuntosUbicacion y SeccionRetornoInversion
import React, { useEffect, useMemo, useRef, useState } from 'react';
import SplitReveal from '../ui/SplitReveal';
import { FadeUp } from '../ui/FadeUp';
import { FAQGroup, FAQWrapper, FAQTitle, FAQContent } from '../ui/AnimatedFAQ';
import HorizontalDragCarousel, { GsapCarousel } from '../ui/HorizontalDragCarousel';
import OdometerValue from '../ui/OdometerValue';
import { computeScrollProgressBar } from '../../utils/carouselMath';

// Preguntas frecuentes sobre ubicación, tipologías, precios y financiamiento
const PREGUNTAS_FRECUENTES = [
  {
    id: 'faq-1',
    question: '¿Dónde se encuentra ubicado Lumera Heights?',
    answer:
      'Lumera Heights se sitúa en Business Bay, Dubái, ofreciendo acceso directo a Downtown Dubai, Dubai Mall, Burj Khalifa y a los principales distritos financieros y de ocio.',
  },
  {
    id: 'faq-2',
    question: '¿Qué tipologías de residencias están disponibles?',
    answer:
      'El proyecto cuenta con departamentos de 1, 2 y 3 dormitorios, además de una exclusiva colección de penthouses con ventanales de piso a techo y finos acabados contemporáneos.',
  },
  {
    id: 'faq-3',
    question: '¿Qué amenidades disfrutan los residentes?',
    answer:
      'Los residentes disfrutan de piscina semiolímpica, spa de bienestar, gimnasio de alto rendimiento, salones de relajación, terrazas ajardinadas y áreas de juego infantiles.',
  },
  {
    id: 'faq-4',
    question: '¿Cuál es el precio base de preventa?',
    answer:
      'Las residencias en Lumera Heights inician desde $500,000 USD, variando según la tipología, el nivel de piso, los metros cuadrados y las vistas.',
  },
  {
    id: 'faq-5',
    question: '¿Existe un plan de financiamiento disponible?',
    answer:
      'Sí. Ofrecemos un plan flexible 60/40, con el 60% pagadero en cuotas durante la construcción y el 40% restante contra entrega de llaves.',
  },
];

// Puntos emblemáticos y distancias en ruta
const PUNTOS_CERCANOS = [
  {
    distance: '5km',
    location: 'Palm Jumeirah',
    img: '/assets/media/highlight-1.2o4ruh3co9gp1.webp',
  },
  {
    distance: '10km',
    location: 'Dubai Marina',
    img: '/assets/media/highlight-2.1ti575w44jlvy.webp',
  },
  {
    distance: '2km',
    location: 'Business Bay',
    img: '/assets/media/highlight-3.2yq2_hh19bz8_.webp',
  },
  {
    distance: '1.5km',
    location: 'Burj Khalifa',
    img: '/assets/media/highlight-4.3vksmdf5sb28p.webp',
  },
];

// Métricas de retorno y facilidades de pago
const ESTADISTICAS_RETORNO = [
  { value: '$500K+', suffix: 'USD', label: 'Precio Desde' },
  { value: '60 / 40', label: 'Plan en Cuotas' },
  { value: '1 a 3', label: 'Dormitorios' },
  { value: '2028', suffix: 'Dic', label: 'Fecha de Entrega' },
];

// Sección de Preguntas Frecuentes
export function SeccionPreguntasFrecuentes() {
  return (
    <section className="py-[5%] max-md:pt-[20%]" id="faq">
      <div className="w-full ml-auto max-md:w-full max-[1025px]:w-full px-[5%] max-md:px-[6%]">
        <SplitReveal>
          <h2
            data-para-anim
            className="font-heading text-[#1C1B1A] max-md:mb-[10vw] font-medium! text-[3.8vw] leading-[1.2] max-[1025px]:text-[6.8vw] max-md:text-[8.8vw] mb-[5vw]"
          >
            Preguntas Frecuentes
          </h2>
        </SplitReveal>
        <FadeUp>
          <div className="w-full">
            <FAQGroup allowMultiple={false} defaultOpenItems={['faq-1']}>
              {PREGUNTAS_FRECUENTES.map((item) => (
                <FAQWrapper
                  key={item.id}
                  itemId={item.id}
                  className="group relative mb-[1.1vw] overflow-hidden rounded-md border border-[#111111] transition-colors duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] aria-expanded:border-[#E0D4C6] max-md:mb-[4vw] max-md:rounded-[4.5vw] max-[1025px]:mb-[2vw] max-[1025px]:rounded-[2.5vw]"
                  titleClassName="relative z-2 text-[1.5vw] font-medium text-black max-md:text-[5vw] max-[1025px]:text-[3.5vw]"
                  contentClassName="relative z-2"
                  iconClassName="relative flex h-[2.6vw] w-[2.6vw] items-center justify-center rounded-full border border-black text-black max-md:h-[9vw] max-md:w-[9vw] max-[1025px]:h-[6vw] max-[1025px]:w-[6vw]"
                  iconSize={18}
                  iconStrokeWidth={1.8}
                  duration={0.5}
                >
                  <div className="absolute inset-0 origin-top scale-y-0 bg-[#E0D4C6] transition-transform duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-aria-expanded:scale-y-100" />
                  <FAQTitle
                    className="gap-[2vw] font-heading py-[1.6vw] pl-[2.2vw] pr-[1.6vw] text-left max-md:py-[5vw] max-md:pl-[6vw] max-md:pr-[5vw] max-[1025px]:py-[3vw] max-[1025px]:pl-[4vw] max-[1025px]:pr-[3vw] [&>div:first-child]:max-md:w-[80%]"
                    iconMode="plus"
                  >
                    {item.question}
                  </FAQTitle>
                  <FAQContent className="w-[65%] space-y-[1.5vw] pl-[2.2vw] pb-[1.8vw] text-[1.15vw] leading-normal font-normal text-black max-md:w-[80%] max-md:space-y-[4vw] max-md:pl-[6vw] max-md:pb-[6vw] max-md:text-[4vw] max-[1025px]:w-[90%] max-[1025px]:pl-[4vw] max-[1025px]:pb-[3vw] max-[1025px]:text-[2.7vw]">
                    <p data-para-anim>{item.answer}</p>
                  </FAQContent>
                </FAQWrapper>
              ))}
            </FAQGroup>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// Sección de Ubicación y Puntos de Interés
export function SeccionPuntosUbicacion() {
  const carouselRef = useRef<GsapCarousel | null>(null);
  const rafRef = useRef<number | null>(null);
  const [bar, setBar] = useState({ width: 100, left: 0 });

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

  return (
    <section
      className="pb-[7%] pt-[5%] space-y-[6vw]! max-[1025px]:space-y-[12vw]! overflow-hidden max-md:py-[15%]"
      id="highlights"
    >
      <div className="px-[5%] max-md:px-[6%] flex flex-col gap-[1.5vw]">
        <SplitReveal>
          <h2
            data-para-anim
            className="font-heading font-medium! text-[#1C1B1A] text-[3.8vw] leading-[1.2] max-[1025px]:text-[6.8vw] max-md:text-[8.8vw]"
          >
            Puntos de Interés Cercanos
          </h2>
        </SplitReveal>
      </div>

      <FadeUp>
        <div>
          <HorizontalDragCarousel
            config={carouselConfig}
            wrapperClassName="fadeup pl-[5%] pr-[5%] pb-[1vw] gap-[1.2vw] max-[1025px]:gap-[8vw]"
            itemClassName="cursor-grab active:cursor-grabbing"
            onReady={(inst) => {
              carouselRef.current = inst;
            }}
          >
            {PUNTOS_CERCANOS.map((item, idx) => (
              <div
                key={idx}
                className="relative h-[27vw] w-[40vw] shrink-0 overflow-hidden rounded-lg max-[1025px]:h-[50vw] max-[1025px]:w-[78vw] max-md:h-[62vw] max-md:w-[84vw]"
              >
                <img
                  src={item.img}
                  alt={item.location}
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute bottom-4 left-0 p-[2vw] max-md:p-[5vw]">
                  <p className="text-[1.3vw] text-white/80 max-md:text-[3.2vw]">
                    <span className="font-medium text-white">A {item.distance}</span> de
                  </p>
                  <p className="mt-1.5 uppercase text-white text-[2vw] leading-[1.1] max-md:text-[6vw]">
                    {item.location}
                  </p>
                </div>
              </div>
            ))}
          </HorizontalDragCarousel>

          <div
            className="relative overflow-hidden rounded-full bg-[#e5e5e5] mt-[3.6vw] mx-[5%] h-[0.4vw] w-[90%] max-[1025px]:h-[1.5vw] max-md:mt-[7vw] max-md:w-[90vw]"
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

// Sección de Rentabilidad y Retorno de Inversión (ROI)
export function SeccionRetornoInversion() {
  return (
    <section className="py-[5%] max-md:pb-[20%]" id="roi">
      <div className="px-[5%] max-md:px-[6%] flex flex-col gap-[6vw] max-md:gap-[7vw]">
        <div className="flex justify-between max-[1025px]:flex-col max-md:gap-[7vw] max-[1025px]:gap-[5vw]">
          <SplitReveal className="w-[35%] max-[1025px]:w-full">
            <h2
              data-para-anim
              className="font-heading text-[#1C1B1A] font-medium! text-[3.8vw] leading-[1.2] max-[1025px]:text-[6.8vw] max-md:text-[8.8vw]"
            >
              Invierta en el Próximo Hito de Dubái
            </h2>
          </SplitReveal>
          <SplitReveal className="w-[40%] max-[1025px]:w-full">
            <p
              data-para-anim
              className="max-[1025px]:text-[3vw] text-[#1C1B1A] max-md:w-full max-md:text-[4.2vw] text-[1.3vw]"
            >
              Adquiera una residencia donde la distinción arquitectónica, la ubicación privilegiada
              y el estilo de vida superior convergen. Lumera Heights representa una inversión de
              alto valor a largo plazo.
            </p>
          </SplitReveal>
        </div>

        {/* Píldoras con bordes dorados e indicadores numéricos animados */}
        <FadeUp>
          <div className="flex flex-wrap gap-[3.5vw] fadeup max-md:gap-[5vw] max-[1025px]:gap-[2.5vw]">
            {ESTADISTICAS_RETORNO.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col max-[1025px]:w-[45%] mx-auto items-center justify-center gap-[0.4vw] rounded-full max-[1025px]:rounded-lg max-[1025px]:px-2 border border-[#ca8216] px-[5vw] py-[2.2vw] text-center max-md:px-[7vw] max-md:py-[5vw] max-md:gap-[2vw] max-[1025px]:py-[3vw]"
              >
                <p className="flex items-end justify-center gap-[0.15em] font-heading font-medium text-[2.5vw] leading-none text-black max-md:text-[5vw] max-[1025px]:text-[3.2vw]">
                  <OdometerValue value={stat.value} />
                  {stat.suffix && (
                    <span className="mb-[0.2vw] font-heading text-[0.9vw] leading-none text-[#1c1b1a] max-md:text-[3vw] max-[1025px]:text-[1.8vw]">
                      {stat.suffix}
                    </span>
                  )}
                </p>
                <p className="text-[1.1vw] text-[#1c1b1a] max-md:text-[3.2vw] max-[1025px]:text-[1.8vw]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// Aliases para compatibilidad hacia atrás
export { SeccionPreguntasFrecuentes as FAQSection };
export { SeccionPuntosUbicacion as HighlightsSection };
export { SeccionRetornoInversion as RoiSection };

