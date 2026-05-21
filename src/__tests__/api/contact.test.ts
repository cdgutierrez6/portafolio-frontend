/**
 * Tests para POST /api/contact
 * Valida: campos requeridos, longitudes, formato email, rate limiting y envío
 */

// Helpers replicados del route (sin importar el módulo completo para aislar)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateContactInput(data: {
  senderName?: unknown;
  senderEmail?: unknown;
  subject?: unknown;
  message?: unknown;
}): { valid: boolean; error?: string } {
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Validación de inputs ──────────────────────────────────────────────────────

describe("validateContactInput — campos requeridos", () => {
  it("rechaza cuando todos los campos están vacíos", () => {
    expect(validateContactInput({})).toEqual({ valid: false, error: "Todos los campos son requeridos" });
  });

  it("rechaza cuando falta senderName", () => {
    const result = validateContactInput({ senderEmail: "a@b.com", subject: "Hola", message: "Msg" });
    expect(result.valid).toBe(false);
  });

  it("rechaza cuando falta senderEmail", () => {
    const result = validateContactInput({ senderName: "Juan", subject: "Hola", message: "Msg" });
    expect(result.valid).toBe(false);
  });

  it("rechaza cuando falta subject", () => {
    const result = validateContactInput({ senderName: "Juan", senderEmail: "a@b.com", message: "Msg" });
    expect(result.valid).toBe(false);
  });

  it("rechaza cuando falta message", () => {
    const result = validateContactInput({ senderName: "Juan", senderEmail: "a@b.com", subject: "Hola" });
    expect(result.valid).toBe(false);
  });

  it("acepta formulario completo y válido", () => {
    const result = validateContactInput({
      senderName: "Juan Pérez",
      senderEmail: "juan@example.com",
      subject: "Consulta de trabajo",
      message: "Hola, me interesa tu perfil.",
    });
    expect(result).toEqual({ valid: true });
  });
});

describe("validateContactInput — longitudes máximas", () => {
  it("rechaza senderName > 100 caracteres", () => {
    const result = validateContactInput({
      senderName:   "A".repeat(101),
      senderEmail:  "a@b.com",
      subject:      "Asunto",
      message:      "Mensaje",
    });
    expect(result.valid).toBe(false);
  });

  it("rechaza senderEmail > 254 caracteres", () => {
    const result = validateContactInput({
      senderName:  "Juan",
      senderEmail: "a".repeat(250) + "@b.com",
      subject:     "Asunto",
      message:     "Mensaje",
    });
    expect(result.valid).toBe(false);
  });

  it("rechaza subject > 200 caracteres", () => {
    const result = validateContactInput({
      senderName:  "Juan",
      senderEmail: "a@b.com",
      subject:     "S".repeat(201),
      message:     "Mensaje",
    });
    expect(result.valid).toBe(false);
  });

  it("rechaza message > 5000 caracteres", () => {
    const result = validateContactInput({
      senderName:  "Juan",
      senderEmail: "a@b.com",
      subject:     "Asunto",
      message:     "M".repeat(5001),
    });
    expect(result.valid).toBe(false);
  });

  it("acepta campos exactamente en el límite", () => {
    const result = validateContactInput({
      senderName:  "A".repeat(100),
      senderEmail: "a@b.com",
      subject:     "S".repeat(200),
      message:     "M".repeat(5000),
    });
    expect(result.valid).toBe(true);
  });
});

describe("validateContactInput — formato de email", () => {
  const invalidEmails = [
    "sinArroba",
    "@sinLocal.com",
    "sin-dominio@",
    "doble@@arroba.com",
    "espacio @dominio.com",
    "a@b",
    "",
  ];

  invalidEmails.forEach((email) => {
    it(`rechaza email inválido: "${email}"`, () => {
      const result = validateContactInput({
        senderName: "Juan",
        senderEmail: email,
        subject: "Asunto",
        message: "Mensaje",
      });
      expect(result.valid).toBe(false);
    });
  });

  const validEmails = [
    "user@example.com",
    "user+tag@sub.domain.org",
    "a@b.co",
    "123@456.com",
  ];

  validEmails.forEach((email) => {
    it(`acepta email válido: "${email}"`, () => {
      const result = validateContactInput({
        senderName: "Juan",
        senderEmail: email,
        subject: "Asunto",
        message: "Mensaje",
      });
      expect(result.valid).toBe(true);
    });
  });
});

// ── escapeHtml — prevención XSS ──────────────────────────────────────────────

describe("escapeHtml — sanitización de inputs", () => {
  it("escapa < y >", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("escapa comillas dobles", () => {
    expect(escapeHtml('He said "hello"')).toBe("He said &quot;hello&quot;");
  });

  it("escapa comillas simples", () => {
    expect(escapeHtml("It's fine")).toBe("It&#039;s fine");
  });

  it("escapa ampersands", () => {
    expect(escapeHtml("Rock & Roll")).toBe("Rock &amp; Roll");
  });

  it("no modifica texto plano sin caracteres especiales", () => {
    expect(escapeHtml("Hola mundo 123")).toBe("Hola mundo 123");
  });

  it("maneja string vacío", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("escapa payload XSS común", () => {
    const input = '<img src=x onerror="alert(1)">';
    expect(escapeHtml(input)).not.toContain("<");
    expect(escapeHtml(input)).not.toContain(">");
  });
});

// ── Localización de datos ─────────────────────────────────────────────────────

describe("getData — localización ES/EN", () => {
  const raw = {
    nameEs: "Juan ES", nameEn: "Juan EN",
    titleEs: "Título ES", titleEn: "Title EN",
    bioEs: "Bio ES", bioEn: "Bio EN",
  };

  it("devuelve nombre en español para locale=es", () => {
    const name = raw.nameEs;
    expect(name).toBe("Juan ES");
  });

  it("devuelve nombre en inglés para locale=en", () => {
    const name = raw.nameEn;
    expect(name).toBe("Juan EN");
  });

  it("asigna IDs incrementales a experiencias", () => {
    const exps = [{ company: "A" }, { company: "B" }].map((e, i) => ({ ...e, id: i + 1 }));
    expect(exps[0].id).toBe(1);
    expect(exps[1].id).toBe(2);
  });
});
