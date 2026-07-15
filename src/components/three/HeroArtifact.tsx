"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// HDRI real self-host: EXR decodificado a /public/hdri/city.exr (mismo origen).
// OJO CSP: el data-URI base64 de @pmndrs/assets NO sirve — el EXRLoader hace fetch()
// y la CSP estricta bloquea `fetch(data:)`. Un archivo same-origin lo permite `'self'`.
// Es el desbloqueo #1 del look caro: el vidrio refleja un entorno real, no luces planas.
const CITY_HDRI = "/hdri/city.exr";

/**
 * PROOF-OF-CONCEPT de FIDELIDAD (dirección nueva, 2026-07-14).
 *
 * El giro tras el feedback de Cristian ("una línea NO es lo mejor"): dejar el arte-
 * matemático abstracto y usar el toolkit "caro" que ya estaba instalado —
 *   · <Environment> + <Lightformer>  → reflejos de estudio PROCEDURALES (sin HDRI
 *     externo → CSP-safe, $0). Es el 80% del look premium.
 *   · MeshTransmissionMaterial        → vidrio/cristal refractivo con aberración cromática.
 *   · <Float>                          → flotación orgánica con easing real.
 *
 * Esto es un CENTRO de vidrio tallado (gema/artefacto). No es el diseño final: es la
 * prueba de que la técnica correcta salta de "línea pobre" a "objeto que se ve caro".
 */
export default function HeroArtifact() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (!mesh.current) return;
    const d = Math.min(dt, 0.1);
    mesh.current.rotation.y += d * 0.22;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.25;
  });

  return (
    <>
      {/* Entorno PROCEDURAL: los Lightformers son las "luces de estudio" que se reflejan
          en el cristal. Sin archivo HDRI → CSP-safe. resolution baja = barato. */}
      {/* Entorno = HDRI real de ciudad (reflejos ricos en el vidrio). Encima, 2 softboxes
          blancos como catchlights de estudio que recortan las aristas del cristal. */}
      <Environment files={CITY_HDRI} resolution={256}>
        <Lightformer form="rect" intensity={2} color="#ffffff" scale={[4, 1.2, 1]} position={[-3, 2.5, 3]} />
        <Lightformer form="rect" intensity={1.5} color="#dbeafe" scale={[4, 1.2, 1]} position={[3, -1, 3]} />
      </Environment>

      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.7}>
        <mesh ref={mesh} scale={1.5}>
          {/* Icosaedro sin subdividir = 20 caras planas → se lee como gema tallada.
              (v2: reemplazar por un shard facetado de Blender — "El Núcleo".) */}
          <icosahedronGeometry args={[1, 0]} />
          {/* Parámetros con RANGO DISCIPLINADO (la sobredosis = sello de slop):
              aberración 0.04 (no 0.7), sin distortion (mata el wobble de gelatina),
              samples/resolution altos para refracción limpia, backside para grosor real. */}
          <MeshTransmissionMaterial
            samples={10}
            resolution={512}
            thickness={1.2}
            roughness={0.02}
            ior={1.5}
            chromaticAberration={0.04}
            anisotropy={0.1}
            distortion={0}
            distortionScale={0}
            temporalDistortion={0}
            transmission={1}
            backside
            color="#ffffff"
            attenuationColor="#cdd7ff"
            attenuationDistance={3.2}
          />
        </mesh>
      </Float>
    </>
  );
}
