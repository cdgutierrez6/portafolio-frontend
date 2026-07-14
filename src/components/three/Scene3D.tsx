"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Laptop from "./Laptop";

/**
 * Escena 3D real (WebGL). El "wow" viene de los reflejos del entorno moviéndose sobre
 * el metal mientras el objeto gira — eso no lo puede fingir un transform CSS.
 *
 * El entorno se construye con <Lightformer> (se hornea un envmap en runtime):
 * reflexiones de estudio SIN descargar un HDRI externo → no pelea con el CSP del sitio.
 */
export default function Scene3D({ mode }: { mode: "hero" | "showcase" }) {
  const isHero = mode === "hero";

  return (
    <Canvas
      // dpr acotado: en pantallas 3x un dpr libre funde la GPU móvil.
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault fov={isHero ? 34 : 33} position={[0, 0.5, isHero ? 5.6 : 6.3]} />

      <Suspense fallback={null}>
        {/* Luces base (el envmap hace el trabajo pesado, esto solo modela el volumen) */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 3]} intensity={1.1} castShadow={false} />

        {/* Entorno de estudio: barras de luz que se reflejan en el aluminio.
            Los colores son los de tu marca (indigo / esmeralda). */}
        <Environment resolution={256}>
          <Lightformer intensity={3} position={[0, 4, -6]} scale={[12, 2, 1]} color="#ffffff" />
          <Lightformer intensity={2.2} position={[-5, 1, 2]} scale={[1, 6, 1]} color="#6366F1" />
          <Lightformer intensity={1.8} position={[5, 1, 2]} scale={[1, 6, 1]} color="#10B981" />
          <Lightformer intensity={1.2} position={[0, -3, 3]} scale={[8, 1, 1]} color="#94a3b8" />
        </Environment>

        <Laptop mode={mode} />

        {/* Sombra de contacto: lo ancla al suelo (sin esto "flota" y se ve barato) */}
        <ContactShadows
          position={[0, -1.05, 0]}
          opacity={0.55}
          scale={12}
          blur={2.6}
          far={4}
          color="#000000"
        />

        {/* Bloom: hace que la pantalla y la franja emisiva realmente brillen */}
        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={0.75} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
