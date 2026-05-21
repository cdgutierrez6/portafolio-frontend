"use client";

import { type Education, type Course } from "@/lib/types";
import { useReveal } from "@/hooks/useReveal";

interface Props {
  education: Education[];
  courses: Course[];
  t: { education: { title: string; courses: string; hours: string } };
  animated: boolean;
}

export default function EducationSection({ education, courses, t, animated }: Props) {
  const titleRef = useReveal<HTMLHeadingElement>({ direction: "up", threshold: 0.3, animated });

  return (
    <section id="education" className="section" aria-labelledby="education-heading" style={{ background: "color-mix(in srgb, var(--color-card) 40%, transparent)", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <h2 id="education-heading" ref={titleRef} className="section-title">{t.education.title}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }} className="edu-grid">
          <div>
            {education.map((edu, i) => (
              <EduCard key={edu.id} edu={edu} index={i} animated={animated} />
            ))}
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span aria-hidden="true">🎓</span> {t.education.courses}
            </h3>
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} animated={animated} t={t} />
            ))}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .edu-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function EduCard({ edu, index, animated }: { edu: Education; index: number; animated: boolean }) {
  const direction = index % 2 === 0 ? "left" : "right" as const;
  const ref = useReveal<HTMLDivElement>({ direction, delay: index * 120, threshold: 0.2, animated });

  return (
    <div ref={ref} className="card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <div aria-hidden="true" style={{ width: "42px", height: "42px", borderRadius: "50%", background: "color-mix(in srgb, var(--color-primary) 15%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
        🎓
      </div>
      <div>
        <p style={{ fontWeight: 700, color: "var(--color-primary)", fontSize: "0.95rem" }}>{edu.institution}</p>
        <p style={{ fontSize: "0.9rem", opacity: 0.85, marginTop: "0.2rem" }}>{edu.degree}</p>
        <p style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "0.2rem" }}>{edu.period}</p>
      </div>
    </div>
  );
}

function CourseCard({ course, index, animated, t }: { course: Course; index: number; animated: boolean; t: Props["t"] }) {
  const ref = useReveal<HTMLDivElement>({ direction: "up", delay: index * 60, threshold: 0.1, animated });

  return (
    <div ref={ref} className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{course.name}</p>
        <p style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.2rem" }}>{course.institution}</p>
      </div>
      {course.hours && (
        <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: "9999px", background: "color-mix(in srgb, var(--color-accent) 15%, transparent)", color: "var(--color-accent)", border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)", whiteSpace: "nowrap" }}>
          {course.hours}h
        </span>
      )}
    </div>
  );
}
