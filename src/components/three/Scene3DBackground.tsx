"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import LaptopJourney from "./LaptopJourney";

/**
 * UN SOLO canvas WebGL, FIJO detrás de toda la página. El contenido scrollea por encima.
 * Antes había dos canvas aislados (hero y showcase) → la página se sentía 3D solo a ratos.
 * Con uno global, el laptop viaja por todas las secciones y la página entera se siente viva.
 * Además es MÁS barato: un contexto WebGL en vez de dos.
 *
 * El entorno se hornea con <Lightformer> → reflejos de estudio SIN descargar un HDRI
 * externo, así no pelea con el CSP estricto del sitio.
 */
export default function Scene3DBackground() {
  return (
    <Canvas
      dpr={[1, 1.75]}                    // acotado: en pantallas 3x un dpr libre funde la GPU móvil
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault fov={33} position={[0, 0.5, 6.3]} />

      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 3]} intensity={1.05} />

        {/* Estudio: barras de luz que se reflejan en el aluminio (colores de tu marca) */}
        <Environment resolution={256}>
          <Lightformer intensity={3} position={[0, 4, -6]} scale={[12, 2, 1]} color="#ffffff" />
          <Lightformer intensity={2.2} position={[-5, 1, 2]} scale={[1, 6, 1]} color="#6366F1" />
          <Lightformer intensity={1.8} position={[5, 1, 2]} scale={[1, 6, 1]} color="#10B981" />
          <Lightformer intensity={1.2} position={[0, -3, 3]} scale={[8, 1, 1]} color="#94a3b8" />
        </Environment>

        <LaptopJourney />

        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.42}
          scale={14}
          blur={3}
          far={5}
          color="#000000"
        />

        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={0.8} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
