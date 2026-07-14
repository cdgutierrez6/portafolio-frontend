"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * Frontera de carga del 3D.
 *
 * - `dynamic(..., { ssr: false })` NO puede llamarse desde un Server Component en Next 14
 *   App Router (revienta el build) → por eso vive aquí, en su propio archivo "use client".
 * - Además NO montamos el canvas hasta que la sección está cerca del viewport: three.js
 *   son ~150KB gz y no debe competir con el LCP.
 * - prefers-reduced-motion → nunca se monta WebGL; se queda el póster estático.
 */
const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false, loading: () => null });

export default function Scene3DClient({
  mode,
  className,
}: {
  mode: "hero" | "showcase";
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    // a11y: si el usuario pidió menos movimiento, no cargamos WebGL en absoluto.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Gama muy baja (poca RAM / pocos núcleos): mejor no montar WebGL.
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.deviceMemory ?? 8) < 2 || (navigator.hardwareConcurrency ?? 8) < 4) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMount(true);
          io.disconnect();
        }
      },
      // rootMargin generoso: precarga justo antes de que entre, para que no se vea el salto.
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={className} aria-hidden="true">
      {mount && <Scene3D mode={mode} />}
    </div>
  );
}
