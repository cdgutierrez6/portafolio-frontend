import { ImageResponse } from "next/og";
import { portfolioData } from "@/data/portfolio-data";

/**
 * Imagen Open Graph / Twitter (1200×630) generada en build/edge con next/og.
 * Sustituye al `public/og-image.png` que estaba referenciado en metadata pero
 * NO existía → las previews al compartir el link salían rotas. Al ser dinámica,
 * queda siempre en sync con el nombre/título (fuente única: portfolio-data.ts).
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Cristian Gutierrez — Solutions Architect & Senior Full-Stack Engineer";

export default function OpengraphImage({ params }: { params: { locale: string } }) {
  const locale = params.locale === "en" ? "en" : "es";
  const { personalInfo } = portfolioData;
  const name = locale === "en" ? personalInfo.nameEn : personalInfo.nameEs;
  const title = locale === "en" ? personalInfo.titleEn : personalInfo.titleEs;
  const tagline =
    locale === "en"
      ? "13+ years · Microservices · AI Automation"
      : "13+ años · Microservicios · Automatización IA";
  const stack = [".NET", "Java", "React", "Angular", "AI"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0f172a",
          color: "#f8fafc",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Barra de acento roja de marca */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "14px", height: "100%", background: "#e51e2a" }} />
        <div style={{ display: "flex", fontSize: 32, letterSpacing: 8, color: "#e51e2a", fontWeight: 700, textTransform: "uppercase" }}>
          Portfolio
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, marginTop: 8, lineHeight: 1.05 }}>{name}</div>
        <div style={{ display: "flex", fontSize: 40, color: "#cbd5e1", marginTop: 18 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 30, color: "#94a3b8", marginTop: 22 }}>{tagline}</div>
        <div style={{ display: "flex", gap: 16, marginTop: 44 }}>
          {stack.map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                padding: "10px 24px",
                border: "2px solid #334155",
                borderRadius: 14,
                fontSize: 26,
                color: "#e2e8f0",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
