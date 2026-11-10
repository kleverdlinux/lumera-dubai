// Componente SeccionArquitectura: Galería asimétrica con paralaje y transición a modo oscuro
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitReveal from '../ui/SplitReveal';
import { WhiteFillButton } from '../ui/AnimatedFillButton';
import { prefersReducedMotion } from '../../utils/motion';
import { useEnquiryModal } from '../EnquiryModal';

gsap.registerPlugin(ScrollTrigger);

interface MetadatosImagen {
  src: string;
  width: number;
  height: number;
}

// Registro de fotografías arquitectónicas y sus proporciones nativas
const ARCH_1: MetadatosImagen = {
  src: '/assets/media/architecture-1.1ldiswkqp2nfk.webp',
  width: 792,
  height: 530,
};
const ARCH_2: MetadatosImagen = {
  src: '/assets/media/architecture-2.29sr9ck226de-.webp',
  width: 493,
  height: 686,
};
const ARCH_3: MetadatosImagen = {
  src: '/assets/media/architecture-3.1hte-psscjaqp.webp',
  width: 880,
  height: 627,
};
const ARCH_4: MetadatosImagen = {
  src: '/assets/media/architecture-4.3g4m-dtlc9x19.webp',
  width: 792,
  height: 530,
};
const ARCH_5: MetadatosImagen = {
  src: '/assets/media/architecture-5.0oeb_1-3n5e4p.webp',
  width: 493,
  height: 686,
};

interface PropsImagenParallax {
  src: MetadatosImagen;
  alt?: string;
  wrapperClassName?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  translateY?: string;
  start?: string;
  end?: string;
  scrub?: boolean;
  enableScale?: boolean;
  scaleFrom?: number;
  scaleTo?: number;
}

// Imagen con efecto paralaje vinculado al desplazamiento de la ventana
function ImagenParallax({
  src,
  alt = 'imagen-arquitectura',
  wrapperClassName = 'h-[50vh] w-[50vw]',
  imageClassName = '',
  width = 700,
  height = 1000,
  translateY = '40%',
  start = 'top bottom',
  end = 'bottom top',
  scrub = true,
  enableScale = false,
  scaleFrom = 1.6,
  scaleTo = 1.2,
}: PropsImagenParallax) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reduced = prefersReducedMotion();

  const effectiveTranslateY = reduced
    ? (() => {
        const match = translateY.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
        if (!match) return translateY;
        return `${(0.25 * parseFloat(match[1])).toFixed(2)}${match[2]}`;
      })()
    : translateY;

  const effectiveScaleFrom = reduced ? 1 + (scaleFrom - 1) * 0.25 : scaleFrom;
  const effectiveScaleTo = reduced ? 1 + (scaleTo - 1) * 0.25 : scaleTo;

  useEffect(() => {
    if (!wrapperRef.current || !imgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(imgRef.current, { scale: enableScale ? effectiveScaleFrom : undefined });
      gsap.to(imgRef.current, {
        translateY: effectiveTranslateY,
        scale: enableScale ? effectiveScaleTo : undefined,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start,
          end,
          scrub,
        },
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, [effectiveTranslateY, start, end, scrub, enableScale, effectiveScaleFrom, effectiveScaleTo]);

  return (
    <div ref={wrapperRef} className={`overflow-hidden ${wrapperClassName}`}>
      <img
        ref={imgRef}
        width={width}
        height={height}
        src={src.src}
        alt={alt}
        className={`h-full w-full object-cover ${imageClassName}`}
      />
    </div>
  );
}

const CLASE_DISTINTIVO_GLASS = 'backdrop-blur-[14px] [backdrop-filter:blur(14px)]';

// Muestra el ícono y las dimensiones del render
function EtiquetaDimensiones({ image }: { image: MetadatosImagen }) {
  return (
    <div className="flex items-center gap-[0.6vw] max-[1025px]:gap-[1vw] max-md:gap-[2vw]">
      <img
        src="/assets/media/square.1cwv39loq1iwf.svg"
        className="h-[1.2vw] w-[1.2vw] object-contain max-[1025px]:h-[2.2vw] max-[1025px]:w-[2.2vw] max-md:h-[4.5vw] max-md:w-[4.5vw]"
        alt=""
        aria-hidden="true"
      />
      <p className="tracking-tight text-[1vw]">
        {image.width} x {image.height}
      </p>
    </div>
  );
}

// Botón que abre el modal para solicitar la galería completa
function BotonVerGaleria({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <div>
      <WhiteFillButton
        link="#"
        btnText={text}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className="fadeUp h-[2.9vw] w-fit px-[1vw] pr-[2.35vw] text-[0.85vw] gap-1 [--button-height:2.4vw] [--icon-circle:1.8vw] [--icon-right:0.3vw] max-[1025px]:h-[4vw] max-[1025px]:px-[1.6vw] max-[1025px]:pr-[4.1vw] max-[1025px]:text-[1.5vw] max-[1025px]:[--button-height:4vw] max-[1025px]:[--icon-circle:3vw] max-[1025px]:[--icon-right:0.5vw] max-md:h-[8vw] max-md:px-[3vw] max-md:pr-[8vw] max-md:text-[3vw] max-md:[--button-height:8vw] max-md:[--icon-circle:6vw] max-md:[--icon-right:1vw]"
      />
    </div>
  );
}

export default function SeccionArquitectura() {
  const [isMobile, setIsMobile] = useState(false);
  const { openEnquiryModal } = useEnquiryModal();

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 1024);
    const raf = window.requestAnimationFrame(checkViewport);
    window.addEventListener('resize', checkViewport);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  // 1. Cambio cromático global: la pantalla se vuelve oscura al entrar a #works
  useEffect(() => {
    if (window.innerWidth > 1024) {
      const ctx = gsap.context(() => {
        const body = document.body;
        const bgTitle = document.getElementById('work-bg-title');
        const setColors = ({
          bodyColor,
          titleColor,
        }: {
          bodyColor: string;
          titleColor: string;
        }) => {
          gsap.to(body, { backgroundColor: bodyColor, duration: 1, ease: 'power2.out' });
          if (bgTitle) {
            gsap.to(bgTitle, { color: titleColor, duration: 1, ease: 'power2.out' });
          }
        };

        ScrollTrigger.create({
          trigger: '#works',
          start: 'top 60%',
          end: 'bottom 20%',
          onEnter: () => setColors({ bodyColor: '#1C1C1C', titleColor: '#2A2A2A' }),
          onLeaveBack: () => setColors({ bodyColor: '#ffffff', titleColor: '#ffffff' }),
        });

        ScrollTrigger.create({
          trigger: '#project',
          start: 'top 60%',
          onEnter: () => setColors({ bodyColor: '#ffffff', titleColor: '#ffffff' }),
          onLeaveBack: () => setColors({ bodyColor: '#1C1C1C', titleColor: '#2A2A2A' }),
        });
      });
      return () => ctx.revert();
    }
  }, []);

  // 2. Fijación (pin) del gran título de marca de agua de fondo
  useEffect(() => {
    const ctx = gsap.context(() => {
      const bgIcon = document.getElementById('work-bg-icon');
      const worksEl = document.getElementById('works');
      if (bgIcon && worksEl) {
        ScrollTrigger.create({
          trigger: bgIcon,
          start: 'top 10%',
          endTrigger: worksEl,
          end: '90% 80%',
          invalidateOnRefresh: true,
          pin: bgIcon,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="works"
      className="w-full h-full overflow-hidden max-md:bg-[#1C1B1A] max-[1025px]:bg-[#1C1B1A] scroll-mt-24 max-md:scroll-mt-20 max-md:pt-[24vw] max-[1025px]:pt-[18vw] py-[5%] pb-[12%]"
    >
      <div className="relative mx-auto h-full w-full max-[1025px]:w-[85%] max-w-[90%] py-[2%] pb-[12%]">
        
        {/* Título de introducción filosófica */}
        <div className="w-full flex justify-center relative z-2">
          <SplitReveal className="w-[85%] max-md:w-full max-[1025px]:w-[80%]">
            <h2
              data-para-anim
              className="text-center font-heading text-[3.8vw] capitalize leading-tight text-white max-md:text-[6.5vw] max-[1025px]:text-[5.5vw]"
            >
              Lumera Heights se define por una audaz expresión arquitectónica, donde estructura,
              forma y luz convergen para forjar un icono vertical eterno.
            </h2>
          </SplitReveal>
        </div>

        {/* Cuadrícula Asimétrica de Fotografía Editorial y Ambientes */}
        <div className="w-full h-full flex-col mt-[10vw] relative z-2 max-[1025px]:mt-[20vw] max-md:mt-[20vw]">
          <div className="flex w-full h-full justify-between max-[1025px]:flex-col max-[1025px]:gap-[10vw] max-md:gap-[10vw]">
            
            {/* Foto 1: Salón Principal */}
            <div
              className="w-[40vw] h-full flex flex-col gap-[2vw] max-md:w-full max-md:gap-[7vw] max-[1025px]:w-full max-[1025px]:mx-auto"
              data-scroll
              data-scroll-speed={isMobile ? undefined : '0.1'}
            >
              <div className="w-[40vw] h-[27vw] relative rounded-[2vw] overflow-hidden p-[2vw] group max-md:w-[85vw] max-md:h-[70vw] max-md:p-[4vw] max-[1025px]:w-[85vw] max-[1025px]:h-[70vw]">
                <ImagenParallax
                  src={ARCH_1}
                  alt="Salón Principal"
                  translateY="15%"
                  wrapperClassName="absolute inset-0 h-full w-full group-hover:scale-[1.1] transition-all ease-in-out duration-500"
                  imageClassName="scale-[1.5] -translate-y-[15%]"
                />
                <div
                  className={`w-fit max-w-[85%] whitespace-nowrap h-[3.5vw] p-[1vw] px-[1vw] rounded-[0.8vw] bg-white/40 relative z-3 text-[1.2vw] font-heading font-medium! ${CLASE_DISTINTIVO_GLASS} overflow-hidden group-hover:h-[11vw] transition-all ease-in-out duration-300 max-[1025px]:h-[7vw] max-[1025px]:w-fit max-[1025px]:py-[2vw] max-[1025px]:px-[3.5vw] max-[1025px]:text-[2.8vw] max-[1025px]:group-hover:h-[20vw] max-md:h-[10.5vw] max-md:w-fit max-md:py-[2vw] max-md:px-[4vw] max-md:text-[3.8vw] max-md:group-hover:h-[32vw]`}
                >
                  Salón Principal
                  <div className="w-full h-full flex flex-col gap-[1.5vw] max-[1025px]:mt-[2vw] mt-[0.5vw]">
                    <EtiquetaDimensiones image={ARCH_1} />
                    <BotonVerGaleria text="Ver Galería" onClick={openEnquiryModal} />
                  </div>
                </div>
              </div>
              <SplitReveal>
                <p
                  data-para-anim
                  className="text-white w-[38vw] max-[1025px]:w-full mt-[2vw] max-md:text-[4.2vw] max-[1025px]:text-[3vw] text-[1.25vw] tracking-wide"
                >
                  Cada residencia está concebida en torno a la luz, la proporción y los materiales
                  nobles. Desde amplias salas hasta serenos refugios privados, cada detalle recrea
                  una atmósfera de refinada sofisticación sobre la ciudad.
                </p>
              </SplitReveal>
            </div>

            {/* Foto 2: Cocina de Autor */}
            <div
              className="w-[25vw] h-fit relative mr-[6%] mt-[40%] z-4 max-md:mt-0 max-md:mr-auto max-[1025px]:mt-0 max-[1025px]:w-full max-[1025px]:mx-auto"
              data-scroll
              data-scroll-speed={isMobile ? undefined : '-0.1'}
            >
              <div className="w-[25vw] max-md:w-[85vw] max-md:h-[70vw] h-[35vw] rounded-[2vw] absolute top-0 left-0 overflow-hidden max-[1025px]:relative p-[1.5vw] group max-md:p-[4vw] fadeup max-[1025px]:w-[85vw] max-[1025px]:h-[70vw] max-md:ml-0">
                <ImagenParallax
                  src={ARCH_2}
                  alt="Cocina de Lujo"
                  translateY="15%"
                  wrapperClassName="absolute inset-0 h-full w-full group-hover:scale-[1.1] transition-all ease-in-out duration-500"
                  imageClassName="scale-[1.5] -translate-y-[15%]"
                />
                <div
                  className={`w-fit max-w-[85%] whitespace-nowrap h-[3.5vw] p-[1vw] px-[1vw] rounded-[0.8vw] bg-white/40 relative z-3 text-[1.2vw] font-heading font-medium! ${CLASE_DISTINTIVO_GLASS} overflow-hidden group-hover:h-[11vw] transition-all ease-in-out duration-300 max-[1025px]:h-[7vw] max-[1025px]:w-fit max-[1025px]:py-[2vw] max-[1025px]:px-[3.5vw] max-[1025px]:text-[2.8vw] max-[1025px]:group-hover:h-[20vw] max-md:h-[10.5vw] max-md:w-fit max-md:py-[2vw] max-md:px-[4vw] max-md:text-[3.8vw] max-md:group-hover:h-[32vw]`}
                >
                  Cocina
                  <div className="w-full h-full flex flex-col gap-[1.5vw] max-[1025px]:mt-[2vw] mt-[0.5vw]">
                    <EtiquetaDimensiones image={ARCH_2} />
                    <BotonVerGaleria text="Ver Galería" onClick={openEnquiryModal} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Foto 3: Dormitorio Principal */}
          <div
            className="w-fit h-full mt-[30vh] relative max-md:mt-[15vw] max-[1025px]:mt-[15vw] max-[1025px]:mx-auto"
            data-scroll
            data-scroll-speed={isMobile ? undefined : '-0.1'}
          >
            <div className="w-[47vw] h-[35vw] relative rounded-[2vw] overflow-hidden ml-[3%] p-[2vw] group max-md:w-[85vw] max-md:h-[70vw] max-md:ml-0 max-md:p-[4vw] fadeup max-[1025px]:w-[85vw] max-[1025px]:h-[70vw] max-[1025px]:ml-0">
              <ImagenParallax
                src={ARCH_3}
                alt="Dormitorio Master"
                translateY="15%"
                wrapperClassName="absolute inset-0 h-full w-full group-hover:scale-[1.1] transition-all ease-in-out duration-500"
                imageClassName="scale-[1.5] -translate-y-[15%]"
              />
              <div
                className={`w-fit max-w-[85%] whitespace-nowrap h-[3.5vw] p-[1vw] px-[1vw] rounded-[0.8vw] bg-white/40 relative z-3 text-[1.2vw] font-heading font-medium! ${CLASE_DISTINTIVO_GLASS} overflow-hidden group-hover:h-[11vw] transition-all ease-in-out duration-300 max-[1025px]:h-[7vw] max-[1025px]:w-fit max-[1025px]:py-[2vw] max-[1025px]:px-[3.5vw] max-[1025px]:text-[2.8vw] max-[1025px]:group-hover:h-[20vw] max-md:h-[10.5vw] max-md:w-fit max-md:py-[2vw] max-md:px-[4vw] max-md:text-[3.8vw] max-md:group-hover:h-[32vw]`}
              >
                Dormitorio
                <div className="w-full h-full flex flex-col max-[1025px]:mt-[2vw] gap-[1.5vw] mt-[0.5vw]">
                  <EtiquetaDimensiones image={ARCH_3} />
                  <BotonVerGaleria text="Ver Galería" onClick={openEnquiryModal} />
                </div>
              </div>
            </div>
            <SplitReveal className="w-[47vw] max-[1025px]:w-[70vw] max-md:w-full max-[1025px]:ml-0 max-md:ml-0 h-full flex ml-[3%] mt-[5vw]">
              <p
                data-para-anim
                className="w-[38vw] max-[1025px]:w-full text-white text-left text-[1.25vw] max-[1025px]:text-[3vw] max-md:w-full tracking-wide max-md:text-[4.2vw]"
              >
                Desde acabados a medida hasta vistas panorámicas a la ciudad, cada espacio está
                ideado para elevar lo cotidiano. Materiales cálidos y fina artesanía se unen
                para dar vida a residencias tan excepcionales como la gran metrópoli.
              </p>
            </SplitReveal>
          </div>

          {/* Fotos 4 y 5: Suite Privada y Baño en Mármol */}
          <div
            className="w-full h-full flex justify-between max-[1025px]:flex-col max-[1025px]:items-center mt-[15vh] max-md:mt-[10vw] max-md:flex-col max-[1025px]:mt-[10vw]"
            data-scroll
            data-scroll-speed={isMobile ? undefined : '0.1'}
          >
            <div className="w-[40vw] h-[27vw] relative rounded-[2vw] overflow-hidden mt-[10vw] p-[2vw] group max-[1025px]:w-[85vw] max-[1025px]:h-[70vw] max-[1025px]:mt-[10vw] max-md:w-[85vw] max-md:h-[70vw] max-md:mt-[10vw] max-md:p-[4vw] fadeup">
              <ImagenParallax
                src={ARCH_4}
                alt="Suite Privada"
                translateY="15%"
                wrapperClassName="absolute inset-0 h-full w-full group-hover:scale-[1.1] transition-all ease-in-out duration-500"
                imageClassName="scale-[1.5] -translate-y-[15%]"
              />
              <div
                className={`w-fit max-w-[85%] whitespace-nowrap h-[3.5vw] p-[1vw] px-[1vw] rounded-[0.8vw] bg-white/40 relative z-3 text-[1.2vw] font-heading font-medium! ${CLASE_DISTINTIVO_GLASS} overflow-hidden group-hover:h-[11vw] transition-all ease-in-out duration-300 max-[1025px]:h-[7vw] max-[1025px]:w-fit max-[1025px]:py-[2vw] max-[1025px]:px-[3.5vw] max-[1025px]:text-[2.8vw] max-[1025px]:group-hover:h-[20vw] max-md:h-[10.5vw] max-md:w-fit max-md:py-[2vw] max-md:px-[4vw] max-md:text-[3.8vw] max-md:group-hover:h-[32vw]`}
              >
                Suite Privada
                <div className="w-full h-full flex flex-col max-[1025px]:mt-[2vw] gap-[1.5vw] mt-[0.5vw]">
                  <EtiquetaDimensiones image={ARCH_4} />
                  <BotonVerGaleria text="Ver Galería" onClick={openEnquiryModal} />
                </div>
              </div>
            </div>

            <div
              className="w-[30vw] h-full flex flex-col items-center gap-[4.5vw] max-md:mt-[10vw] max-md:w-full max-[1025px]:w-full max-[1025px]:mt-[10vw]"
              data-scroll
              data-scroll-speed={isMobile ? undefined : '-0.1'}
            >
              <div className="w-[25vw] h-[35vw] overflow-hidden rounded-[2vw] relative p-[2vw] group max-md:w-[85vw] max-md:h-[70vw] max-md:p-[4vw] fadeup max-[1025px]:w-[85vw] max-[1025px]:h-[70vw]">
                <ImagenParallax
                  src={ARCH_5}
                  alt="Baño Principal"
                  translateY="15%"
                  wrapperClassName="absolute inset-0 h-full w-full group-hover:scale-[1.1] transition-all ease-in-out duration-500"
                  imageClassName="scale-[1.5] -translate-y-[15%]"
                />
                <div
                  className={`w-fit max-w-[85%] whitespace-nowrap h-[3.5vw] p-[1vw] px-[1vw] rounded-[0.8vw] bg-white/40 relative z-3 text-[1.2vw] font-heading font-medium! ${CLASE_DISTINTIVO_GLASS} overflow-hidden group-hover:h-[11vw] transition-all ease-in-out duration-300 max-[1025px]:h-[7vw] max-[1025px]:w-fit max-[1025px]:py-[2vw] max-[1025px]:px-[3.5vw] max-[1025px]:text-[2.8vw] max-[1025px]:group-hover:h-[20vw] max-md:h-[10.5vw] max-md:w-fit max-md:py-[2vw] max-md:px-[4vw] max-md:text-[3.8vw] max-md:group-hover:h-[32vw]`}
                >
                  Baño Principal
                  <div className="w-full h-full flex flex-col max-[1025px]:mt-[2vw] gap-[1.5vw] mt-[0.5vw]">
                    <EtiquetaDimensiones image={ARCH_5} />
                    <BotonVerGaleria text="Ver Galería" onClick={openEnquiryModal} />
                  </div>
                </div>
              </div>
              <SplitReveal>
                <p
                  data-para-anim
                  className="text-white max-[1025px]:mt-[4vw] text-[1.25vw] tracking-wide max-md:text-[4.2vw] max-[1025px]:text-[3vw]"
                >
                  Interiores pensados con delicadeza, materiales selectos e imponentes vistas
                  panorámicas confluyen en espacios diseñados para vivir en el más alto nivel
                  contemporáneo.
                </p>
              </SplitReveal>
            </div>
          </div>
        </div>

        {/* Marca de agua tipográfica fija de fondo */}
        <div
          className="w-full h-full absolute max-[1025px]:hidden top-[10%] left-0 right-0 work-bg-icon"
          id="work-bg-icon"
        >
          <div className="w-full h-[50vw] pb-6 relative flex items-center justify-center max-md:h-[90vw]">
            <h2
              id="work-bg-title"
              className="w-[60vw] text-center font-medium! text-white text-[14vw] leading-[1.2] max-md:w-[90vw] font-heading"
            >
              LUMERA HEIGHTS
            </h2>
          </div>
        </div>

      </div>
    </section>
  );
}

