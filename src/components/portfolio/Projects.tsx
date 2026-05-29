"use client";

import { type Project } from "@/lib/types";
import { useReveal } from "@/hooks/useReveal";

const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178C6",
  Python:     "#3572A5",
  "C#":       "#178600",
  Java:       "#B07219",
};

const GH_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LIVE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

interface Props {
  projects: Project[];
  t: { projects: { title: string; subtitle: string; viewCode: string; viewLive: string; star: string; allRepos: string } };
  animated: boolean;
}

export default function ProjectsSection({ projects, t, animated }: Props) {
  const titleRef = useReveal<HTMLHeadingElement>({ direction: "up", threshold: 0.3, animated });

  return (
    <section
      id="projects"
      className="section"
      aria-labelledby="projects-heading"
      style={{ position: "relative", zIndex: 10 }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <h2 id="projects-heading" ref={titleRef} className="section-title">
          {t.projects.title}
        </h2>
        <p style={{ opacity: 0.6, marginTop: "-1rem", marginBottom: "2.5rem", fontSize: "1rem" }}>
          {t.projects.subtitle}
        </p>

        <div
          className="projects-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: "1.5rem" }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} animated={animated} t={t.projects} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <a
            href="https://github.com/cdgutierrez6"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              color: "var(--color-primary)", fontWeight: 600, fontSize: "0.95rem",
              textDecoration: "none", opacity: 0.85,
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
          >
            {GH_ICON}
            {t.projects.allRepos}
          </a>
        </div>
      </div>

      <style>{`@media (max-width: 640px) { .projects-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function ProjectCard({
  project, index, animated, t,
}: {
  project: Project;
  index: number;
  animated: boolean;
  t: Props["t"]["projects"];
}) {
  const ref = useReveal<HTMLDivElement>({ direction: index % 2 === 0 ? "left" : "right", delay: index * 100, threshold: 0.1, animated });
  const langColor = LANG_COLOR[project.language] ?? "var(--color-primary)";

  return (
    <div
      ref={ref}
      className="card"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        borderTop: `3px solid ${project.accent}`,
        transition: "box-shadow 0.25s, transform 0.25s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseOver={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = `0 8px 32px color-mix(in srgb, ${project.accent} 20%, transparent)`;
        el.style.transform = "translateY(-3px)";
      }}
      onMouseOut={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "";
        el.style.transform = "";
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: project.accent, margin: 0, lineHeight: 1.3 }}>
          {project.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          {project.stars > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", opacity: 0.7 }}>
              ⭐ {project.stars} {t.star}
            </span>
          )}
          <span
            style={{
              fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.55rem",
              borderRadius: "9999px",
              background: `color-mix(in srgb, ${langColor} 18%, transparent)`,
              color: langColor,
              border: `1px solid color-mix(in srgb, ${langColor} 35%, transparent)`,
              whiteSpace: "nowrap",
            }}
          >
            {project.language}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: "0.875rem", opacity: 0.75, lineHeight: 1.65, margin: 0, flexGrow: 1 }}>
        {project.description}
      </p>

      {/* Tech pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {project.technologies.map((tech) => (
          <span key={tech} className="tech-tag" style={{ fontSize: "0.72rem" }}>{tech}</span>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.viewCode} — ${project.name}`}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.8rem", fontWeight: 600, padding: "0.4rem 0.9rem",
            borderRadius: "9999px", textDecoration: "none",
            background: `color-mix(in srgb, ${project.accent} 12%, transparent)`,
            color: project.accent,
            border: `1px solid color-mix(in srgb, ${project.accent} 30%, transparent)`,
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.background = `color-mix(in srgb, ${project.accent} 22%, transparent)`)}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.background = `color-mix(in srgb, ${project.accent} 12%, transparent)`)}
        >
          {GH_ICON}
          {t.viewCode}
        </a>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.viewLive} — ${project.name}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "0.8rem", fontWeight: 600, padding: "0.4rem 0.9rem",
              borderRadius: "9999px", textDecoration: "none",
              background: "transparent",
              color: "var(--color-text)",
              border: "1px solid color-mix(in srgb, var(--color-text) 25%, transparent)",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = project.accent;
              el.style.color = project.accent;
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "color-mix(in srgb, var(--color-text) 25%, transparent)";
              el.style.color = "var(--color-text)";
            }}
          >
            {LIVE_ICON}
            {t.viewLive}
          </a>
        )}
      </div>
    </div>
  );
}
