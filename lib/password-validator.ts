/**
 * Pure password validation and complexity logic for ResumeBuilderAi 3.0 Zero-Trust Security.
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  message?: string;
} {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long.',
    };
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must include both letters and numbers.',
    };
  }
  return { valid: true };
}
