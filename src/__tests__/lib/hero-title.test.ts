/**
 * Tests para src/lib/hero-title.ts
 * Fija el contrato de titleLines() — la función que deriva las líneas del titular
 * colosal del hero desde el nombre completo. Sus reglas (descartar iniciales sueltas,
 * conservar tildes, una palabra por línea) son un invariante frágil del diseño
 * cinematográfico: se prueban, no se comentan (REGLA #9).
 */
import { titleLines } from "@/lib/hero-title";

describe("titleLines — líneas del titular colosal", () => {
  it("convierte el nombre completo en una palabra por línea, en mayúsculas", () => {
    expect(titleLines("Cristian Daniel Gutiérrez S.")).toEqual([
      "CRISTIAN",
      "DANIEL",
      "GUTIÉRREZ",
    ]);
  });

  it("descarta iniciales sueltas (tokens de una sola letra, con o sin punto)", () => {
    expect(titleLines("Cristian Daniel Gutiérrez S.")).not.toContain("S");
    expect(titleLines("Ana B Pérez")).toEqual(["ANA", "PÉREZ"]);
  });

  it("conserva las tildes al pasar a mayúsculas", () => {
    expect(titleLines("Gutiérrez")).toEqual(["GUTIÉRREZ"]);
  });

  it("colapsa espacios múltiples y recorta los extremos", () => {
    expect(titleLines("  Cristian   Gutiérrez  ")).toEqual(["CRISTIAN", "GUTIÉRREZ"]);
  });

  it("un nombre de una sola palabra produce una sola línea", () => {
    expect(titleLines("Cristian")).toEqual(["CRISTIAN"]);
  });

  it("devuelve siempre un arreglo de strings", () => {
    const lines = titleLines("Cristian Daniel Gutiérrez S.");
    expect(Array.isArray(lines)).toBe(true);
    for (const l of lines) expect(typeof l).toBe("string");
  });
});
