// Componentes de control: Checkbox de términos y botón animado de envío
import React, { forwardRef } from 'react';

export interface CheckboxFieldProps {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  error?: string;
  accentColor?: string;
}

export const CheckboxField = forwardRef<HTMLButtonElement, CheckboxFieldProps>(function CheckboxField(
  { id, checked, onChange, label, error, accentColor = 'bg-orange-500' },
  ref
) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <button
          ref={ref}
          type="button"
          id={id}
          role="checkbox"
          aria-checked={checked}
          onClick={() => onChange && onChange(!checked)}
          className={`shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center cursor-pointer ${
            checked ? `${accentColor} border-transparent` : 'bg-white border-gray-400 hover:border-gray-600'
          }`}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 12"
              fill="none"
              className="w-3 h-3"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        {label && (
          <div
            onClick={() => onChange && onChange(!checked)}
            className="text-sm text-gray-600 font-light leading-snug select-none cursor-pointer"
          >
            {label}
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 ml-8 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(function SubmitButton(
  { children, type = 'button', isLoading = false, loadingText = 'Enviando...', className = '', disabled, id, ...rest },
  ref
) {
  const autoId =
    !id && typeof children === 'string'
      ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : undefined;

  return (
    <button
      ref={ref}
      id={id ?? autoId}
      type={type}
      disabled={isLoading || disabled}
      className={`relative inline-flex items-center justify-center rounded-full cursor-pointer bg-black text-white text-sm font-medium px-8 py-4 min-w-45 transition-all duration-300 hover:scale-[0.97] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
});

