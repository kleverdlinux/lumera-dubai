// Aplicación Principal Lumera Heights Dubai: Estructura modular de secciones
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ReactLenis, useLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import { prefersReducedMotion } from './utils/motion';
import ProveedorModalContacto from './components/modal';

// Importación de módulos y secciones
import Precargador from './components/sections/Precargador';
import EncabezadoNavegacion from './components/navegacion';
import SeccionHeroPrincipal from './components/sections/SeccionHeroPrincipal';
import SeccionVision from './components/sections/SeccionVision';
import SeccionResidencias from './components/sections/SeccionResidencias';
import SeccionServicios from './components/sections/SeccionServicios';
import SeccionArquitectura from './components/sections/SeccionArquitectura';
import SeccionRefinamiento from './components/sections/SeccionRefinamiento';
import SeccionVideoShowcase from './components/sections/SeccionVideoShowcase';
import SeccionCaracteristicas from './components/sections/SeccionCaracteristicas';
import SeccionExperiencia from './components/sections/SeccionExperiencia';
import {
  SeccionPreguntasFrecuentes,
  SeccionPuntosUbicacion,
  SeccionRetornoInversion,
} from './components/sections/SeccionPreguntasYPuntosClave';
import {
  SeccionLlamadoAccion,
  PieDePagina,
} from './components/sections/SeccionContactoYPiePagina';

// Restablece la posición del scroll a (0,0) al recargar
function RestablecedorScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (window.location.hash) return;
    const prevRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const scrollToTop = () => {
      lenis?.scrollTo?.(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };
    scrollToTop();
    const raf1 = requestAnimationFrame(scrollToTop);
    const raf2 = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop);
    });
    const timer = window.setTimeout(scrollToTop, 150);
    window.addEventListener('load', scrollToTop);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(timer);
      window.removeEventListener('load', scrollToTop);
      window.history.scrollRestoration = prevRestoration;
    };
  }, [lenis]);

  return null;
}

// Configuración de Lenis para desplazamiento suave
function DesplazamientoSuave({
  duration = 1.35,
  lerp = 0.075,
  smoothWheel = true,
  wheelMultiplier = 0.8,
  touchMultiplier = 0.8,
}: {
  duration?: number;
  lerp?: number;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  if (prefersReducedMotion()) return null;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration,
        lerp,
        smoothWheel,
        wheelMultiplier,
        touchMultiplier,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
      ref={lenisRef}
    />
  );
}

// Componente Principal de la Aplicación
export default function App() {
  return (
    <ProveedorModalContacto>
      <div className="lumera-page relative">
        {/* 1. Pantalla de Precarga Inicial */}
        <Precargador />

        {/* 2. Controladores de Desplazamiento Suave */}
        <RestablecedorScroll />
        <DesplazamientoSuave />

        {/* 3. Encabezado y Navegación Principal */}
        <EncabezadoNavegacion />

        {/* 4. Contenido Principal de Secciones */}
        <main className="relative z-1 bg-transparent">
          <SeccionHeroPrincipal />
          <SeccionVision />
          <SeccionResidencias />
          <SeccionServicios />
          <SeccionArquitectura />
          <SeccionRefinamiento />
          <SeccionVideoShowcase />
          <SeccionCaracteristicas />
          <SeccionExperiencia />
          <SeccionPreguntasFrecuentes />
          <SeccionPuntosUbicacion />
          <SeccionRetornoInversion />
          <SeccionLlamadoAccion />
        </main>

        {/* 5. Pie de Página con Efecto Cortina */}
        <PieDePagina />
      </div>
    </ProveedorModalContacto>
  );
}
