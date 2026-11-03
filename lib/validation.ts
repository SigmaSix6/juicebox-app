/** A validator returns an error message, or null when the value is valid. */
export type Validator = (value: string) => string | null;

const NAME_PATTERN = /^[\p{L}][\p{L}\p{M}' -]*$/u;
// Pragmatic email check: something@something.tld, no spaces.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateFirstName: Validator = (raw) => {
  const value = raw.trim();
  if (!value) return "Please type in your first name.";
  if (value.length < 2) return "Your name needs at least 2 characters.";
  if (value.length > 50) return "Please keep your name under 50 characters.";
  if (!NAME_PATTERN.test(value))
    return "Letters only, please (spaces, - and ' are fine).";
  return null;
};

export const validateEmail: Validator = (raw) => {
  const value = raw.trim();
  if (!value) return "Please type in your email address.";
  if (!EMAIL_PATTERN.test(value))
    return "Please enter a valid email, e.g. name@company.com.";
  return null;
};
