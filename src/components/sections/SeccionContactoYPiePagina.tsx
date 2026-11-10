// Componentes: SeccionLlamadoAccion (CTA) y PieDePagina (Footer con efecto cortina)
import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { DarkOutlineFillButton, WhiteFillButton } from '../ui/AnimatedFillButton';
import SplitReveal from '../ui/SplitReveal';
import { useEnquiryModal } from '../EnquiryModal';
import { FadeUp } from '../ui/FadeUp';
import StaggeredLink from '../ui/StaggeredLink';

// Imágenes de la cuadrícula de conversión
const IMAGENES_CTA = [
  {
    src: '/assets/media/cta-1.0-_qg3kedekdn.webp',
    alt: 'Interior de sala residencial en Lumera Heights',
  },
  {
    src: '/assets/media/cta-2.3sxqfck474crs.webp',
    alt: 'Cocina contemporánea en Lumera Heights',
  },
  {
    src: '/assets/media/cta-3.386hetcw1l51x.webp',
    alt: 'Dormitorio de lujo en Lumera Heights',
  },
  {
    src: '/assets/media/cta-4.0_lbvrwvhgbau.webp',
    alt: 'Fachada y exteriores del rascacielos Lumera',
  },
];

// Canales sociales oficiales
const ENLACES_SOCIALES = [
  { src: '/assets/media/facebook.3rvk6c12nuvo6.svg', label: 'Facebook' },
  { src: '/assets/media/x.1r34ohx23d2is.svg', label: 'Twitter' },
  { src: '/assets/media/instagram.3q4vb5gjm6944.svg', label: 'Instagram' },
  { src: '/assets/media/linkedin.3r_ty6i-5rokn.svg', label: 'LinkedIn' },
];

// Sección de Llamado a la Acción (CTA)
export function SeccionLlamadoAccion() {
  const { openEnquiryModal } = useEnquiryModal();
  const handleOpenModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openEnquiryModal();
  };

  return (
    <section
      className="relative z-10 bg-white px-[5%] py-[6%] max-md:px-[6%] max-md:py-[14%] max-[1025px]:py-[8%]"
      id="cta"
    >
      <FadeUp className="w-full overflow-hidden rounded-[2.5vw] border border-black max-md:rounded-[6vw] max-[1025px]:rounded-[4vw]">
        <div className="flex flex-col items-center gap-[1.8vw] px-[6vw] pt-[5vw] text-center max-md:gap-[6vw] max-md:px-[6vw] max-md:pt-[14vw] max-[1025px]:gap-[3vw] max-[1025px]:px-[8vw] max-[1025px]:pt-[8vw]">
          <SplitReveal className="max-w-[60%] max-[1025px]:max-w-[90%]">
            <h2
              data-para-anim
              className="font-medium! font-heading text-[#1C1B1A] text-[3.8vw] leading-[1.15] max-[1025px]:text-[5vw] max-md:text-[6.8vw]"
            >
              Hay Espacios que Deben Vivirse en Persona
            </h2>
          </SplitReveal>
          <SplitReveal className="w-[55%] max-[1025px]:w-[90%]">
            <p
              data-para-anim
              className="text-[1.2vw] leading-[1.6] text-[#1C1B1A] max-md:text-[4.2vw] max-[1025px]:text-[2.4vw]"
            >
              Cuéntenos sus requerimientos y nuestro equipo le presentará residencias exclusivas
              que se adapten a su estilo de vida, prioridades y visión en Dubái.
            </p>
          </SplitReveal>

          {/* Botones de acción hacia el modal de consulta */}
          <FadeUp>
            <div className="mt-[1vw] flex items-center gap-[1.2vw] fadeup max-md:mt-[4vw] max-md:w-full max-[1025px]:flex-col max-md:gap-[4vw] max-[1025px]:gap-[2.5vw]">
              <DarkOutlineFillButton
                btnText="Agendar Consulta Privada"
                link="#"
                onClick={handleOpenModal}
                className="bg-[#1c1b1a] font-normal!"
                borderColor="#1c1b1a"
              />
              <WhiteFillButton
                btnText="Contactar al Equipo"
                link="#"
                onClick={handleOpenModal}
                className="border border-[#1c1b1a] max-[1025px]:w-full"
              />
            </div>
          </FadeUp>
        </div>

        {/* Cuadrícula de fotografías preview */}
        <FadeUp>
          <div className="mt-[3.5vw] max-[1025px]:pb-[5vw] max-[1025px]:grid-cols-2 max-[1025px]:px-[6vw] grid grid-cols-4 gap-[1.5vw] px-[3vw] pb-[3vw] max-md:mt-[8vw] max-md:grid-cols-2 max-md:gap-[2.5vw] max-md:px-[5vw] max-md:pb-[5vw] max-[1025px]:gap-[1.5vw]">
            {IMAGENES_CTA.map(({ src, alt }, idx) => (
              <div
                key={idx}
                className="group relative aspect-4/3 overflow-hidden rounded-[1.2vw] max-md:rounded-[3vw] max-[1025px]:rounded-[2vw]"
              >
                <img
                  src={src}
                  alt={alt}
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </FadeUp>
      </FadeUp>
    </section>
  );
}

// Pie de Página Revelable con Efecto Cortina (Footer)
export function PieDePagina() {
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(1);

  // Mide en tiempo real la altura del footer para sincronizar el hueco contenedor del efecto cortina
  useEffect(() => {
    let rafId = 0;
    const measure = () => {
      const el = footerRef.current;
      if (el) {
        rafId = requestAnimationFrame(() => {
          setFooterHeight(el.getBoundingClientRect().height);
        });
      }
    };
    measure();
    const el = footerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div
      id="footer"
      className="relative z-0 w-screen footer-body"
      style={{ height: footerHeight, clipPath: 'inset(0 0 0 0)' }}
    >
      <footer
        ref={footerRef}
        className="fixed bottom-0 left-0 z-0 w-screen overflow-hidden bg-[#E0D4C6] px-[5%] text-[#1C1B1A] max-md:px-[6%] max-md:py-[10%] max-[1025px]:pt-[5%]"
      >
        <div className="flex flex-col pt-[5%] pb-[2%]">
          
          {/* Fila Superior: Redes Sociales, Logo Lumera Negro y Botón Scroll Arriba */}
          <div className="relative mb-[7vw] flex w-full items-center justify-between max-md:gap-0 max-[1025px]:flex-col-reverse">
            {/* Íconos de redes sociales */}
            <FadeUp className="flex items-center justify-center gap-[1vw] max-md:mb-[5vw] max-md:gap-[3vw]">
              {ENLACES_SOCIALES.map(({ src, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="relative flex size-[2.7vw] group duration-300 transition-all ease-in-out items-center justify-center overflow-hidden rounded-full bg-[#1C1B1A] border border-[#1C1B1A] p-[0.75vw] max-md:h-[10vw] max-md:w-[10vw] max-md:p-[2.5vw] max-[1025px]:h-[5vw] max-[1025px]:w-[5vw] max-[1025px]:p-[1.3vw]">
                    <img
                      src={src}
                      alt={label}
                      width={24}
                      height={24}
                      className="h-full duration-300 transition-all ease-in-out group-hover:brightness-0 w-full object-contain relative z-2"
                    />
                    <span className="bg-white rounded-full scale-0 absolute origin-center group-hover:scale-100 w-full h-full duration-300 ease-in-out" />
                  </div>
                </a>
              ))}
            </FadeUp>

            {/* Logotipo Central */}
            <FadeUp className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center max-md:mb-[10vw] max-md:translate-y-0 max-[1025px]:static max-[1025px]:mb-[6vw] max-[1025px]:w-[40vw] max-[1025px]:translate-x-0 max-md:w-[55vw]">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-auto w-[11vw] max-md:w-[30vw] max-[1025px]:w-[16vw]"
              >
                <img
                  src="/assets/media/lumera-logo-black.1jsfgpbr-pmiu.webp"
                  alt="Lumera"
                  height={1000}
                  width={1000}
                  className="h-full w-full object-cover"
                />
              </a>
            </FadeUp>

            {/* Botón flotante para regresar arriba */}
            <FadeUp className="max-[1025px]:hidden">
              <a
                aria-label="Volver arriba"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group"
              >
                <div className="relative flex h-[3vw] w-[3vw] items-center justify-center overflow-hidden rounded-full bg-[#1C1B1A] max-md:absolute max-md:top-[5%] max-md:right-[5%] max-md:h-[9.2vw] max-md:w-[9vw] max-[1025px]:h-[5vw] max-[1025px]:w-[5vw]">
                  <ChevronUp
                    className="absolute h-[1.5vw] w-[1.5vw] text-white transition-transform duration-500 ease-in-out group-hover:translate-y-[-180%] max-md:h-[4.5vw] max-md:w-[4.5vw] max-[1025px]:h-[2.4vw] max-[1025px]:w-[2.4vw]"
                    strokeWidth={1.8}
                  />
                  <ChevronUp
                    className="absolute h-[1.5vw] w-[1.5vw] translate-y-[180%] text-white transition-transform duration-500 ease-in-out group-hover:translate-y-0 max-md:h-[4.5vw] max-md:w-[4.5vw] max-[1025px]:h-[2.4vw] max-[1025px]:w-[2.4vw]"
                    strokeWidth={1.8}
                  />
                </div>
              </a>
            </FadeUp>
          </div>

          {/* Datos de Contacto Directo: Teléfono y Correo */}
          <div className="flex flex-col items-center justify-center gap-3 text-[#1C1B1A]">
            <FadeUp className="w-fit">
              <StaggeredLink
                href="tel:+12125550186"
                text="+1 (212) 555-0186"
                lineBottom="-5%"
                lineHeight="0.18vw"
                className="text-[#1C1B1A]"
                textClassName="font-heading text-[3.4vw] font-medium leading-none max-md:text-[5.5vw] max-[1025px]:text-[5vw]"
              />
            </FadeUp>
            <FadeUp className="w-fit">
              <StaggeredLink
                href="mailto:contacto@lumera.com"
                text="contacto@lumera.com"
                lineHeight="0.18vw"
                lineBottom="-5%"
                className="text-[#1C1B1A]"
                textClassName="font-heading text-[3.2vw] font-medium max-md:text-[5.5vw] max-[1025px]:text-[5vw]"
              />
            </FadeUp>
          </div>

          {/* Línea Inferior: Copyright, Dirección y Enlace Legal */}
          <div className="fadeup flex items-center justify-between pt-[7vw] max-md:gap-[5vw] max-[1025px]:flex-col max-[1025px]:gap-[3vw]">
            <div className="max-[1025px]:order-1 max-[1025px]:w-[70%]">
              <p className="text-[1vw] text-[#1C1B1A] normal-case max-md:text-[3.5vw] max-[1025px]:text-center max-[1025px]:text-[2.5vw]">
                <a
                  href="https://vault.hyperiux.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ©
                </a>{' '}
                2026 Lumera. Todos los Derechos Reservados
              </p>
            </div>
            <div className="absolute bottom-[7%] -translate-x-1/2 left-1/2 w-[35%] max-[1025px]:static max-[1025px]:translate-x-0 max-[1025px]:left-auto max-[1025px]:bottom-auto max-[1025px]:order-2 max-[1025px]:w-full max-[1025px]:my-1">
              <p className="text-center text-[#1C1B1A] text-[1vw] leading-[1.2] max-md:text-[3.5vw] max-[1025px]:text-center max-[1025px]:text-[2.5vw]">
                Dubái, Emiratos Árabes Unidos
              </p>
            </div>
            <StaggeredLink
              showArrow={false}
              href="#"
              onClick={(e) => e.preventDefault()}
              text="Política de Privacidad"
              className="max-[1025px]:order-3 max-[1025px]:pt-1 text-[#1C1B1A]"
              textClassName="text-[1vw] max-md:text-[3.2vw] max-[1025px]:text-[2.5vw]"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

// Aliases para compatibilidad hacia atrás
export { SeccionLlamadoAccion as CtaSection };
export { PieDePagina as FooterSection };

