"use client";

import { useEffect, useState } from "react";

export default function IntroScreen() {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "done">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 200);
    const t2 = setTimeout(() => setPhase("exit"), 3200);
    const t3 = setTimeout(() => setPhase("done"), 3900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const skip = () => {
    setPhase("exit");
    setTimeout(() => setPhase("done"), 700);
  };

  if (phase === "done") return null;

  return (
    <div className={`intro-overlay${phase === "exit" ? " intro-exit" : ""}`} aria-hidden="true">
      <div className="intro-grid" />
      {[...Array(12)].map((_, i) => (
        <div key={i} className="intro-particle" style={{
          left: `${8 + i * 7.5}%`,
          animationDelay: `${i * 0.3}s`,
          animationDuration: `${3 + (i % 4)}s`,
        }} />
      ))}
      <div className={`intro-content${phase !== "enter" ? " intro-content-in" : ""}`}>
        <div className="intro-monogram-wrap">
          <div className="intro-ring intro-ring-1" />
          <div className="intro-ring intro-ring-2" />
          <div className="intro-monogram">
            <span>CG</span>
          </div>
        </div>
        <h1 className="intro-name">Cristian Gutiérrez</h1>
        <p className="intro-role">Senior Full-Stack Engineer</p>
        <div className="intro-tags">
          {["React", ".NET Core", "Microservicios", "IA & Cloud"].map((tag, i) => (
            <span key={tag} className="intro-tag" style={{ animationDelay: `${1.4 + i * 0.15}s` }}>{tag}</span>
          ))}
        </div>
        <div className="intro-bar-wrap">
          <div className={`intro-bar${phase !== "enter" ? " intro-bar-fill" : ""}`} />
        </div>
      </div>
      <button className="intro-skip" onClick={skip}>Skip →</button>
    </div>
  );
}
