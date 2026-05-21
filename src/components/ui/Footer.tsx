import { type Locale } from "@/lib/types";

interface Props {
  personal: { name: string; email: string };
  t: { footer: { rights: string } };
  locale: Locale;
}

export default function Footer({ personal, t, locale }: Props) {
  return (
    <footer style={{ background: "var(--color-card)", borderTop: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)", padding: "2rem 1.5rem", textAlign: "center", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          <span className="gradient-text">{personal.name}</span>
        </p>
        <p style={{ opacity: 0.5, fontSize: "0.85rem" }}>
          © {new Date().getFullYear()} — {t.footer.rights}
        </p>
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          <a href={`/${locale === "es" ? "en" : "es"}`} style={{ color: "var(--color-primary)", fontSize: "0.8rem", textDecoration: "none", opacity: 0.7 }}>
            {locale === "es" ? "🇺🇸 English" : "🇨🇴 Español"}
          </a>
        </div>
      </div>
    </footer>
  );
}
