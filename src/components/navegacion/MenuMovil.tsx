// Menú móvil a pantalla completa desplegable con animación y enlaces táctiles
import React from 'react';
import StaggeredLink from '../ui/StaggeredLink';
import { useEnquiryModal } from '../modal';

interface ItemNavegacion {
  label: string;
  target: string;
}

interface MenuMovilProps {
  open: boolean;
  items: ItemNavegacion[];
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, target: string) => void;
  onClose: () => void;
}

export function MenuMovil({ open, items, onNavigate, onClose }: MenuMovilProps) {
  const { openEnquiryModal } = useEnquiryModal();

  return (
    <div
      className={`fixed inset-0 z-50 hidden h-dvh overflow-y-auto bg-[#1c1b1a] px-[5%] pb-[8vw] pt-[24vw] transition-transform duration-500 max-[1025px]:block max-md:pt-[26vw] max-md:pb-[10vw] ${
        open ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-[5vw]">
          {items.map((item) => (
            <StaggeredLink
              key={item.label}
              text={item.label}
              href={item.target}
              onClick={(e) => onNavigate(e, item.target)}
              hoverColor="rgba(255,255,255,0.7)"
              className="text-white"
              textClassName="font-heading text-[9vw] font-medium leading-none max-md:text-[7vw]"
            />
          ))}
        </div>
        <StaggeredLink
          text="Cotizar Ahora"
          href="#footer"
          onClick={(e) => {
            e.preventDefault();
            onClose();
            openEnquiryModal();
          }}
          hoverColor="#1c1b1a"
          className="h-[11vw] w-full justify-center rounded-full border border-[#ca8216] bg-white px-[6vw] text-[#1c1b1a] max-md:h-[15vw]"
          textClassName="font-body text-[3vw] font-medium max-md:text-[4.2vw]"
        />
      </nav>
    </div>
  );
}

