"use client";

import Image from "next/image";
import { type Locale } from "@/lib/types";
import { useEffect, useRef } from "react";

interface Props {
  personal: { name: string; title: string; bio: string; photoUrl: string | null; email: string; githubUrl: string | null; linkedinUrl: string | null; cvUrl: string | null };
  t: { hero: { greeting: string; cta: string; contact: string; download: string } };
  locale: Locale;
  animated: boolean;
}

export default function Hero({ personal, t, locale, animated }: Props) {
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animated || !titleRef.current) return;
    const titles = [personal.title, "Fullstack Developer", locale === "es" ? "Arquitecto de Software" : "Software Architect"];
    let idx = 0, charIdx = 0, deleting = false;
    const type = () => {
      const current = titles[idx];
      if (!titleRef.current) return;
      if (!deleting) {
        titleRef.current.textContent = current.slice(0, charIdx++);
        if (charIdx > current.length) { deleting = true; setTimeout(type, 1800); return; }
      } else {
        titleRef.current.textContent = current.slice(0, charIdx--);
        if (charIdx < 0) { deleting = false; idx = (idx + 1) % titles.length; charIdx = 0; }
      }
      setTimeout(type, deleting ? 40 : 80);
    };
    type();
  }, [animated, personal.title, locale]);

  useEffect(() => {
    if (!animated) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = document.querySelectorAll(".hero-anim");
    elements.forEach((el) => { el.classList.add("reveal", "reveal-up"); });
    const timer = setTimeout(() => { elements.forEach((el) => el.classList.add("visible")); }, 50);
    return () => clearTimeout(timer);
  }, [animated]);

  return (
    <section id="hero" aria-label={locale === "es" ? "Presentación" : "Introduction"} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "8rem 1.5rem 4rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1200px", width: "100%", display: "grid", gridTemplateColumns: "1fr auto", gap: "4rem", alignItems: "center" }} className="hero-grid">
        <div>
          <div className="hero-anim" style={{ transitionDelay: "0ms", display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: "9999px", background: "color-mix(in srgb, var(--color-primary) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)", marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: 600 }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-secondary)", display: "inline-block", animation: "pulse 2s infinite" }} />
            {locale === "es" ? "Disponible para trabajar" : "Available for work"}
          </div>

          <p className="hero-anim" style={{ fontSize: "1.2rem", opacity: 0.7, marginBottom: "0.5rem", transitionDelay: "0ms" }}>
            {t.hero.greeting}
          </p>

          <h1 className={animated ? "hero-anim hero-name" : ""} style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 900, marginBottom: "0.75rem", lineHeight: 1.1, transitionDelay: animated ? "150ms" : "0ms" }}>
            <span className="gradient-text">{personal.name}</span>
          </h1>

          <h2 className={animated ? "hero-anim" : ""} style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: "var(--color-secondary)", fontWeight: 600, marginBottom: "1.5rem", minHeight: "2rem", transitionDelay: animated ? "500ms" : "0ms" }}>
            <span ref={titleRef}>{personal.title}</span>
            {animated && <span style={{ borderRight: "2px solid var(--color-secondary)", animation: "pulse 1s infinite", marginLeft: "2px" }} />}
          </h2>

          <p className={animated ? "hero-anim" : ""} style={{ fontSize: "1rem", opacity: 0.75, lineHeight: 1.7, maxWidth: "600px", marginBottom: "2.5rem", transitionDelay: animated ? "500ms" : "0ms" }}>
            {personal.bio}
          </p>

          <div className="hero-cta-wrap" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <a href="#contact" className={`btn-primary${animated ? " hero-anim" : ""}`} style={{ transitionDelay: animated ? "650ms" : "0ms" }}>
              {t.hero.contact}
            </a>
            <a href="#experience" className={`btn-outline${animated ? " hero-anim" : ""}`} style={{ transitionDelay: animated ? "730ms" : "0ms" }}>
              {t.hero.cta}
            </a>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {personal.githubUrl && (
                <a
                  href={personal.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: "2.4rem", height: "2.4rem", borderRadius: "50%",
                    border: "1.5px solid color-mix(in srgb, var(--color-text) 25%, transparent)",
                    color: "var(--color-text)", textDecoration: "none",
                    transition: "border-color 0.2s, color 0.2s, background 0.2s",
                  }}
                  onMouseOver={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--color-primary)";
                    el.style.color = "var(--color-primary)";
                    el.style.background = "color-mix(in srgb, var(--color-primary) 10%, transparent)";
                  }}
                  onMouseOut={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "color-mix(in srgb, var(--color-text) 25%, transparent)";
                    el.style.color = "var(--color-text)";
                    el.style.background = "transparent";
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
              )}
              {personal.linkedinUrl && (
                <a
                  href={personal.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: "2.4rem", height: "2.4rem", borderRadius: "50%",
                    border: "1.5px solid color-mix(in srgb, var(--color-text) 25%, transparent)",
                    color: "var(--color-text)", textDecoration: "none",
                    transition: "border-color 0.2s, color 0.2s, background 0.2s",
                  }}
                  onMouseOver={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#0A66C2";
                    el.style.color = "#0A66C2";
                    el.style.background = "color-mix(in srgb, #0A66C2 10%, transparent)";
                  }}
                  onMouseOut={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "color-mix(in srgb, var(--color-text) 25%, transparent)";
                    el.style.color = "var(--color-text)";
                    el.style.background = "transparent";
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={animated ? "hero-anim hero-photo-anim" : "hero-photo"} style={{ display: "flex", justifyContent: "center", transitionDelay: animated ? "800ms" : "0ms" }}>
          <div style={{ position: "relative", width: "280px", height: "280px", borderRadius: "50%", padding: "4px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", boxShadow: "0 0 60px color-mix(in srgb, var(--color-primary) 30%, transparent)" }}>
            {personal.photoUrl ? (
              <Image src={personal.photoUrl} alt={locale === "es" ? `Foto de perfil de ${personal.name}` : `Profile photo of ${personal.name}`} fill style={{ borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--color-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>
                👨‍💻
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.5 }}>
        <div style={{ width: "24px", height: "40px", border: "2px solid var(--color-primary)", borderRadius: "12px", display: "flex", justifyContent: "center", paddingTop: "6px" }}>
          <div style={{ width: "4px", height: "8px", background: "var(--color-primary)", borderRadius: "2px", animation: "float 1.5s ease-in-out infinite" }} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-name.reveal { transform: scale(0.95); filter: blur(4px); }
        .hero-name.reveal.visible { transform: scale(1); filter: none; }
        .hero-photo-anim.reveal { transform: scale(0.8); filter: blur(6px); }
        .hero-photo-anim.reveal.visible { transform: scale(1); filter: none; }
      ` }} />
    </section>
  );
}
