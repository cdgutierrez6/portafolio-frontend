/**
 * Tests para src/lib/tech-descriptions.ts
 * Verifica que el catálogo de descripciones de tecnologías está definido y completo
 */
import { TECH_DESC } from "@/lib/tech-descriptions";

describe("TECH_DESC — catálogo de tecnologías", () => {
  it("exporta un objeto no vacío", () => {
    expect(typeof TECH_DESC).toBe("object");
    expect(Object.keys(TECH_DESC).length).toBeGreaterThan(0);
  });

  it("todas las entradas tienen descripción no vacía", () => {
    for (const [key, value] of Object.entries(TECH_DESC)) {
      expect(value, `Descripción vacía para: ${key}`).toBeTruthy();
      expect(value.length, `Descripción demasiado corta para: ${key}`).toBeGreaterThan(10);
    }
  });

  it("contiene las tecnologías principales del stack", () => {
    const requiredTechs = ["React.js", "TypeScript", "Node.js", "Docker", "PostgreSQL"];
    for (const tech of requiredTechs) {
      expect(TECH_DESC[tech], `Falta la tecnología: ${tech}`).toBeDefined();
    }
  });

  it("las descripciones son strings", () => {
    for (const [key, value] of Object.entries(TECH_DESC)) {
      expect(typeof value, `${key} no es string`).toBe("string");
    }
  });
});
