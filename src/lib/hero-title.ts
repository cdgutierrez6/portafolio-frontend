/**
 * Deriva las líneas del titular colosal desde el nombre COMPLETO — una palabra por
 * línea (title-card de cine). Vive en un módulo NEUTRO (sin "use client") porque lo
 * consume el Server Component de la página para pintar la capa trasera del titular.
 *
 * "Cristian Daniel Gutiérrez S." → ["CRISTIAN", "DANIEL", "GUTIÉRREZ"]
 * (se descarta la inicial suelta "S."; se conserva la tilde de GUTIÉRREZ).
 */
export function titleLines(name: string): string[] {
  return name
    .replace(/\.$/, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1) // descarta iniciales sueltas ("S.")
    .map((w) => w.toUpperCase());
}
