"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { onIntroDone } from "../portfolio/intro-state";

/**
 * Frontera de carga del 3D global.
 *
 * - `dynamic(..., { ssr:false })` NO puede llamarse desde un Server Component en Next 14
 *   App Router (revienta el build) → vive aquí, en su propio archivo "use client".
 * - CLAVE (perf): NO se monta hasta que la INTRO de video TERMINA (`onIntroDone`). Si se
 *   montara durante la intro, el cristal (MeshTransmissionMaterial = varias pasadas/frame),
 *   el piso reflector y el EffectComposer renderizarían a tope DETRÁS del overlay opaco,
 *   ahogando el decode del video y el main thread → jank + clicks que no responden. Antes
 *   se montaba a los ~900ms (en plena intro) — ese era el bug. (silenciadores no tiene WebGL
 *   → su intro es fluida; ahora la nuestra también.)
 * - three.js son ~150KB gz y NO deben competir con el LCP: tras la intro, además, esperamos
 *   a `requestIdleCallback`.
 * - prefers-reduced-motion o gama baja → nunca se monta WebGL. La página funciona igual.
 */
const Scene = dynamic(() => import("./Scene3DBackground"), { ssr: false, loading: () => null });

export default function Scene3DBackgroundClient() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.deviceMemory ?? 8) < 2 || (navigator.hardwareConcurrency ?? 8) < 4) return;

    let timeoutId: number | undefined;

    // Esperar a que la INTRO termine → el WebGL no compite con el decode del video (fin del
    // jank). Tras la intro el LCP ya pasó, así que un timeout corto basta (más fiable que
    // requestIdleCallback, que en pestañas de fondo se throttlea). onIntroDone dispara ya
    // mismo si no hay intro (reduced-motion la salta).
    const unsub = onIntroDone(() => {
      timeoutId = window.setTimeout(() => setMount(true), 200);
    });

    return () => {
      unsub();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
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
