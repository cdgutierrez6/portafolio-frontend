"use client";

import { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import ParticleField, { pointerStore } from "./ParticleField";
import ArchitectTrace from "./ArchitectTrace";
import HeroArtifact from "./HeroArtifact";

/**
 * La cámara oscila SUAVE hacia el cursor → parallax de todo el grafo. Es el efecto
 * "vivo" de mejor ratio impacto/coste (un lerp por frame, sin re-render de React).
 * Bajo reduced-motion se queda quieta.
 */
function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state, dt) => {
    if (reduced) return;
    const d = Math.min(dt, 0.1);
    const tx = pointerStore.nx * 0.55;
    const ty = pointerStore.ny * 0.4;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, tx, 2.2, d);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, ty, 2.2, d);
    state.camera.lookAt(0, 0, -1);
  });
  return null;
}

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
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

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
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
        // FIX DE CAUSA RAÍZ (2026-07-14): sin ACES los valores brillantes se CLIPEAN a
        // blanco puro (el reventón del cristal). ACES los comprime como una cámara real →
        // el look "foto de cine" en vez de "CGI barato / sRGB crudo".
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.8, // más bajo → ACES no empuja los brillos a amarillo/rojo
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ background: "transparent" }}
    >
      {/* Cámara mirando hacia el interior de la nebulosa (el campo vive alrededor de z≈-1). */}
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />

      {/* La cámara oscila hacia el cursor → parallax de TODO (campo + trazo). */}
      <CameraRig reduced={reduced} />

      <Suspense fallback={null}>
        {/* PoC de fidelidad: artefacto de cristal refractivo con reflejos de estudio
            (Environment+Lightformer) — la dirección nueva tras el feedback de Cristian. */}
        <HeroArtifact />

        <ParticleField size={size} colorA="#6366F1" colorB="#10B981" />

        {/* EL TRAZO DEL ARQUITECTO: el objeto protagonista que recorre la pantalla y
            muta de pose por sección. Hermano del campo → lo enciende el mismo Bloom. */}
        <ArchitectTrace colorA="#818CF8" colorB="#34D399" />

        {/* SUELO REFLECTIVO: el reflejo "de agua/mármol pulido" que da composición de
            bodegón caro — refleja el cristal y las señales del grafo. Oscuro y bajo. */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, -1]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            resolution={512}
            blur={[400, 200]}
            mixBlur={1}
            mixStrength={18}
            roughness={0.85}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            color="#05070d"
            metalness={0.6}
            mirror={0.45}
          />
        </mesh>

        {/* Bloom: hace que las partículas brillen. luminanceThreshold alto para que
            NO se queme todo a blanco lechoso (additive + miles de puntos satura fácil). */}
        <EffectComposer enableNormalPass={false}>
          {/* CAPA FOTOGRÁFICA (lo que convierte un render en una "toma de cine"):
              DoF enfoca el cristal → el campo de partículas detrás cae en bokeh (jerarquía);
              Bloom selectivo para las señales; grano ISO sutil; viñeta que centra la mirada. */}
          <DepthOfField target={[2.7, 0.15, 0]} focalLength={0.03} bokehScale={2.5} height={480} />
          <Bloom intensity={0.7} luminanceThreshold={0.9} luminanceSmoothing={0.2} mipmapBlur />
          {/* Grano SUTIL (≤8%): ISO fotográfico, no ruido de TV. 0.35 machacaba el cristal. */}
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.06} />
          <Vignette eskil={false} offset={0.32} darkness={0.5} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
