"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Frontera de carga del 3D global.
 *
 * - `dynamic(..., { ssr:false })` NO puede llamarse desde un Server Component en Next 14
 *   App Router (revienta el build) → vive aquí, en su propio archivo "use client".
 * - No se monta hasta después del primer paint: three.js son ~150KB gz y NO debe competir
 *   con el LCP. Esperamos a `requestIdleCallback` (o un timeout de respaldo).
 * - prefers-reduced-motion o gama baja → nunca se monta WebGL. La página funciona igual.
 */
const Scene = dynamic(() => import("./Scene3DBackground"), { ssr: false, loading: () => null });

export default function Scene3DBackgroundClient() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.deviceMemory ?? 8) < 2 || (navigator.hardwareConcurrency ?? 8) < 4) return;

    // Montar cuando el navegador esté ocioso → el LCP ya pasó.
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    let id: number | undefined;
    if (idle) id = idle(() => setMount(true));
    else id = window.setTimeout(() => setMount(true), 900);

    return () => {
      if (id !== undefined) window.clearTimeout(id);
    };
  }, []);

  if (!mount) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,          // ENTRE la capa trasera del titular (z1) y la frontal/contenido (z3)
        pointerEvents: "none",
      }}
    >
      <Scene />
    </div>
  );
}
