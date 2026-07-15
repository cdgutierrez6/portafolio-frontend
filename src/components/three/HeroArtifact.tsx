"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment, Lightformer, useGLTF } from "@react-three/drei";
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

  // Shard tallado en Blender (cuarzo doble-terminado facetado). GLB self-host sin draco.
  const { nodes } = useGLTF("/models/shard.glb") as unknown as {
    nodes: Record<string, THREE.Mesh>;
  };
  const shardGeo = nodes.Shard?.geometry;

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.1);
    if (mesh.current) {
      // Giro LENTO manteniéndolo VERTICAL (cristal alto/obelisco), no tumbado como disco.
      mesh.current.rotation.y += d * 0.12;
      mesh.current.rotation.x = 0.12 + Math.sin(state.clock.elapsedTime * 0.25) * 0.06;
      mesh.current.rotation.z = 0.08;
    }
    // (El scroll-recede se eliminó: la PRESENCIA del cristal la manejará la cámara
    //  cinematográfica del paso 2, no un scale-down que lo hacía desaparecer.)
  });

  return (
    <>
      {/* Entorno = HDRI real (reflejos ricos). environmentIntensity DOMADA para que las
          ventanas cálidas del HDRI no revienten a hot-spots amarillo/rojo. Sin Lightformers
          extra (sumaban energía → quemaban el cristal). */}
      {/* Sobre NEGRO el vidrio se define por sus REFLEJOS → environmentIntensity alta
          (si es baja, el cristal desaparece). */}
      <Environment files={CITY_HDRI} resolution={256} environmentIntensity={0.85} />

      {/* Arriba-DERECHA → en el espacio negativo, sin pisar el titular colosal. */}
      <group position={[3.15, 0.75, 0]} scale={1.05}>
        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.6}>
          {/* UNA brasa interior SUAVE (additive, pequeña): un glow que el vidrio refracta
              y le da algo que "encender" sobre negro — no un balón sólido. El reveal del
              scroll la avivará. */}
          <mesh scale={0.16}>
            <sphereGeometry args={[1, 20, 20]} />
            <meshBasicMaterial
              color="#8ea6ff"
              toneMapped={false}
              transparent
              opacity={0.8}
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
