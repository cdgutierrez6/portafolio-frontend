/**
 * Contact form validation helpers
 * Extracted from app/api/contact/route.ts for testability
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface ContactInput {
  senderName?: unknown;
  senderEmail?: unknown;
  subject?: unknown;
  message?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateContactInput(data: ContactInput): ValidationResult {
  const { senderName, senderEmail, subject, message } = data;

  if (!senderName || !senderEmail || !subject || !message) {
    return { valid: false, error: "Todos los campos son requeridos" };
  }

  if (
    (senderName as string).length > 100 ||
    (senderEmail as string).length > 254 ||
    (subject as string).length > 200 ||
    (message as string).length > 5000
  ) {
    return { valid: false, error: "Uno o más campos exceden la longitud máxima permitida" };
  }

  if (!EMAIL_RE.test(senderEmail as string)) {
    return { valid: false, error: "Formato de email inválido" };
  }

  return { valid: true };
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
