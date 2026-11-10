export interface CountryOption {
  code: string;
  dial: string;
  flag: string;
  name: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  // Países de habla hispana / Latinoamérica
  { code: 'PE', dial: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'México' },
  { code: 'CO', dial: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'España' },
  { code: 'AR', dial: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'CL', dial: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: 'EC', dial: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: 'BO', dial: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: 'VE', dial: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'UY', dial: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: 'PY', dial: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: 'BR', dial: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: 'CR', dial: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: 'PA', dial: '+507', flag: '🇵🇦', name: 'Panamá' },
  { code: 'DO', dial: '+1', flag: '🇩🇴', name: 'República Dominicana' },
  { code: 'GT', dial: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: 'HN', dial: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: 'SV', dial: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: 'NI', dial: '+505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: 'PR', dial: '+1', flag: '🇵🇷', name: 'Puerto Rico' },

  // Medio Oriente y Emiratos
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'Emiratos Árabes Unidos' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Arabia Saudita' },
  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: 'KW', dial: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Egipto' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Turquía' },
  { code: 'IL', dial: '+972', flag: '🇮🇱', name: 'Israel' },

  // Norteamérica y Europa
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'Estados Unidos' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canadá' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'Reino Unido' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'Francia' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Alemania' },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Italia' },
  { code: 'PT', dial: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'CH', dial: '+41', flag: '🇨🇭', name: 'Suiza' },
  { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Países Bajos' },
  { code: 'BE', dial: '+32', flag: '🇧🇪', name: 'Bélgica' },
  { code: 'SE', dial: '+46', flag: '🇸🇪', name: 'Suecia' },
  { code: 'NO', dial: '+47', flag: '🇳🇴', name: 'Noruega' },
  { code: 'IE', dial: '+353', flag: '🇮🇪', name: 'Irlanda' },
  { code: 'AT', dial: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: 'PL', dial: '+48', flag: '🇵🇱', name: 'Polonia' },
  { code: 'RU', dial: '+7', flag: '🇷🇺', name: 'Rusia' },

  // Asia y Oceanía
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japón' },
  { code: 'KR', dial: '+82', flag: '🇰🇷', name: 'Corea del Sur' },
  { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapur' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'NZ', dial: '+64', flag: '🇳🇿', name: 'Nueva Zelanda' },
  { code: 'ZA', dial: '+27', flag: '🇿🇦', name: 'Sudáfrica' },
  { code: 'MA', dial: '+212', flag: '🇲🇦', name: 'Marruecos' },
];

export const PHONE_LENGTH_RANGES: Record<string, [number, number]> = {
  '+51': [9, 9],
  '+52': [10, 10],
  '+57': [10, 10],
  '+34': [9, 9],
  '+54': [10, 11],
  '+56': [9, 9],
  '+1': [10, 10],
  '+971': [8, 9],
  '+593': [9, 9],
  '+591': [8, 8],
  '+58': [10, 10],
  '+598': [8, 8],
  '+595': [9, 9],
  '+55': [10, 11],
  '+44': [9, 10],
  '+33': [9, 9],
  '+49': [7, 11],
  '+39': [9, 10],
  '+91': [10, 10],
  '+65': [8, 8],
  '+353': [7, 9],
  '+61': [9, 9],
};

export const LEADING_ZERO_STRIP_DIALS = new Set([
  '+44',
  '+353',
  '+61',
  '+49',
  '+33',
  '+971',
]);

export const INTEREST_OPTIONS = [
  { value: 'brochure', label: 'Folleto del Proyecto' },
  { value: 'floor-plan', label: 'Planos Arquitectónicos' },
  { value: 'private-viewing', label: 'Visita Privada' },
  { value: 'investment', label: 'Opciones de Inversión' },
] as const;

export interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  terms: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_INTERESTS = new Set(['brochure', 'floor-plan', 'private-viewing', 'investment']);

export function validatePhoneForCountry(phoneValue: string): boolean {
  const trimmed = phoneValue.trim();
  if (!trimmed) return false;
  const dialMatch = trimmed.match(/^(\+\d+)\s/);
  const dial = dialMatch?.[1];
  let digits = trimmed.replace(/^\+\d+\s*/, '').replace(/\D/g, '');
  if (dial && LEADING_ZERO_STRIP_DIALS.has(dial) && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  const range = dial ? PHONE_LENGTH_RANGES[dial] : undefined;
  const [minLen, maxLen] = range ?? [6, 14];
  return digits.length >= minLen && digits.length <= maxLen;
}

export function validateEnquiryForm(data: EnquiryFormData): {
  valid: boolean;
  errors: Partial<Record<keyof EnquiryFormData, string>>;
} {
  const errors: Partial<Record<keyof EnquiryFormData, string>> = {};

  const name = (data.name ?? '').trim();
  if (name.length === 0) {
    errors.name = 'El nombre es obligatorio.';
  } else if (name.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.';
  }

  const email = (data.email ?? '').trim();
  if (email.length === 0) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Por favor ingresa un correo electrónico válido.';
  }

  const phone = (data.phone ?? '').trim();
  const phoneDigitsOnly = phone.replace(/^\+\d+\s*/, '').replace(/\D/g, '');
  if (phone.length === 0 || phoneDigitsOnly.length === 0) {
    errors.phone = 'El teléfono es obligatorio.';
  } else if (!validatePhoneForCountry(phone)) {
    errors.phone = 'Ingresa un número válido para el país seleccionado.';
  }

  if (!VALID_INTERESTS.has(data.interest)) {
    errors.interest = 'Por favor selecciona la opción de interés.';
  }

  const message = (data.message ?? '').trim();
  if (message.length > 1000) {
    errors.message = 'El mensaje es demasiado largo.';
  }

  if (data.terms !== true) {
    errors.terms = 'Por favor acepta los términos antes de enviar.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
