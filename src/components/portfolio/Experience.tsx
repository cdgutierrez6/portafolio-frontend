"use client";

import { useState } from "react";
import { type Experience } from "@/lib/types";
import { useReveal } from "@/hooks/useReveal";

interface Props {
  experiences: Experience[];
  t: { experience: { title: string; present: string; technologies: string } };
  animated: boolean;
}

export default function ExperienceSection({ experiences, t, animated }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const titleRef = useReveal<HTMLHeadingElement>({ direction: "up", threshold: 0.3, animated });

  return (
    <section id="experience" className="section" aria-labelledby="experience-heading" style={{ background: "color-mix(in srgb, var(--color-card) 40%, transparent)", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1.5rem" }}>
        <h2 id="experience-heading" ref={titleRef} className="section-title">{t.experience.title}</h2>
        <div className="timeline-container" style={{ position: "relative", paddingLeft: "2rem" }}>
          <div className={`timeline-line${animated ? " scroll-line" : ""}`} style={{ position: "absolute", left: "6px", top: "8px", bottom: "8px", width: "2px" }} />
          {experiences.map((exp, i) => (
            <ExperienceCard
              key={exp.id}
              exp={exp}
              t={t}
              index={i}
              expanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? null : i)}
              animated={animated}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ exp, t, index, expanded, onToggle, animated }: { exp: Experience; t: Props["t"]; index: number; expanded: boolean; onToggle: () => void; animated: boolean }) {
  const ref = useReveal<HTMLDivElement>({ direction: "right", delay: index * 120, threshold: 0.1, animated });

  return (
    <div ref={ref} style={{ position: "relative", marginBottom: "1.5rem" }}>
      <div className={`timeline-dot${expanded ? " active" : ""}`} style={{ position: "absolute", left: "-1.65rem", top: "1.2rem" }} />
      <div
        className="card"
        style={{ padding: "1.5rem", cursor: "pointer" }}
        onClick={onToggle}
        role="button"
        aria-expanded={expanded}
        aria-controls={`exp-detail-${exp.id}`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "0.25rem" }}>{exp.company}</h3>
            <p style={{ fontWeight: 600, opacity: 0.9 }}>{exp.role}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
            <span className="exp-date-badge" style={{ fontSize: "0.8rem", padding: "0.25rem 0.75rem", borderRadius: "9999px", background: "color-mix(in srgb, var(--color-secondary) 15%, transparent)", color: "var(--color-secondary)", border: "1px solid color-mix(in srgb, var(--color-secondary) 30%, transparent)", whiteSpace: "nowrap" }}>
              {exp.startDate} — {exp.endDate ?? t.experience.present}
            </span>
            <span style={{ fontSize: "1rem", transition: "transform 0.3s", display: "inline-block", transform: expanded ? "rotate(180deg)" : "none" }}>▼</span>
          </div>
        </div>
        {expanded && (
          <div id={`exp-detail-${exp.id}`} style={{ marginTop: "1rem", animation: "fadeIn 0.3s ease" }}>
            <p style={{ opacity: 0.8, lineHeight: 1.7, marginBottom: "1rem" }}>{exp.description}</p>
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, opacity: 0.6, marginBottom: "0.5rem" }}>{t.experience.technologies}:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {exp.technologies.map((tech, tagIdx) => (
                  <span key={tech} className="tech-tag" style={{ transitionDelay: animated ? `${tagIdx * 30}ms` : "0ms" }}>{tech}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
