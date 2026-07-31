/**
 * Tests para src/lib/experience.ts
 * El conteo de años de experiencia es dinámico y debe quedar idéntico en todas
 * las superficies (CV, portafolio, GitHub, LinkedIn). Su fórmula —abr-2012 menos
 * 7 meses, es decir desde nov-2012— es un invariante frágil: se prueba (REGLA #9).
 */
import { yearsOfExperience, yearsOfExperienceLabel, EXPERIENCE_START } from "@/lib/experience";

describe("yearsOfExperience — conteo dinámico", () => {
  it("da 13 al 30-jul-2026", () => {
    expect(yearsOfExperience(new Date(2026, 6, 30))).toBe(13);
  });

  it("sube a 14 el 1-nov-2026 (14º aniversario desde nov-2012)", () => {
    expect(yearsOfExperience(new Date(2026, 10, 1))).toBe(14);
  });

  it("aún es 13 el 31-oct-2026 (un día antes del aniversario)", () => {
    expect(yearsOfExperience(new Date(2026, 9, 31))).toBe(13);
  });

  it("nunca baja del piso de credibilidad (13) aunque el reloj esté mal", () => {
    expect(yearsOfExperience(new Date(2000, 0, 1))).toBe(13);
  });

  it("la etiqueta agrega el '+'", () => {
    expect(yearsOfExperienceLabel(new Date(2026, 6, 30))).toBe("13+");
  });

  it("el inicio efectivo es nov-2012 (abr-2012 + 7 meses)", () => {
    expect(EXPERIENCE_START.getFullYear()).toBe(2012);
    expect(EXPERIENCE_START.getMonth()).toBe(10);
  });
});
