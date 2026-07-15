"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { stage } from "./scene-stage";

// Entorno PROCEDURAL de estudio (Lightformers blanco-frío) en vez de HDRI: los HDRIs
// tienen fuentes de luz cálidas (sol/lámparas) que el cristal refleja como HOTSPOTS que
// ACES vuelve amarillo/rojo. Softboxes fríos controlados → reflejos limpios y fríos,
// cero hotspot cálido. CSP-safe, $0, sin fetch. (Patrón Awwwards para vidrio sobre negro.)

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
      // Giro LENTO; se acelera durante el intercambio orbital (Beat 2) → "rotating swap".
      mesh.current.rotation.y += d * (0.12 + stage.swap * 0.9);
      mesh.current.rotation.x = 0.12 + Math.sin(state.clock.elapsedTime * 0.25) * 0.06;
      mesh.current.rotation.z = 0.08;
    }
    // Posición del ESCENARIO compartido (órbita cristal↔cara en Beat 2).
    if (holder.current) holder.current.position.copy(stage.crystal);
  });

  return (
    <>
      {/* Entorno = HDRI real (reflejos ricos). environmentIntensity DOMADA para que las
          ventanas cálidas del HDRI no revienten a hot-spots amarillo/rojo. Sin Lightformers
          extra (sumaban energía → quemaban el cristal). */}
      {/* Softboxes fríos: definen el vidrio sobre negro con reflejos limpios (sin hotspot
          cálido). 2 rect grandes (key + fill) + 1 arriba = luz de estudio de producto. */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={1.1} color="#e8ecff" scale={[6, 2.4, 1]} position={[-5, 3, 2]} />
        <Lightformer form="rect" intensity={0.85} color="#ffffff" scale={[6, 2.4, 1]} position={[5, -1.5, 2]} />
        <Lightformer form="rect" intensity={0.6} color="#c7d2fe" scale={[3, 3, 1]} position={[0, 4, -3]} />
      </Environment>

      {/* Arriba-DERECHA → en el espacio negativo, sin pisar el titular colosal. */}
      <group ref={holder} scale={1.05}>
        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.6}>
          {/* UNA brasa interior SUAVE (additive, pequeña): un glow que el vidrio refracta
              y le da algo que "encender" sobre negro — no un balón sólido. El reveal del
              scroll la avivará. */}
          <mesh scale={0.14}>
            <sphereGeometry args={[1, 20, 20]} />
            <meshBasicMaterial
              color="#8ea6ff"
              toneMapped={false}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
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
            chromaticAberration={0}
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
