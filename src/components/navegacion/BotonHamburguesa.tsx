// Botón animado de menú hamburguesa responsivo para móvil y tablet
import React from 'react';

interface BotonHamburguesaProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function BotonHamburguesa({ isOpen, onToggle }: BotonHamburguesaProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
      aria-expanded={isOpen}
      className="relative z-60 hidden h-[6vw] w-[7vw] shrink-0 items-center justify-center max-[1025px]:flex max-md:h-[8vw] max-md:w-[9vw]"
    >
      <span className="relative block h-[3vw] w-[5.5vw] max-md:h-[4vw] max-md:w-[7vw]">
        <span
          className={`absolute left-0 top-[22%] h-px w-full bg-white transition-transform duration-300 ${
            isOpen ? 'translate-y-[1.1vw] rotate-45 max-md:translate-y-[1vw]' : ''
          }`}
        />
        <span
          className={`absolute left-0 top-[68%] h-px w-full bg-white transition-transform duration-300 ${
            isOpen ? 'translate-y-[-1.1vw] -rotate-45 max-md:translate-y-[-1vw]' : ''
          }`}
        />
      </span>
    </button>
  );
}

