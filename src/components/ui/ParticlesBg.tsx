"use client";

import { useEffect, useState } from "react";

export default function ParticlesBg() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <canvas
      id="particles-canvas"
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none", opacity: 0.4 }}
      ref={(canvas) => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() || "#6366F1";

        const particles: { x: number; y: number; r: number; vx: number; vy: number }[] = [];
        for (let i = 0; i < 60; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
          });
        }

        let animId: number;
        function draw() {
          ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas!.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas!.height) p.vy *= -1;
            ctx!.beginPath();
            ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx!.fillStyle = primaryColor;
            ctx!.fill();
          });
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 120) {
                ctx!.beginPath();
                ctx!.moveTo(particles[i].x, particles[i].y);
                ctx!.lineTo(particles[j].x, particles[j].y);
                ctx!.strokeStyle = primaryColor;
                ctx!.globalAlpha = 1 - dist / 120;
                ctx!.lineWidth = 0.5;
                ctx!.stroke();
                ctx!.globalAlpha = 1;
              }
            }
          }
          animId = requestAnimationFrame(draw);
        }

        draw();
        const resizeHandler = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener("resize", resizeHandler);
        return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resizeHandler); };
      }}
    />
  );
}
