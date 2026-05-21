"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useReveal } from "@/hooks/useReveal";

interface Props {
  personal: { name: string; email: string; phone: string; location: string; githubUrl: string | null; linkedinUrl: string | null };
  t: { contact: { title: string; send: string; name: string; message: string; subject: string; phone: string; location: string; email: string; placeholderName: string; placeholderEmail: string; placeholderSubject: string; placeholderMessage: string } };
  animated: boolean;
}

export default function Contact({ personal, t, animated }: Props) {
  const [form, setForm]       = useState({ senderName: "", senderEmail: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const titleRef = useReveal<HTMLHeadingElement>({ direction: "up", threshold: 0.3, animated });
  const formRef  = useReveal<HTMLDivElement>({ direction: "right", delay: 200, threshold: 0.15, animated });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("✅ Mensaje enviado correctamente");
        setForm({ senderName: "", senderEmail: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        toast.error(data.error ?? "❌ Error al enviar");
      }
    } catch {
      toast.error("❌ No se pudo conectar al servidor");
    } finally {
      setSending(false);
    }
  };

  const contacts = [
    { icon: "📧", label: t.contact.email,    value: personal.email,    href: null, copy: true  },
    { icon: "📱", label: t.contact.phone,    value: personal.phone,    href: null, copy: true  },
    { icon: "📍", label: t.contact.location, value: personal.location, href: null, copy: false },
    ...(personal.githubUrl   ? [{ icon: "🐙", label: "GitHub",   value: personal.githubUrl,   href: personal.githubUrl,   copy: false }] : []),
    ...(personal.linkedinUrl ? [{ icon: "💼", label: "LinkedIn", value: personal.linkedinUrl, href: personal.linkedinUrl, copy: false }] : []),
  ];

  return (
    <section id="contact" className="section" aria-labelledby="contact-heading" style={{ position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        <h2 id="contact-heading" ref={titleRef} className="section-title">{t.contact.title}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }} className="contact-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {contacts.map((c, i) => (
              <ContactInfoCard key={c.label} contact={c} staggerIndex={i} animated={animated} />
            ))}
          </div>
          <div ref={formRef} className="card" style={{ padding: "2rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>✉️ {t.contact.send}</h3>
            <form onSubmit={handleSubmit} aria-label={t.contact.send} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", opacity: 0.6, display: "block", marginBottom: "0.3rem", fontWeight: 600 }}>{t.contact.name}</label>
                <input className="admin-input" value={form.senderName} onChange={(e) => setForm(f => ({ ...f, senderName: e.target.value }))} required placeholder={t.contact.placeholderName} />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", opacity: 0.6, display: "block", marginBottom: "0.3rem", fontWeight: 600 }}>{t.contact.email}</label>
                <input className="admin-input" type="email" value={form.senderEmail} onChange={(e) => setForm(f => ({ ...f, senderEmail: e.target.value }))} required placeholder={t.contact.placeholderEmail} />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", opacity: 0.6, display: "block", marginBottom: "0.3rem", fontWeight: 600 }}>{t.contact.subject}</label>
                <input className="admin-input" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} required placeholder={t.contact.placeholderSubject} />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", opacity: 0.6, display: "block", marginBottom: "0.3rem", fontWeight: 600 }}>{t.contact.message}</label>
                <textarea className="admin-input" value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} placeholder={t.contact.placeholderMessage} style={{ resize: "vertical" }} />
              </div>
              <button type="submit" className={`btn-primary${animated && !sending ? " btn-shimmer" : ""}`} disabled={sending} style={{ justifyContent: "center", opacity: sending ? 0.7 : 1, cursor: sending ? "not-allowed" : "pointer" }}>
                {sending ? "⏳ Enviando..." : `📤 ${t.contact.send}`}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function ContactInfoCard({ contact, staggerIndex, animated }: { contact: { icon: string; label: string; value: string; href: string | null; copy: boolean }; staggerIndex: number; animated: boolean }) {
  const [copied, setCopied] = useState(false);
  const ref = useReveal<HTMLDivElement>({ direction: "left", delay: staggerIndex * 80, threshold: 0.1, animated });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contact.value);
      setCopied(true);
      toast.success(`✅ ${contact.label} copiado`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  const content = (
    <>
      <span aria-hidden="true" style={{ fontSize: "1.5rem", flexShrink: 0 }}>{contact.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "0.75rem", opacity: 0.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{contact.label}</p>
        <p style={{ fontSize: "0.9rem", fontWeight: 500, color: contact.copy || contact.href ? "var(--color-primary)" : undefined, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.value}</p>
      </div>
      {contact.copy && (
        <span style={{ fontSize: "0.7rem", opacity: copied ? 1 : 0.4, color: copied ? "var(--color-secondary)" : undefined, flexShrink: 0, transition: "opacity 0.2s" }}>
          {copied ? "✓ Copiado" : "Copiar"}
        </span>
      )}
    </>
  );

  return (
    <div
      ref={ref}
      className={`card contact-info-card${contact.copy || contact.href ? " contact-info-clickable" : ""}`}
      style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}
      onClick={contact.copy ? handleCopy : undefined}
      role={contact.copy ? "button" : undefined}
      tabIndex={contact.copy ? 0 : undefined}
      onKeyDown={contact.copy ? (e) => e.key === "Enter" && handleCopy() : undefined}
    >
      {contact.href && !contact.copy ? (
        <a href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel="noopener" style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%", textDecoration: "none", color: "inherit" }}>
          {content}
        </a>
      ) : content}
    </div>
  );
}
