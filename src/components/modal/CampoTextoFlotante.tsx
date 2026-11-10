// Entradas de texto con etiqueta flotante animada y mensajes de error
import React, { forwardRef, useId } from 'react';

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelBg?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(function FloatingInput(
  { id, label, placeholder, type = 'text', error, labelBg = '', className = '', ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className="w-full">
      <div className="group relative w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="origin-start text-gray-400 group-focus-within:text-gray-700 has-[+input:not(:placeholder-shown)]:text-gray-700 absolute top-1/2 block -translate-y-1/2 cursor-text px-2 text-sm transition-all duration-200 ease-out z-10 group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:-translate-y-1/2 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium ml-4"
          >
            <span className={`bg-white text-gray-700 inline-flex px-1 text-sm ${labelBg || 'bg-white'}`}>
              {label}
            </span>
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder ?? ' '}
          className={`w-full border rounded-full bg-white h-14 pl-5 pr-4 text-sm text-gray-800 outline-none transition-all border-gray-200 focus:border-gray-400 ${
            error ? 'border-red-400 focus:border-red-400' : ''
          } ${className}`}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 ml-4 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

export interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  function FloatingTextarea({ id, label, error, rows = 3, className = '', ...rest }, ref) {
    return (
      <div className="w-full">
        <div className="group relative w-full">
          {label && (
            <label
              htmlFor={id}
              className="origin-start text-gray-400 group-focus-within:text-gray-700 has-[+textarea:not(:placeholder-shown)]:text-gray-700 absolute top-0 block translate-y-4 cursor-text px-2 text-sm transition-all z-5 ml-3 group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium"
            >
              <span className="bg-white text-gray-700 inline-flex px-1 text-sm">{label}</span>
            </label>
          )}
          <textarea
            ref={ref}
            id={id}
            rows={rows}
            placeholder=""
            className={`w-full border rounded-2xl bg-white min-h-[4.8rem] pt-5 pb-3 pl-5 pr-4 text-sm text-gray-800 outline-none transition-all resize-none border-gray-200 focus:border-gray-400 ${
              error ? 'border-red-400 focus:border-red-400' : ''
            } ${className}`}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            {...rest}
          />
        </div>
        {error && (
          <p id={`${id}-error`} className="mt-1 ml-4 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

