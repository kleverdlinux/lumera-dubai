// Componente SeccionCaracteristicas: Columnas de amenidades y galería central con cambio de color
import React, { useRef } from 'react';
import gsap from 'gsap';
import SplitReveal from '../ui/SplitReveal';
import { FadeUp } from '../ui/FadeUp';
import { prefersReducedMotion } from '../../utils/motion';

interface ElementoCaracteristica {
  name: string;
  icon: string;
  image: string;
  color: string;
}

// Amenidades de la columna izquierda
const CARACTERISTICAS_IZQUIERDA: ElementoCaracteristica[] = [
  {
    name: 'Vestíbulo Principal',
    icon: '/assets/media/entrance-lobby.43yt5qvv2dl46.svg',
    image: '/assets/media/gallery-1.2tr8oh4dnb21n.webp',
    color: '#E5DCCF',
  },
  {
    name: 'Escalera Escultural',
    icon: '/assets/media/feature-staircase.2mon55ttfkvmi.svg',
    image: '/assets/media/gallery-2.2dt0wjjv_h3yc.webp',
    color: '#E0D4C6',
  },
  {
    name: 'Salón Master Privado',
    icon: '/assets/media/master-living-room.1jpx4femrmxgy.svg',
    image: '/assets/media/gallery-3.22cj6wr3hyhnl.webp',
    color: '#DED2C2',
  },
  {
    name: 'Estudio Privado / Cava',
    icon: '/assets/media/private-study.3-zxjyz-10kk0.svg',
    image: '/assets/media/gallery-4.1m481449kym-x.webp',
    color: '#E4D9CB',
  },
  {
    name: 'Pabellón Acuático',
    icon: '/assets/media/water-pavilion.1kpc9kd6yvjgt.svg',
    image: '/assets/media/gallery-5.382k730mn05g7.webp',
    color: '#DDD1C0',
  },
];

// Amenidades de la columna derecha
const CARACTERISTICAS_DERECHA: ElementoCaracteristica[] = [
  {
    name: 'Spa de Hidromasaje',
    icon: '/assets/media/spa.3cpkkrga4d7n1.svg',
    image: '/assets/media/gallery-6.0g__0_4s0oeos.webp',
    color: '#E2D7C8',
  },
  {
    name: 'Solárium Sumergido',
    icon: '/assets/media/sunken-sun.1i-qts-w26xjm.svg',
    image: '/assets/media/gallery-7.2-zrh9luazir8.webp',
    color: '#E6DCCE',
  },
  {
    name: 'Lounge de Playa y Fuego',
    icon: '/assets/media/beach-lounge.3z469eb-p1wtu.svg',
    image: '/assets/media/gallery-8.02z8h_bsgimll.webp',
    color: '#DFD3C3',
  },
  {
    name: 'Duchas de Playa y Piscina',
    icon: '/assets/media/pool-and-beach.3z054-ag1pi9b.svg',
    image: '/assets/media/gallery-9.3d_onjr03hc9w.webp',
    color: '#E3D8CA',
  },
  {
    name: 'Playa Privada',
    icon: '/assets/media/private-beach.27ri96kcqgx85.svg',
    image: '/assets/media/gallery-10.1cbo8u21kbas-.webp',
    color: '#E7DDD0',
  },
];

export default function SeccionCaracteristicas() {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Maneja la interacción al colocar el cursor sobre una amenidad
  const handleHoverFeature = (feature: ElementoCaracteristica) => {
    const { image, color } = feature;

    // Mutación suave del color de fondo de la sección
    if (sectionRef.current) {
      if (prefersReducedMotion()) {
        sectionRef.current.style.backgroundColor = color;
      } else {
        gsap.to(sectionRef.current, { backgroundColor: color, duration: 0.5 });
      }
    }

    const container = imageContainerRef.current;
    if (!container) return;

    // Inserción y revelación animada de la nueva fotografía
    const newImg = document.createElement('img');
    newImg.src = image;
    newImg.alt = feature.name;
    newImg.style.position = 'absolute';
    newImg.style.inset = '0';
    newImg.style.width = '100%';
    newImg.style.height = '100%';
    newImg.style.objectFit = 'cover';
    container.appendChild(newImg);

    if (prefersReducedMotion()) {
      Array.from(container.children)
        .filter((el) => el !== newImg)
        .forEach((el) => el.remove());
    } else {
      gsap.fromTo(
        newImg,
        { scale: 0 },
        {
          scale: 1.05,
          duration: 0.45,
          ease: 'power2.out',
          onComplete: () => {
            let prev = newImg.previousElementSibling;
            while (prev) {
              const toRemove = prev;
              prev = prev.previousElementSibling;
              gsap.killTweensOf(toRemove);
              toRemove.remove();
            }
          },
        }
      );
    }
  };

  // Renderiza una columna de características con ícono, título y separador
  const renderColumn = (items: ElementoCaracteristica[]) => (
    <div className="flex flex-col gap-[3vw] w-full max-[1025px]:gap-[4vw]">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="cursor-pointer"
          onMouseEnter={() => handleHoverFeature(item)}
          onClick={() => handleHoverFeature(item)}
        >
          <div className="fadeup flex gap-[2vw] items-center pb-[1vw] max-md:gap-[4vw] max-[1025px]:pb-[1.5vw]">
            <div className="h-[2.6vw] w-[2.6vw] shrink-0 max-md:w-[9vw] max-md:h-[9vw] max-[1025px]:w-[3.5vw] max-[1025px]:h-[3.5vw]">
              <div className="w-full h-full relative">
                <img
                  loading="lazy"
                  src={item.icon}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h4 className="font-head uppercase text-[1.25vw] tracking-wide max-md:text-[3.8vw] max-[1025px]:text-[2.2vw] text-[#2B2B2B]">
              {item.name}
            </h4>
          </div>
          <div className="bg-[#11111154] w-full h-px lineDraw" />
        </div>
      ))}
    </div>
  );

  return (
    <section
      className="py-[5%] bg-[#E0D4C6] relative z-10 max-md:py-[10%] max-[1025px]:py-[7%]"
      ref={sectionRef}
    >
      <div className="px-[5%] max-md:px-[6%]">
        <SplitReveal>
          <h2
            data-title-anim
            className="font-heading font-medium! text-[#1C1B1A] text-[3.8vw] leading-[1.2] max-[1025px]:text-[6.8vw] max-md:text-[8.8vw] mb-[2vw]"
          >
            Características Principales
          </h2>
        </SplitReveal>
        <SplitReveal className="w-[40%] max-[1025px]:w-full">
          <p
            data-para-anim
            className="max-md:py-[3vw] max-[1025px]:text-[3.5vw] max-md:text-[4.2vw] text-[1.25vw] text-[#1C1B1A] tracking-wide"
          >
            Los interiores de Lumera Heights reflejan un equilibrio refinado entre lujo
            contemporáneo y elegancia funcional.
          </p>
        </SplitReveal>

        {/* Bloque Tripartito: Columna Izq + Foto Central Reactiva + Columna Der */}
        <FadeUp>
          <div className="w-full mt-[6vw] mb-[2vw] relative flex items-start justify-between gap-[3vw] max-[1025px]:flex-col max-md:gap-[4vw]">
            <div className="w-[27%] my-auto max-[1025px]:w-full max-[1025px]:order-1">
              {renderColumn(CARACTERISTICAS_IZQUIERDA)}
            </div>
            
            {/* Contenedor central de previsualización dinámica */}
            <div className="w-[33%] h-[45vw] shrink-0 z-10 overflow-hidden relative fadeup max-[1025px]:static max-[1025px]:w-full max-md:w-full max-md:h-[120vw] max-[1025px]:h-[70vw] max-[1025px]:order-0">
              <div className="w-full h-full relative overflow-hidden" ref={imageContainerRef}>
                <img
                  src={CARACTERISTICAS_IZQUIERDA[0].image}
                  alt="Vista previa de características Lumera"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="w-[27%] my-auto max-[1025px]:w-full max-[1025px]:order-2">
              {renderColumn(CARACTERISTICAS_DERECHA)}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

