/**
 * Años de experiencia — fuente ÚNICA de verdad, calculada (nunca hardcodeada).
 *
 * Regla de Cristian (2026-07-31): la carrera arranca en abr-2012 y al conteo
 * público se le restan 7 meses — equivale a contar desde nov-2012. El número
 * debe salir IGUAL en el CV, el portafolio, GitHub y LinkedIn; por eso vive en
 * un solo lugar y se deriva, no se escribe a mano.
 *
 * Se rompía solo (antes convivían "13+" y "15+" en el mismo sitio): por eso es
 * un invariante que se prueba (REGLA #9), no que se comenta.
 */
export const EXPERIENCE_START = new Date(2012, 10, 1); // 1-nov-2012 (mes 0-indexado)

const FLOOR_YEARS = 13; // piso de credibilidad al 2026-07 (nunca mostrar menos)
const CEILING_YEARS = 40; // techo de cordura por si el reloj del sistema falla

/** Años completos de experiencia a la fecha dada (por defecto, hoy). */
export function yearsOfExperience(now: Date = new Date()): number {
  let years = now.getFullYear() - EXPERIENCE_START.getFullYear();
  const monthDiff = now.getMonth() - EXPERIENCE_START.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < EXPERIENCE_START.getDate())) {
    years -= 1;
  }
  return Math.min(Math.max(years, FLOOR_YEARS), CEILING_YEARS);
}

/** Etiqueta lista para UI, p. ej. "13+". */
export function yearsOfExperienceLabel(now: Date = new Date()): string {
  return `${yearsOfExperience(now)}+`;
}

const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Fin "rodante" de EfiziAI = el mes de (hoy − 15 días).
 *
 * Regla de Cristian (2026-07-31): EfiziAI (su producto propio) se muestra como
 * recién terminado ~2 semanas atrás y RUEDA en cada deploy, para que el perfil
 * siempre lea "disponible ya". Se congela con la fecha real cuando consiga
 * empleo. Es decisión de framing suya; por eso el número no se escribe a mano.
 */
export function rollingEndDate(now: Date = new Date()): { es: string; en: string } {
  const d = new Date(now.getTime());
  d.setDate(d.getDate() - 15);
  const m = d.getMonth();
  const y = d.getFullYear();
  return { es: `${MONTHS_ES[m]} ${y}`, en: `${MONTHS_EN[m]} ${y}` };
}
