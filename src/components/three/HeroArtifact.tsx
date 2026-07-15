"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { scrollStore } from "./scroll-store";

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
  const holder = useRef<THREE.Group>(null);

  // Shard tallado en Blender (cuarzo doble-terminado facetado). GLB self-host sin draco.
  const { nodes } = useGLTF("/models/shard.glb") as unknown as {
    nodes: Record<string, THREE.Mesh>;
  };
  const shardGeo = nodes.Shard?.geometry;

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.1);
    if (mesh.current) {
      mesh.current.rotation.y += d * 0.22;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.25;
    }
    // COMPOSICIÓN: el cristal es el protagonista del HERO y se RECOGE al scrollear
    // (deja de flotar sobre todas las secciones y da paso al grafo). page 0→~0.18.
    if (holder.current) {
      const hero = THREE.MathUtils.clamp(1 - scrollStore.page / 0.18, 0, 1);
      const s = THREE.MathUtils.damp(holder.current.scale.x, 0.001 + hero, 6, d);
      holder.current.scale.setScalar(s);
    }
  });

  return (
    <>
      {/* Entorno = HDRI real (reflejos ricos). environmentIntensity DOMADA para que las
          ventanas cálidas del HDRI no revienten a hot-spots amarillo/rojo. Sin Lightformers
          extra (sumaban energía → quemaban el cristal). */}
      <Environment files={CITY_HDRI} resolution={256} environmentIntensity={0.5} />

      {/* Desplazado a la DERECHA → vive en el espacio negativo junto al titular, no encima. */}
      <group ref={holder} position={[2.7, 0.15, 0]}>
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.7}>
          {/* Shard facetado de Blender (cuarzo doble-terminado). scale 0.72 → más presencia. */}
          <mesh ref={mesh} geometry={shardGeo} scale={0.72}>
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
            color="#eef2ff"
            attenuationColor="#9db2ff"
            attenuationDistance={1.4}
          />
          </mesh>
        </Float>
      </group>
    </>
  );
}
