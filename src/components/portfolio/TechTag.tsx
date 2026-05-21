"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { TECH_DESC } from "@/lib/tech-descriptions";

interface Props {
  name: string;
  accentColor: string;
  animDelay?: string;
}

const TIP_W  = 240;
const MARGIN = 10;
const GAP    = 10;

interface TipPos {
  top: number;
  left: number;
  arrowLeft: number;
  below: boolean;
}

export function TechTag({ name, accentColor, animDelay }: Props) {
  const [open,    setOpen]    = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos,     setPos]     = useState<TipPos | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const description = TECH_DESC[name];

  useEffect(() => {
    setMounted(true);
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const calcPos = useCallback(() => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const vw   = window.innerWidth;
    const cx   = rect.left + rect.width / 2;
    let   left = cx - TIP_W / 2;
    if (left < MARGIN)                  left = MARGIN;
    if (left + TIP_W > vw - MARGIN)     left = vw - MARGIN - TIP_W;
    const arrowLeft = cx - left;
    const below = rect.top < 160;
    const top   = below ? rect.bottom + GAP : rect.top - GAP;
    setPos({ top, left, arrowLeft, below });
  }, []);

  useEffect(() => {
    if (open) { calcPos(); } else { setPos(null); }
  }, [open, calcPos]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  if (!description) {
    return (
      <span className="tech-tag skill-tag" style={{ borderColor: `${accentColor}50`, transitionDelay: animDelay }}>
        {name}
      </span>
    );
  }

  const tooltip = mounted && pos
    ? createPortal(
        <div role="tooltip" className="tech-tooltip" style={{ position: "fixed", top: pos.top, left: pos.left, width: TIP_W, transform: pos.below ? "none" : "translateY(-100%)", pointerEvents: "none" }}>
          <div className="tooltip-header" style={{ color: accentColor }}>{name}</div>
          <div className="tooltip-body">{description}</div>
          <div className="tooltip-arrow" style={{ left: pos.arrowLeft, bottom: pos.below ? "auto" : -6, top: pos.below ? -6 : "auto", transform: "translateX(-50%) rotate(45deg)", borderTop: pos.below ? "1px solid color-mix(in srgb, var(--color-primary) 45%, transparent)" : "none", borderLeft: pos.below ? "1px solid color-mix(in srgb, var(--color-primary) 45%, transparent)" : "none", borderRight: pos.below ? "none" : "1px solid color-mix(in srgb, var(--color-primary) 45%, transparent)", borderBottom: pos.below ? "none" : "1px solid color-mix(in srgb, var(--color-primary) 45%, transparent)" }} />
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div ref={wrapRef} style={{ position: "relative", display: "inline-block" }}
        onMouseEnter={() => { if (!isTouch) setOpen(true);  }}
        onMouseLeave={() => { if (!isTouch) setOpen(false); }}
        onClick={()       => { if (isTouch)  setOpen(v => !v); }}
      >
        <span className={`tech-tag skill-tag${open ? " tag-active" : ""}`} style={{ borderColor: `${accentColor}50`, transitionDelay: animDelay, cursor: "pointer" }}>
          {name}
          <span className="tag-info-dot">?</span>
        </span>
      </div>
      {tooltip}
    </>
  );
}
