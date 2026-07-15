"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { markIntroDone } from "./intro-state";

/**
 * INTRO CINEMATOGRÁFICA — reemplaza el contador 0→100 por el video del stack (nebulosa).
 *
 * - Video a pantalla completa con object-fit: cover → ENCUADRA BIEN en móvil (portrait)
 *   y en desktop (landscape): recorta los lados del 16:9, y como la acción vive en el
 *   centro (la nebulosa/nodos), se ve completo en ambos.
 * - Al terminar hace HAND-OFF al hero con un crossfade (markIntroDone dispara el titular).
 * - Skippable, UNA vez por sesión (sessionStorage), y reduced-motion → directo al hero.
 * - TECHO DURO: si el video se cuelga, se bloquea o el tab está oculto (autoplay pausado),
 *   igual pasa al hero a los ~11.5s. Nunca atrapa al visitante (adiós al bug del contador
 *   congelado que dependía del rAF).
 */
const CAP_MS = 11500; // video 10s + margen de hand-off

export default function Preloader({ locale = "es" }: { locale?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  // Cierre de la intro: hero arranca, overlay hace crossfade y se desmonta.
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    markIntroDone(); // el hero lanza su titular cinético durante el fade
    setFading(true);
    window.setTimeout(() => {
      document.body.style.overflow = "";
      setGone(true);
    }, 850);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("introSeen") === "1";

    // Saltar entero: sin animación o ya vista esta sesión → hero directo (sin flash largo).
    if (reduce || seen) {
      markIntroDone();
      setGone(true);
      return;
    }
    sessionStorage.setItem("introSeen", "1");
    document.body.style.overflow = "hidden";

    // Techo duro pase lo que pase.
    const cap = window.setTimeout(finish, CAP_MS);

    // Intentar reproducir; si el autoplay se bloquea (raro con muted+playsInline),
    // no atrapar: hand-off suave.
    const v = video.current;
    if (v) v.play().catch(() => window.setTimeout(finish, 400));

    return () => {
      window.clearTimeout(cap);
      document.body.style.overflow = "";
    };
  }, [finish]);

  if (gone) return null;

  const skipLabel = locale === "en" ? "Skip intro" : "Saltar intro";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#050505",
        opacity: fading ? 0 : 1,
        transform: fading ? "scale(1.06)" : "scale(1)",
        transition: "opacity 0.8s ease, transform 0.9s ease",
        pointerEvents: fading ? "none" : "auto",
        overflow: "hidden",
      }}
    >
      <video
        ref={video}
        className="intro-video"
        // webm primero (más liviano, Chrome/FF), mp4 de respaldo (Safari).
        poster="/media/intro-poster.webp"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={finish}
        onError={finish}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <source src="/media/intro.webm" type="video/webm" />
        <source src="/media/intro.mp4" type="video/mp4" />
      </video>

      {/* Viñeta sutil: hunde los bordes a negro para que funda con el fondo #07080d
          de la página en el hand-off (no un corte de caja de video). */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(5,5,5,0.55) 100%)",
        }}
      />

      {/* Saltar intro — siempre disponible (no atrapar a quien ya la vio / tiene prisa). */}
      <button
        type="button"
        onClick={finish}
        style={{
          position: "absolute",
          bottom: "clamp(1rem, 4vh, 2.25rem)",
          right: "clamp(1rem, 5vw, 2.5rem)",
          zIndex: 2,
          padding: "0.5rem 1rem",
          fontFamily: "var(--font-display), sans-serif",
          fontSize: "0.72rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(242,242,242,0.72)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: "999px",
          backdropFilter: "blur(6px)",
          cursor: "pointer",
          transition: "color 0.2s ease, border-color 0.2s ease, background 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#F2F2F2";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)";
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(242,242,242,0.72)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
      >
        {skipLabel} ↓
      </button>
    </div>
  );
}
