"use client";

import { useRef, useMemo } from "react";
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
/**
 * NÚCLEO NEURONAL dentro del cristal: nube de puntos emissive en clusters (nodos de una
 * micro-red). Vive DENTRO del shard → el vidrio lo REFRACTA y el Bloom lo enciende.
 * La tesis "El Núcleo": el sistema que Cristian diseña, suspendido en el cristal.
 */
function CrystalCore() {
  const pts = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const N = 300;
    const pos = new Float32Array(N * 3);
    // Centros de cluster (nodos de la micro-red) dentro del volumen del cristal.
    const centers = [
      [0, 0.28, 0], [0.3, -0.08, 0.12], [-0.32, -0.04, -0.12],
      [0.06, -0.32, 0.22], [-0.12, 0.34, -0.22], [0.2, 0.1, -0.28], [-0.24, -0.28, 0.18],
    ];
    const g = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.11;
    for (let i = 0; i < N; i++) {
      const c = centers[i % centers.length];
      pos[i * 3] = c[0] + g();
      pos[i * 3 + 1] = c[1] + g();
      pos[i * 3 + 2] = c[2] + g();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((_s, dt) => {
    if (pts.current) pts.current.rotation.y += Math.min(dt, 0.1) * 0.3;
  });

  return (
    <points ref={pts} geometry={geometry}>
      {/* Brillo DOMADO: 300 puntos additive magnificados por el vidrio revientan a
          amarillo (warm-clip ACES). Opacidad baja + color contenido = glow sutil dentro. */}
      <pointsMaterial
        size={0.024}
        color="#5cc6e8"
        transparent
        opacity={0.28}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

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
      // Giro LENTO manteniéndolo VERTICAL (cristal alto/obelisco), no tumbado como disco.
      mesh.current.rotation.y += d * 0.12;
      mesh.current.rotation.x = 0.12 + Math.sin(state.clock.elapsedTime * 0.25) * 0.06;
      mesh.current.rotation.z = 0.08;
    }
    // COMPOSICIÓN: el cristal es el protagonista del HERO y se RECOGE al scrollear
    // (deja de flotar sobre todas las secciones y da paso al grafo). page 0→~0.18.
    if (holder.current) {
      const hero = THREE.MathUtils.clamp(1 - scrollStore.page / 0.18, 0, 1);
      const s = THREE.MathUtils.damp(holder.current.scale.x, 0.001 + hero * 1.3, 6, d);
      holder.current.scale.setScalar(s);
    }
  });

  return (
    <>
      {/* Entorno = HDRI real (reflejos ricos). environmentIntensity DOMADA para que las
          ventanas cálidas del HDRI no revienten a hot-spots amarillo/rojo. Sin Lightformers
          extra (sumaban energía → quemaban el cristal). */}
      <Environment files={CITY_HDRI} resolution={256} environmentIntensity={0.32} />

      {/* Desplazado a la DERECHA → vive en el espacio negativo junto al titular, no encima. */}
      <group ref={holder} position={[2.7, 0.15, 0]}>
        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.6}>
          {/* El núcleo neuronal suspendido DENTRO del cristal (el vidrio lo refracta). */}
          <CrystalCore />
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
