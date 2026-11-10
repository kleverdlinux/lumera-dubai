// Contexto y hook para abrir y cerrar el modal desde cualquier sección
import React, { createContext, useContext } from 'react';

export interface EnquiryModalContextValue {
  openEnquiryModal: () => void;
  closeEnquiryModal: () => void;
}

export const EnquiryModalContext = createContext<EnquiryModalContextValue | null>(null);

export function useEnquiryModal(): EnquiryModalContextValue {
  const ctx = useContext(EnquiryModalContext);
  if (!ctx) {
    throw new Error('useEnquiryModal debe ser usado dentro de <EnquiryModalProvider>');
  }
  return ctx;
}

// Alias en español para máxima claridad didáctica
export const useModalContacto = useEnquiryModal;

