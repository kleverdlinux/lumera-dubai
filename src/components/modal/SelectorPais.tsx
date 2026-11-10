// Campo telefónico con selector de país, banderas y prefijos internacionales
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { COUNTRY_OPTIONS, CountryOption } from '../../utils/enquiryValidation';

interface PhoneFieldProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
  defaultCountry?: string;
  countries?: CountryOption[];
  error?: string;
  placeholder?: string;
  showCountryName?: boolean;
}

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(function PhoneField(
  {
    id = 'phone',
    label = 'Teléfono*',
    value = '',
    onChange,
    defaultCountry = 'AE',
    countries = COUNTRY_OPTIONS,
    error,
    placeholder,
    showCountryName = false,
  },
  ref
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    () => countries.find((c) => c.code === defaultCountry) || countries[0]
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const paisesFiltrados = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.dial.includes(busqueda) ||
      c.code.toLowerCase().includes(busqueda.toLowerCase())
  );

  const localNumber = value.startsWith(selectedCountry.dial)
    ? value.slice(selectedCountry.dial.length).trim()
    : value;

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setBusqueda('');
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div ref={wrapperRef} className="w-full">
      <div
        data-phone-field
        className={`flex h-14 items-center rounded-full border bg-white transition-all border-gray-200 focus-within:border-gray-400 ${
          error ? 'border-red-400 focus-within:border-red-400' : ''
        }`}
      >
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex h-full cursor-pointer items-center gap-1 pl-4 pr-2 text-sm text-gray-700 transition-colors hover:text-gray-900"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="text-base">{selectedCountry.flag}</span>
            <span className="font-normal text-sm">{selectedCountry.dial}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {dropdownOpen && (
            <div
              role="listbox"
              className="absolute left-0 top-full z-50 mt-2 max-h-72 w-72 max-w-[85vw] rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
            >
              <div className="mb-2 px-1">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar país o prefijo..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400"
                  autoFocus
                />
              </div>
              <div className="overflow-y-auto max-h-56 divide-y divide-gray-50" onWheelCapture={(e) => e.stopPropagation()}>
                {paisesFiltrados.length === 0 ? (
                  <p className="py-3 text-center text-xs text-gray-400">No se encontraron países</p>
                ) : (
                  paisesFiltrados.map((country) => {
                    const isActive = selectedCountry.code === country.code;
                    return (
                      <button
                        key={`${country.code}-${country.dial}`}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => {
                          setSelectedCountry(country);
                          setDropdownOpen(false);
                          setBusqueda('');
                          onChange?.(`${country.dial} ${localNumber}`.trim());
                        }}
                        className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors hover:bg-gray-100 ${
                          isActive ? 'bg-amber-50/60 font-semibold text-amber-800' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-base">{country.flag}</span>
                        <span className="truncate flex-1">{country.name}</span>
                        <span className="text-gray-400 font-mono text-[11px]">{country.dial}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        <span className="h-6 w-px shrink-0 bg-gray-200" />
        <input
          ref={ref}
          id={id}
          type="tel"
          value={localNumber}
          onChange={(e) => {
            const sanitized = e.target.value.replace(/[^\d\s\-()]/g, '');
            onChange?.(`${selectedCountry.dial} ${sanitized}`.trim());
          }}
          placeholder={placeholder ?? label}
          autoComplete="tel"
          className="h-full flex-1 rounded-r-full bg-transparent pl-4 pr-5 text-sm text-gray-800 outline-none placeholder:text-gray-700 placeholder:text-sm"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="ml-4 mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

