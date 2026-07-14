/**
 * Deriva las dos líneas del titular colosal desde el nombre.
 * Vive en un módulo NEUTRO (sin "use client") porque lo consume el Server Component
 * de la página para pintar la capa trasera del titular.
 *
 * "Cristian Daniel Gutiérrez S." → ["CRISTIAN", "GUTIÉRREZ"]
 */
export function titleLines(name: string): [string, string] {
  const w = name.replace(/\.$/, "").trim().split(/\s+/).filter((x) => x.length > 1);
  const first = w[0] ?? name;
  const last = w.length > 2 ? w[2] : w[w.length - 1] ?? "";
  return [first.toUpperCase(), last.toUpperCase()];
}
