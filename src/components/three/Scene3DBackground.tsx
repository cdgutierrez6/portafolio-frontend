"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import ParticleField from "./ParticleField";

/**
 * UN canvas WebGL, FIJO detrás de toda la página. El contenido scrollea por encima.
 *
 * PIVOTE (2026-07-14): antes el protagonista era un laptop.glb — lectura "junior"
 * ("hago cosas en un computador"). Se mató. Ahora el protagonista es el SISTEMA VIVO:
 * un campo de partículas GPGPU (curl-noise) que representa el oficio real de Cristian
 * —arquitectura de sistemas distribuidos / IA— y reacciona al mouse y al scroll.
 * (El colapso caos→orden que lo convierte en un grafo de arquitectura es el paso 2.)
 *
 * El campo es AUTOILUMINADO (AdditiveBlending) → no necesita luces, ni Environment,
 * ni ContactShadows. Solo Bloom para que las partículas "enciendan".
 */
export default function Scene3DBackground() {
  // Gama baja → menos partículas (16k en vez de 65k). El montaje del canvas ya se
  // difiere tras el LCP en Scene3DBackgroundClient; aquí solo dimensionamos.
  const size = useMemo(() => {
    if (typeof navigator === "undefined") return 256;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak = (nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4;
    return weak ? 128 : 256;
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* Cámara mirando hacia el interior de la nebulosa (el campo vive alrededor de z≈-1). */}
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />

      <Suspense fallback={null}>
        <ParticleField size={size} colorA="#6366F1" colorB="#10B981" />

        {/* Bloom: hace que las partículas brillen. luminanceThreshold alto para que
            NO se queme todo a blanco lechoso (additive + miles de puntos satura fácil). */}
        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={0.7} luminanceThreshold={0.62} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
