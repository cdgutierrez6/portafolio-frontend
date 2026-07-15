"use client";

import { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { pointerStore } from "./ParticleField";
import HeroArtifact from "./HeroArtifact";

/**
 * Micro-parallax al cursor: capa ADITIVA sutil sobre la cámara — NO el movimiento
 * principal (ese será la cámara scroll-driven del paso 2). Amplitud pequeña.
 * Quieta bajo reduced-motion.
 */
function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state, dt) => {
    if (reduced) return;
    const d = Math.min(dt, 0.1);
    const tx = pointerStore.nx * 0.22;
    const ty = pointerStore.ny * 0.16;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, tx, 2.2, d);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, ty, 2.2, d);
    state.camera.lookAt(2.4, 0.1, 0);
  });
  return null;
}

/**
 * UN canvas WebGL fijo detrás de la página.
 *
 * RESTA (2026-07-14, tras estudiar Lusion / dgreenheck / Codrops Cinematic3DScroll):
 * el look premiado = UN héroe limpio sobre negro con AIRE, no efecto sobre efecto.
 * Se mató el campo de partículas, el trazo, las caústicas, el piso espejo y el núcleo
 * de 300 puntos (era "sopa"). Queda el CRISTAL como protagonista único, con niebla,
 * UNA luz de acento fría y sombra de contacto para plantarlo (patrón dgreenheck).
 * (Siguiente paso: cámara cinematográfica atada al scroll — 4 beats.)
 */
export default function Scene3DBackground() {
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
        // ACES: comprime los brillos como una cámara real (sin él, se clipean a blanco).
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.95,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />

      {/* Niebla = el AIRE/profundidad (regla Igloo: el negro + niebla dan el ambiente,
          no elementos apilados). */}
      <fog attach="fog" args={["#07080d", 5, 16]} />

      {/* UNA sola luz de acento fría (el "director's cue" de Codrops), no diez efectos.
          Rim que recorta el cristal contra el negro. */}
      <pointLight position={[-3.5, 2.5, 2]} intensity={90} color="#6E8BFF" />

      <CameraRig reduced={reduced} />

      <Suspense fallback={null}>
        <HeroArtifact />

        {/* Sombra de contacto → "planta" el cristal sin el piso-espejo caro. */}
        <ContactShadows
          position={[2.7, -1.25, 0]}
          scale={7}
          blur={2.6}
          opacity={0.4}
          far={4.5}
          color="#000000"
        />

        {/* Capa fotográfica (grade cine): DoF enfoca el cristal, Bloom sólo para lo más
            brillante, grano sutil, viñeta. (El grano pasará a gated-por-velocidad y el
            DoF a dinámico cuando entre la cámara scroll-driven.) */}
        <EffectComposer enableNormalPass={false}>
          <DepthOfField target={[2.7, 0.15, 0]} focalLength={0.03} bokehScale={2.5} height={480} />
          <Bloom intensity={0.7} luminanceThreshold={0.9} luminanceSmoothing={0.2} mipmapBlur />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.05} />
          <Vignette eskil={false} offset={0.3} darkness={0.55} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
