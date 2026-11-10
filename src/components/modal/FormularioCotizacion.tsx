// Formulario de cotización con validación y guardado local
import React, { useCallback, useId, useState } from 'react';
import { FloatingInput, FloatingTextarea } from './CampoTextoFlotante';
import { PhoneField } from './SelectorPais';
import { CustomSelect } from './SelectorInteres';
import { CheckboxField, SubmitButton } from './ControlesFormulario';
import { INTEREST_OPTIONS, validateEnquiryForm } from '../../utils/enquiryValidation';

export interface EnquiryFormProps {
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  inputBackgroundColor?: string;
  fieldBorderColor?: string;
  inputRoundedness?: number;
  duration?: number;
}

export function FormularioCotizacion({
  accentColor = '#ca8216',
  backgroundColor = '#ffffff',
  textColor = '#1c1b1a',
  inputBackgroundColor = '#ffffff',
  fieldBorderColor = '#d8d2c8',
  inputRoundedness = 28,
  duration = 0.3,
}: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const rawId = useId().replace(/:/g, '');
  const formScopeId = `contact-form-${rawId}`;

  const updateField = useCallback((name: string, val: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const result = validateEnquiryForm(formData);
      setErrors(result.errors);
      if (!result.valid) return;

      setIsLoading(true);
      setIsError(false);
      try {
        await new Promise((resolve) => setTimeout(resolve, 350));

        try {
          const prevData = JSON.parse(localStorage.getItem('lumera_solicitudes_db') || '[]');
          prevData.unshift({
            id: Date.now(),
            nombre: formData.name,
            email: formData.email,
            telefono: formData.phone,
            interes: formData.interest,
            mensaje: formData.message,
            fecha: new Date().toLocaleString(),
          });
          localStorage.setItem('lumera_solicitudes_db', JSON.stringify(prevData));
        } catch {
          // Fallback si localStorage no está disponible
        }

        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          interest: '',
          message: '',
          terms: false,
        });
        setTimeout(() => setIsSuccess(false), 7000);
      } catch {
        setIsError(true);
        setTimeout(() => setIsError(false), 7000);
      } finally {
        setIsLoading(false);
      }
    },
    [formData]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    const target = e.target as HTMLElement;
    if (target?.tagName === 'TEXTAREA' && e.shiftKey) return;
    e.preventDefault();
    e.currentTarget.requestSubmit();
  }, []);

  return (
    <div data-lenis-prevent className="w-full" style={{ backgroundColor }}>
      <div className="mb-[1.2vw] pr-[4vw] flex flex-col gap-[0.2vw] max-[1025px]:mb-[3vw] max-[1025px]:pr-[8vw]">
        <h2 className="font-heading text-[2.2vw] font-medium leading-tight text-[#1c1b1a] max-[1025px]:text-[5vw] max-md:text-[6.5vw]">
          Hablar con un Asesor
        </h2>
        <p className="text-[0.82vw] font-light text-gray-500 max-[1025px]:text-[2.6vw] max-md:text-[3.2vw]">
          Complete los campos y un asesor exclusivo de Lumera Heights se pondrá en contacto.
        </p>
      </div>
      <section
        className="h-full w-full"
        id={formScopeId}
        style={
          {
            '--form-accent': accentColor,
            '--form-text': textColor,
            '--form-input-bg': inputBackgroundColor,
            '--form-field-border': fieldBorderColor,
            '--form-input-radius': `${Math.max(0, Number(inputRoundedness) || 0)}px`,
            '--form-duration': `${Math.max(0.05, Number(duration) || 0.3)}s`,
            '--form-submit-bg': '#1c1b1a',
          } as React.CSSProperties
        }
      >
        <div className="w-full h-full">
          <div className="w-full flex flex-col gap-[1vw]">
            <form
              autoComplete="off"
              className="space-y-[0.75vw] max-md:space-y-[2.5vw]"
              onKeyDown={handleKeyDown}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[1.2vw] gap-y-[0.75vw] max-md:gap-y-[2.5vw]">
                {/* 1. Nombre Completo */}
                <FloatingInput
                  id="name"
                  label="Nombre Completo*"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  error={errors.name}
                />

                {/* 2. Correo Electrónico */}
                <FloatingInput
                  id="email"
                  label="Correo Electrónico*"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  error={errors.email}
                />

                {/* 3. Teléfono con país */}
                <PhoneField
                  id="phone"
                  label="Teléfono*"
                  value={formData.phone}
                  onChange={(val) => updateField('phone', val)}
                  defaultCountry="AE"
                  error={errors.phone}
                />

                {/* 4. Tipología de Interés */}
                <CustomSelect
                  id="interest"
                  label="Interés / Tipología*"
                  options={[...INTEREST_OPTIONS]}
                  value={formData.interest}
                  onChange={(e) => updateField('interest', e.target.value)}
                  error={errors.interest}
                />

                {/* 5. Mensaje horizontal en 2 columnas */}
                <div className="md:col-span-2">
                  <FloatingTextarea
                    id="message"
                    label="Mensaje o Consulta"
                    rows={2}
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    error={errors.message}
                  />
                </div>
              </div>

              {/* Fila: Aceptación de términos a la izquierda y botón de envío a la derecha */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[1vw] pt-[0.2vw] max-md:pt-[2vw]">
                <div className="max-w-[34vw] max-md:max-w-full">
                  <CheckboxField
                    id="terms"
                    label="Acepto ser contactado sobre Lumera Heights."
                    checked={formData.terms}
                    onChange={(val) => updateField('terms', val)}
                    error={errors.terms}
                  />
                </div>
                <div className="shrink-0 flex items-center justify-end">
                  <SubmitButton
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Guardando..."
                    className="!py-[0.8vw] !px-[2vw] text-[0.88vw] max-md:text-[3.5vw] max-md:!py-[3vw] max-md:!px-[6vw] max-[1025px]:text-[2.2vw]"
                  >
                    Enviar Solicitud
                  </SubmitButton>
                </div>
              </div>

              <div aria-live="polite">
                {isSuccess && (
                  <p className="text-green-600 text-sm mt-1 font-medium">
                    ✓ ¡Gracias! Solicitud guardada en la base de datos con éxito.
                  </p>
                )}
                {isError && (
                  <p className="text-red-600 text-sm mt-1 font-medium">
                    ✗ Ocurrió un error. Por favor inténtalo de nuevo.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

// Alias de compatibilidad hacia atrás
export { FormularioCotizacion as EnquiryForm };

