"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { scrollStore } from "./scroll-store";

/** Líneas de "código" en la pantalla: ancho, sangría y color (paleta del portafolio). */
const CODE_LINES: { w: number; indent: number; c: string }[] = [
  { w: 0.85, indent: 0.0, c: "#6366F1" },
  { w: 1.55, indent: 0.18, c: "#94a3b8" },
  { w: 1.15, indent: 0.18, c: "#10B981" },
  { w: 1.85, indent: 0.36, c: "#94a3b8" },
  { w: 0.95, indent: 0.36, c: "#F59E0B" },
  { w: 1.45, indent: 0.18, c: "#94a3b8" },
  { w: 0.55, indent: 0.0, c: "#6366F1" },
  { w: 1.7, indent: 0.18, c: "#94a3b8" },
  { w: 1.05, indent: 0.36, c: "#10B981" },
  { w: 0.7, indent: 0.0, c: "#6366F1" },
];

/**
 * Laptop modelado por código (sin .glb): no existe un laptop CC0 libre de licencia,
 * así que lo construimos con primitivas. El "premium" no lo da el conteo de polígonos,
 * lo dan el material metálico + las reflexiones del entorno moviéndose con la cámara.
 * Si más adelante conseguimos un .glb real, se sustituye SOLO este componente.
 */
export default function Laptop({ mode }: { mode: "hero" | "showcase" }) {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const g = group.current;
    const l = lid.current;
    if (!g || !l) return;

    // dt se limita: si la pestaña estuvo en background, dt es enorme y el damp pega un salto.
    const d = Math.min(dt, 0.1);
    const t = state.clock.elapsedTime;

    if (mode === "showcase") {
      const p = scrollStore.showcase; // 0→1, escrito por ScrollTrigger (nunca por setState)

      // Vuelta completa (2π: acaba mirando al frente otra vez) + cabeceo.
      const targetY = -0.35 + p * Math.PI * 2;
      const targetX = -0.30 + Math.sin(p * Math.PI) * 0.30;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 6, d);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 6, d);
      g.position.y = THREE.MathUtils.damp(g.position.y, -0.25 + Math.sin(p * Math.PI) * 0.22, 6, d);
      // Se aparta a la derecha para no tapar el copy por etapas.
      g.position.x = THREE.MathUtils.damp(g.position.x, 1.45, 5, d);
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 0.78, 5, d));

      // La TAPA se abre con el scroll (cerrada → abierta entre el 6% y el 48%).
      const open = THREE.MathUtils.smoothstep(p, 0.06, 0.48);
      const lidAngle = THREE.MathUtils.lerp(Math.PI / 2, -0.16, open);
      l.rotation.x = THREE.MathUtils.damp(l.rotation.x, lidAngle, 6, d);
    } else {
      // Hero: acento de fondo. Pequeño, a la derecha y ATRÁS, para NO tapar el texto.
      g.rotation.y += d * 0.28;
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -0.26, 4, d);
      g.position.x = 2.15;
      g.position.z = -1.4;
      g.position.y = -0.15 + Math.sin(t * 0.8) * 0.07;
      g.scale.setScalar(0.6);
      l.rotation.x = THREE.MathUtils.damp(l.rotation.x, -0.16, 4, d);
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* ── Chasis inferior ── */}
      <RoundedBox args={[3, 0.13, 2.1]} radius={0.055} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#aab2c0" metalness={1} roughness={0.22} />
      </RoundedBox>

      {/* Teclado (rebajado en el chasis) */}
      <mesh position={[0, 0.072, 0.12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.62, 1.32]} />
        <meshStandardMaterial color="#14161b" metalness={0.5} roughness={0.75} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.074, 0.92]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.98, 0.6]} />
        <meshStandardMaterial color="#22262e" metalness={0.85} roughness={0.35} />
      </mesh>

      {/* ── Tapa (pivota en la bisagra, borde trasero del chasis) ── */}
      <group ref={lid} position={[0, 0.065, -1.02]}>
        {/* Carcasa de la tapa */}
        <RoundedBox
          args={[3, 1.92, 0.075]}
          radius={0.05}
          smoothness={4}
          position={[0, 0.96, 0]}
          castShadow
        >
          <meshStandardMaterial color="#aab2c0" metalness={1} roughness={0.22} />
        </RoundedBox>

        {/* Pantalla: oscura de verdad (como un editor), con un glow suave.
            Antes era un rectángulo morado plano y chillón. */}
        <mesh position={[0, 0.96, 0.041]}>
          <planeGeometry args={[2.78, 1.72]} />
          <meshStandardMaterial
            color="#0b1220"
            emissive="#1e2a4a"
            emissiveIntensity={0.55}
            metalness={0}
            roughness={0.4}
          />
        </mesh>

        {/* "Código": barras emisivas de ancho variable. Es lo que hace que se lea como
            una pantalla de dev y no como un bloque de color. El bloom las enciende. */}
        {CODE_LINES.map((ln, i) => (
          <mesh key={i} position={[-1.15 + ln.w / 2 + ln.indent, 1.62 - i * 0.135, 0.043]}>
            <planeGeometry args={[ln.w, 0.038]} />
            <meshStandardMaterial
              color={ln.c}
              emissive={ln.c}
              emissiveIntensity={1.7}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
