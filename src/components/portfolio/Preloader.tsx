"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { markIntroDone } from "./intro-state";

/**
 * INTRO CINEMATOGRÁFICA — video del stack (nebulosa) a pantalla completa, CON AUDIO.
 *
 * Patrón (igual a silenciadores-y-mas `intro-screen`, adaptado):
 *  - El video arranca `muted` → el navegador SIEMPRE permite el autoplay (nunca lo bloquea).
 *    Un BOTÓN de sonido lo activa con un tap: `video.muted = false` IMPERATIVO (no con la
 *    prop `muted`, que rompe el autoplay). El tap es el "gesto de usuario" que habilita el
 *    audio que el navegador bloquea sin interacción.
 *  - Se ve SIEMPRE que se recargue (NO once-por-sesión). Solo `reduced-motion` la salta.
 *  - Responsive: desktop cover full-bleed; móvil/portrait `contain` (composición 16:9
 *    completa) + poster ampliado y DESENFOCADO de fondo (no franjas negras). Ver globals.css.
 *  - Hand-off al hero con crossfade (contrato markIntroDone). El cierre lo manda el
 *    `onEnded` del propio video → nunca corta el final; watchdog/safety solo por si se cuelga.
 */
const START_WATCHDOG_MS = 7000; // si el video NO arranca en 7s (red muerta) → hero, sin atrapar
const SAFETY_MARGIN_MS = 2500;  // colchón sobre la duración real, por si onEnded no llega

export default function Preloader({ locale = "es" }: { locale?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const watchdog = useRef<number | undefined>(undefined);
  const safety = useRef<number | undefined>(undefined);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  const [muted, setMuted] = useState(true); // arranca muted (regla autoplay); el botón lo activa

  // Cierre de la intro: hero arranca, overlay hace crossfade y se desmonta.
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    window.clearTimeout(watchdog.current);
    window.clearTimeout(safety.current);
    markIntroDone(); // el hero lanza su titular cinético durante el fade
    setFading(true);
    window.setTimeout(() => {
      document.body.style.overflow = "";
      setGone(true);
    }, 850);
  }, []);

  // El video EMPEZÓ a reproducir de verdad → cancelar watchdog y armar el colchón de
  // seguridad ANCLADO AL INICIO REAL (no al montaje) → el buffering no come del final.
  const handlePlaying = useCallback(() => {
    window.clearTimeout(watchdog.current);
    if (safety.current) return;
    const v = video.current;
    const durMs = (v && isFinite(v.duration) ? v.duration : 10) * 1000;
    safety.current = window.setTimeout(finish, durMs + SAFETY_MARGIN_MS);
  }, [finish]);

  // Sonido SOLO en la intro: se toca el <video> de forma IMPERATIVA (NO con la prop `muted`,
  // que rompe el autoplay). El tap del usuario habilita el audio que el navegador bloqueaba.
  const toggleSound = useCallback(() => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Accesibilidad: reduced-motion → hero directo (sin video de 10s).
    if (reduce) {
      markIntroDone();
      setGone(true);
      return;
    }
    // SIN once-por-sesión → la intro se ve SIEMPRE que se recarga (pedido de Cristian).
    document.body.style.overflow = "hidden";

    const v = video.current;
    if (v) {
      v.muted = true; // asegura que el autoplay esté permitido
      v.play().catch(() => {}); // si rechaza, el watchdog cierra a los 7s
    }

    // Watchdog: si el video NUNCA arranca (red muerta) en 7s → hero, sin atrapar.
    watchdog.current = window.setTimeout(() => {
      const vv = video.current;
      if (!vv || vv.currentTime < 0.1) finish();
    }, START_WATCHDOG_MS);

    return () => {
      window.clearTimeout(watchdog.current);
      window.clearTimeout(safety.current);
      document.body.style.overflow = "";
    };
  }, [finish]);

  if (gone) return null;

  const skipLabel = locale === "en" ? "Skip" : "Saltar";
  const soundLabel = locale === "en" ? "Sound" : "Sonido";

  const btnBase: React.CSSProperties = {
    position: "absolute",
    bottom: "clamp(1rem, 4vh, 2.25rem)",
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    padding: "0.5rem 1rem",
    fontFamily: "var(--font-display), sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(242,242,242,0.78)",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "999px",
    backdropFilter: "blur(6px)",
    cursor: "pointer",
    transition: "color 0.2s ease, border-color 0.2s ease, background 0.2s ease",
  };

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
      {/* Fill de marca desenfocado detrás del video — SOLO móvil/portrait (globals.css).
          En desktop queda oculto (el video en cover llena la pantalla). */}
      <div className="intro-fill" aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      <video
        ref={video}
        className="intro-video"
        // webm primero (más liviano, Chrome/FF), mp4 de respaldo (Safari). Ambos con audio.
        poster="/media/intro-poster.webp"
        muted
        playsInline
        autoPlay
        preload="auto"
        onPlaying={handlePlaying}
        onEnded={finish}
        onError={finish}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <source src="/media/intro.webm" type="video/webm" />
        <source src="/media/intro.mp4" type="video/mp4" />
      </video>

      {/* Viñeta sutil: hunde los bordes a negro → funde con el fondo #07080d en el hand-off. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(5,5,5,0.55) 100%)",
        }}
      />

      {/* SONIDO (abajo-izquierda): arranca muted; el tap activa el audio. */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? (locale === "en" ? "Turn sound on" : "Activar sonido") : (locale === "en" ? "Mute" : "Silenciar")}
        style={{ ...btnBase, left: "clamp(1rem, 5vw, 2.5rem)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#F2F2F2";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.34)";
          e.currentTarget.style.background = "rgba(110,139,255,0.16)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(242,242,242,0.78)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        }}
      >
        {muted ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span>{soundLabel}</span>
          </>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* SALTAR (abajo-derecha). */}
      <button
        type="button"
        onClick={finish}
        style={{ ...btnBase, right: "clamp(1rem, 5vw, 2.5rem)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#F2F2F2";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.34)";
          e.currentTarget.style.background = "rgba(255,255,255,0.09)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(242,242,242,0.78)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        }}
      >
        {skipLabel} ↓
      </button>
    </div>
  );
}
