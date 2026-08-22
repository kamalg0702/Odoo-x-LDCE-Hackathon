/**
 * Client-side validation utilities for Auth and Profile forms.
 * Provides robust validation rules, country-specific phone patterns,
 * name formatting, and real-time user feedback helpers.
 */

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
  warning?: string | null;
  formattedValue?: string;
}

/**
 * Validates and formats personal names.
 * Ensures proper length, alphabetical characters, and clean casing.
 */
export function validateName(name: string, isFullName = false, fieldName = 'Name'): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: `${fieldName} is required.`
    };
  }

  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters long.`
    };
  }

  if (trimmed.length > 50) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed 50 characters.`
    };
  }

  // Regex allows letters (including accented/international letters), spaces, hyphens, dots, and apostrophes
  const validNamePattern = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s'.-]+$/;
  if (!validNamePattern.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens (-), and apostrophes (').`
    };
  }

  // Check for suspicious repeating special characters
  if (/['.-]{2,}/.test(trimmed) || /\s{2,}/.test(trimmed)) {
    return {
      isValid: false,
      error: `Please avoid consecutive special characters or spaces in ${fieldName.toLowerCase()}.`
    };
  }

  // For full name validation, check for at least first and last name
  if (isFullName) {
    const parts = trimmed.split(/\s+/).filter(p => p.length > 0);
    if (parts.length < 2) {
      return {
        isValid: true,
        error: null,
        warning: 'Tip: Entering both first and last name provides the best experience.',
        formattedValue: formatNameTitleCase(trimmed)
      };
    }
  }

  return {
    isValid: true,
    error: null,
    formattedValue: formatNameTitleCase(trimmed)
  };
}

/**
 * Auto-formats names into clean Title Case (e.g. "rahul sharma" -> "Rahul Sharma")
 */
export function formatNameTitleCase(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .split(' ')
    .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : '')
    .join(' ');
}

export interface CountryPhoneRule {
  code: string;
  name: string;
  flag: string;
  digitCount: number | number[];
  placeholder: string;
  example: string;
  formatMask?: (digits: string) => string;
  startDigits?: RegExp;
}

export const COUNTRY_PHONE_RULES: Record<string, CountryPhoneRule> = {
  '+91': {
    code: '+91',
    name: 'India',
    flag: '🇮🇳',
    digitCount: 10,
    placeholder: '98401 23456',
    example: '98401 23456',
    startDigits: /^[6-9]/,
    formatMask: (d) => {
      if (d.length <= 5) return d;
      return `${d.slice(0, 5)} ${d.slice(5, 10)}`;
    }
  },
  '+1': {
    code: '+1',
    name: 'United States & Canada',
    flag: '🇺🇸',
    digitCount: 10,
    placeholder: '(555) 019-2834',
    example: '(555) 019-2834',
    startDigits: /^[2-9]/,
    formatMask: (d) => {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    }
  },
  '+44': {
    code: '+44',
    name: 'United Kingdom',
    flag: '🇬🇧',
    digitCount: [10, 11],
    placeholder: '7911 123456',
    example: '7911 123456',
    formatMask: (d) => {
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4, 10)}`;
    }
  },
  '+81': {
    code: '+81',
    name: 'Japan',
    flag: '🇯🇵',
    digitCount: [10, 11],
    placeholder: '90 1234 5678',
    example: '90 1234 5678',
    formatMask: (d) => {
      if (d.length <= 2) return d;
      if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6, 11)}`;
    }
  },
  '+65': {
    code: '+65',
    name: 'Singapore',
    flag: '🇸🇬',
    digitCount: 8,
    placeholder: '8123 4567',
    example: '8123 4567',
    startDigits: /^[89]/,
    formatMask: (d) => {
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4, 8)}`;
    }
  },
  '+49': {
    code: '+49',
    name: 'Germany',
    flag: '🇩🇪',
    digitCount: [10, 11],
    placeholder: '151 23456789',
    example: '151 23456789'
  },
  '+33': {
    code: '+33',
    name: 'France',
    flag: '🇫🇷',
    digitCount: [9, 10],
    placeholder: '6 12 34 56 78',
    example: '6 12 34 56 78'
  },
  '+971': {
    code: '+971',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    digitCount: 9,
    placeholder: '50 123 4567',
    example: '50 123 4567',
    startDigits: /^5/,
    formatMask: (d) => {
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 9)}`;
    }
  }
};

/**
 * Validates international and country-specific mobile phone numbers.
 */
export function validatePhoneNumber(rawNumber: string, countryCode = '+91'): ValidationResult {
  const trimmed = rawNumber.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Mobile phone number is required.'
    };
  }

  // Extract only numeric digits
  const digits = trimmed.replace(/\D/g, '');

  if (digits.length === 0) {
    return {
      isValid: false,
      error: 'Please enter numeric digits for the phone number.'
    };
  }

  const rule = COUNTRY_PHONE_RULES[countryCode];

  if (rule) {
    const requiredCounts = Array.isArray(rule.digitCount) ? rule.digitCount : [rule.digitCount];
    const isLengthValid = requiredCounts.includes(digits.length);

    // Check starting digit constraint if defined
    if (rule.startDigits && !rule.startDigits.test(digits)) {
      if (countryCode === '+91') {
        return {
          isValid: false,
          error: 'Indian mobile numbers must start with 6, 7, 8, or 9.'
        };
      }
      if (countryCode === '+65') {
        return {
          isValid: false,
          error: 'Singapore mobile numbers must start with 8 or 9.'
        };
      }
      if (countryCode === '+971') {
        return {
          isValid: false,
          error: 'UAE mobile numbers must start with 5 (e.g. 50, 52, 54, 55, 56, 58).'
        };
      }
    }

    if (!isLengthValid) {
      if (digits.length < Math.min(...requiredCounts)) {
        const remaining = Math.min(...requiredCounts) - digits.length;
        return {
          isValid: false,
          error: `Phone number is incomplete. Please enter ${remaining} more digit${remaining > 1 ? 's' : ''} (expected ${requiredCounts.join(' or ')} digits for ${rule.name}).`
        };
      } else {
        return {
          isValid: false,
          error: `Phone number has too many digits. Expected ${requiredCounts.join(' or ')} digits for ${rule.name}.`
        };
      }
    }

    const formatted = rule.formatMask ? rule.formatMask(digits) : digits;
    return {
      isValid: true,
      error: null,
      formattedValue: `${countryCode} ${formatted}`
    };
  }

  // Fallback for general international numbers (ITU standard E.164: 7 to 15 digits)
  if (digits.length < 7 || digits.length > 15) {
    return {
      isValid: false,
      error: 'International phone numbers must contain between 7 and 15 digits.'
    };
  }

  return {
    isValid: true,
    error: null,
    formattedValue: `${countryCode} ${digits}`
  };
}

/**
 * Formats a raw phone input string as the user types based on country rules.
 */
export function formatPhoneAsYouType(raw: string, countryCode = '+91'): string {
  const digits = raw.replace(/\D/g, '');
  const rule = COUNTRY_PHONE_RULES[countryCode];
  if (rule && rule.formatMask) {
    return rule.formatMask(digits);
  }
  return raw;
}

/**
 * Validates Email addresses using RFC 5322 compliance pattern.
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Email address is required.'
    };
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: 'Email address cannot exceed 100 characters.'
    };
  }

  if (!trimmed.includes('@')) {
    return {
      isValid: false,
      error: 'Email must contain an "@" symbol (e.g. user@gmail.com).'
    };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return {
      isValid: false,
      error: 'Please enter a complete email address (e.g. name@domain.com).'
    };
  }

  if (!parts[1].includes('.')) {
    return {
      isValid: false,
      error: 'Email domain must contain a dot (e.g. gmail.com).'
    };
  }

  // RFC-compliant email regex
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address format (e.g. traveler@example.com).'
    };
  }

  return {
    isValid: true,
    error: null,
    formattedValue: trimmed.toLowerCase()
  };
}

/**
 * Validates password strength and basic criteria.
 */
export function validatePassword(password: string): ValidationResult & { strength: 'weak' | 'medium' | 'strong' } {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required.',
      strength: 'weak'
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters.',
      strength: 'weak'
    };
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  if (password.length >= 10 && hasLetters && hasNumbers && hasSpecial) {
    strength = 'strong';
  } else if (password.length >= 8 && (hasLetters && hasNumbers || hasLetters && hasSpecial)) {
    strength = 'medium';
  }

  return {
    isValid: true,
    error: null,
    strength
  };
}

/**
 * Validates 4-6 digit numeric OTP codes.
 */
export function validateOtp(otp: string, expectedLength = 4): ValidationResult {
  const trimmed = otp.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Verification code is required.'
    };
  }

  if (!/^\d+$/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Verification code must contain digits only.'
    };
  }

  if (trimmed.length < expectedLength) {
    return {
      isValid: false,
      error: `Please enter all ${expectedLength} digits of the verification code.`
    };
  }

  if (trimmed.length > 6) {
    return {
      isValid: false,
      error: 'Verification code cannot exceed 6 digits.'
    };
  }

  return {
    isValid: true,
    error: null,
    formattedValue: trimmed
  };
}

/**
 * Validates city / location names.
 */
export function validateCity(city: string): ValidationResult {
  const trimmed = city.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Home departure city is required.'
    };
  }

  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: 'City name must be at least 2 characters.'
    };
  }

  const validCityPattern = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s',.-]+$/;
  if (!validCityPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'City name can only contain letters, spaces, commas, and hyphens.'
    };
  }

  return {
    isValid: true,
    error: null,
    formattedValue: formatNameTitleCase(trimmed)
  };
}
