"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { scrollStore } from "../three/scroll-store";
import { type Locale } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COPY = {
  es: {
    eyebrow: "CÓMO TRABAJO",
    stages: [
      { t: "Arquitectura primero", d: "Diseño el sistema antes de escribir una línea: límites, contratos y datos." },
      { t: "Código que se sostiene", d: "Clean Code y SOLID sobre .NET, Node y React. Legible hoy, mantenible en 3 años." },
      { t: "Entrega verificada", d: "CI/CD, tests y observabilidad. Si no está medido y desplegado, no está hecho." },
    ],
  },
  en: {
    eyebrow: "HOW I WORK",
    stages: [
      { t: "Architecture first", d: "I design the system before writing a line: boundaries, contracts and data." },
      { t: "Code that holds up", d: "Clean Code and SOLID across .NET, Node and React. Readable now, maintainable in 3 years." },
      { t: "Verified delivery", d: "CI/CD, tests and observability. If it isn't measured and shipped, it isn't done." },
    ],
  },
} as const;

export default function Showcase3D({ locale }: { locale: Locale }) {
  const section = useRef<HTMLElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const t = COPY[locale === "en" ? "en" : "es"];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 1) El progreso del scroll va a un objeto MUTABLE que lee useFrame.
      //    Nunca setState aquí: onUpdate corre varias veces por frame.
      const st = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollStore.showcase = self.progress;
        },
      });

      // 2) Los textos se relevan por etapas, atados al mismo recorrido.
      const stages = stageRefs.current.filter(Boolean) as HTMLDivElement[];
      stages.forEach((el, i) => {
        const from = 0.12 + i * 0.28;
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none", // scrub SIEMPRE con ease:'none', si no se siente "desconectado" al subir
            scrollTrigger: {
              trigger: section.current,
              start: `top+=${from * 100}% top`,
              end: `top+=${(from + 0.10) * 100}% top`,
              scrub: true,
            },
          }
        );
        // …y se van cuando pasa su turno.
        gsap.to(el, {
          autoAlpha: 0,
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: `top+=${(from + 0.17) * 100}% top`,
            end: `top+=${(from + 0.26) * 100}% top`,
            scrub: true,
          },
        });
      });

      return () => st.kill();
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      id="showcase-3d"
      aria-label={locale === "es" ? "Cómo trabajo" : "How I work"}
      style={{ position: "relative", height: "400vh", zIndex: 10 }}
    >
      {/* El canvas se queda PEGADO mientras la sección alta recorre el viewport.
          Usamos CSS sticky y NO ScrollTrigger pin:true (pin mete un pin-spacer que
          descuadra el alto en móvil cuando cargan fuentes/imágenes tarde). */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* El 3D lo pinta el canvas GLOBAL fijo (detrás de toda la página).
            Esta sección solo aporta el recorrido de scroll y el copy por etapas. */}

        {/* Copy por etapas, encima del 3D */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "1200px",
            padding: "0 1.5rem",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              color: "var(--color-primary)",
              marginBottom: "1rem",
            }}
          >
            {t.eyebrow}
          </p>

          <div style={{ position: "relative", minHeight: "180px" }}>
            {t.stages.map((s, i) => (
              <div
                key={s.t}
                ref={(el) => {
                  stageRefs.current[i] = el;
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  maxWidth: "520px",
                }}
              >
                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: "0.9rem",
                  }}
                >
                  <span className="gradient-text">{s.t}</span>
                </h2>
                <p style={{ fontSize: "1rem", lineHeight: 1.7, opacity: 0.78 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .showcase-canvas {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        /* Móvil: el texto va abajo y el 3D ocupa arriba, para que no se pisen. */
        @media (max-width: 768px) {
          #showcase-3d .showcase-canvas { inset: -10% 0 25% 0; }
        }
        /* Sin motion: la sección colapsa a una altura normal y el 3D no se monta. */
        @media (prefers-reduced-motion: reduce) {
          #showcase-3d { height: auto !important; }
          #showcase-3d > div { position: static !important; height: auto !important; padding: 5rem 0; }
          #showcase-3d [style*="position: absolute"] { position: static !important; opacity: 1 !important; visibility: visible !important; margin-bottom: 2.5rem; }
        }
      `,
        }}
      />
    </section>
  );
}
