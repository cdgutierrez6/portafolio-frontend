import { NextRequest, NextResponse } from "next/server";

const contactAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = contactAttempts.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= 5) return false;
    entry.count++;
  } else {
    contactAttempts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
  }
  return true;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  const rawIp = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const ip = rawIp.split(",")[0].trim();
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Demasiados mensajes. Intenta de nuevo en una hora." }, { status: 429 });
  }

  try {
    const { senderName, senderEmail, subject, message } = await req.json();

    if (!senderName || !senderEmail || !subject || !message) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    if (senderName.length > 100 || senderEmail.length > 254 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "Uno o más campos exceden la longitud máxima permitida" }, { status: 400 });
    }

    if (!EMAIL_RE.test(senderEmail)) {
      return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 });
    }

    const toEmail = process.env.CONTACT_EMAIL ?? "cdgutierrez6@gmail.com";
    const resendKey = process.env.RESEND_API_KEY;

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0F172A;color:#F1F5F9;border-radius:12px">
        <h2 style="color:#6366F1;margin-bottom:4px">📬 Nuevo mensaje desde tu portafolio</h2>
        <hr style="border-color:#1E293B;margin:16px 0"/>
        <p><strong>De:</strong> ${escapeHtml(senderName)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(senderEmail)}" style="color:#10B981">${escapeHtml(senderEmail)}</a></p>
        <p><strong>Asunto:</strong> ${escapeHtml(subject)}</p>
        <hr style="border-color:#1E293B;margin:16px 0"/>
        <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</p>
      </div>
    `;

    if (resendKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      const { error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [toEmail],
        replyTo: senderEmail,
        subject: `[Portfolio] ${escapeHtml(subject)}`,
        html,
      });
      if (error) {
        console.error("[Contact] Resend error:", error);
        return NextResponse.json({ error: "No se pudo enviar el mensaje. Intenta de nuevo más tarde." }, { status: 500 });
      }
    } else {
      console.log("📧 [Contact] Sin RESEND_API_KEY — mensaje recibido:", { to: toEmail, senderName, senderEmail, subject, message });
      return NextResponse.json({ success: true, warning: "RESEND_API_KEY no configurada — mensaje registrado en consola." });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 });
  }
}
