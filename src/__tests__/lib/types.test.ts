/**
 * Tests para el diccionario i18n de src/lib/types.ts
 * Verifica que ambos locales (es/en) existen y tienen la MISMA forma: una clave que
 * falte en un idioma rompe la UI en ese idioma en tiempo de ejecución (acceso a
 * undefined). Convierte esa paridad frágil en un test (REGLA #9).
 */
import { i18n } from "@/lib/types";

const shape = (obj: Record<string, unknown>): string[] =>
  Object.entries(obj)
    .flatMap(([k, v]) =>
      v && typeof v === "object"
        ? shape(v as Record<string, unknown>).map((sub) => `${k}.${sub}`)
        : [k]
    )
    .sort();

describe("i18n — diccionario de traducciones", () => {
  it("expone los locales es y en", () => {
    expect(i18n.es).toBeDefined();
    expect(i18n.en).toBeDefined();
  });

  it("es y en tienen exactamente las mismas claves (paridad de traducción)", () => {
    expect(shape(i18n.en)).toEqual(shape(i18n.es));
  });

  it("todos los valores hoja son strings no vacíos", () => {
    for (const locale of [i18n.es, i18n.en]) {
      const walk = (obj: Record<string, unknown>) => {
        for (const value of Object.values(obj)) {
          if (value && typeof value === "object") walk(value as Record<string, unknown>);
          else {
            expect(typeof value).toBe("string");
            expect((value as string).length).toBeGreaterThan(0);
          }
        }
      };
      walk(locale);
    }
  });
});
