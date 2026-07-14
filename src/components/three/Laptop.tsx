"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Instances, Instance } from "@react-three/drei";
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
 * Teclado: rejilla real de teclas. Se dibuja con InstancedMesh (drei <Instances>),
 * así las ~70 teclas cuestan UNA sola draw call en vez de 70.
 */
const KEYS: [number, number, number][] = (() => {
  const out: [number, number, number][] = [];
  const cols = 14, rows = 5, kw = 0.163, kd = 0.158, gap = 0.022;
  const totalW = cols * kw + (cols - 1) * gap;
  const totalD = rows * kd + (rows - 1) * gap;
  const x0 = -totalW / 2 + kw / 2;
  const z0 = -0.16 - totalD / 2 + kd / 2 + totalD / 2; // rejilla centrada algo atrás
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push([x0 + c * (kw + gap), 0.083, z0 + r * (kd + gap) - totalD / 2]);
    }
  }
  return out;
})();

const ALU = { color: "#aab2c0", metalness: 1, roughness: 0.22 };

/**
 * Laptop modelado ÍNTEGRAMENTE POR CÓDIGO (sin .glb, sin licencia, sin pagar nada).
 * No existe un laptop CC0 libre (verificado contra la API de Sketchfab: 0 resultados),
 * así que la geometría se escribe aquí. El "premium" no lo da el conteo de polígonos:
 * lo dan el material metálico y los reflejos del entorno moviéndose con la cámara.
 */
export default function Laptop({ mode }: { mode: "hero" | "showcase" }) {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const g = group.current;
    const l = lid.current;
    if (!g || !l) return;

    // dt acotado: si la pestaña estuvo en background, dt es enorme y el damp pega un salto.
    const d = Math.min(dt, 0.1);
    const t = state.clock.elapsedTime;

    if (mode === "showcase") {
      const p = scrollStore.showcase; // 0→1, escrito por ScrollTrigger (nunca por setState)

      const targetY = -0.35 + p * Math.PI * 2;
      const targetX = -0.30 + Math.sin(p * Math.PI) * 0.30;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 6, d);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 6, d);
      g.position.y = THREE.MathUtils.damp(g.position.y, -0.25 + Math.sin(p * Math.PI) * 0.22, 6, d);
      g.position.x = THREE.MathUtils.damp(g.position.x, 1.45, 5, d);
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 0.78, 5, d));

      // La TAPA se abre con el scroll (cerrada → abierta entre el 6% y el 48%).
      const open = THREE.MathUtils.smoothstep(p, 0.06, 0.48);
      l.rotation.x = THREE.MathUtils.damp(
        l.rotation.x,
        THREE.MathUtils.lerp(Math.PI / 2, -0.16, open),
        6,
        d
      );
    } else {
      // Hero: acento de fondo. Pequeño, a la derecha y atrás, para NO tapar el texto.
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
      {/* ══ Chasis inferior (aluminio) ══ */}
      <RoundedBox args={[3, 0.13, 2.1]} radius={0.055} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial {...ALU} />
      </RoundedBox>

      {/* Rebaje oscuro del teclado (la "bandeja") */}
      <mesh position={[0, 0.071, -0.16]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.68, 0.98]} />
        <meshStandardMaterial color="#12141a" metalness={0.4} roughness={0.85} />
      </mesh>

      {/* Teclas individuales — 70 teclas en UNA draw call (InstancedMesh) */}
      <Instances limit={KEYS.length} castShadow>
        <boxGeometry args={[0.152, 0.014, 0.148]} />
        <meshStandardMaterial color="#2b3038" metalness={0.35} roughness={0.62} />
        {KEYS.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>

      {/* Trackpad con borde */}
      <mesh position={[0, 0.0715, 0.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.02, 0.64]} />
        <meshStandardMaterial color="#8e96a4" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.0722, 0.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.98, 0.6]} />
        <meshStandardMaterial color="#9aa3b1" metalness={0.95} roughness={0.25} />
      </mesh>

      {/* Bisagra (cilindro entre chasis y tapa) */}
      <mesh position={[0, 0.065, -1.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 2.82, 20]} />
        <meshStandardMaterial color="#6b7280" metalness={1} roughness={0.35} />
      </mesh>

      {/* Patas de goma */}
      {([[-1.25, -0.9], [1.25, -0.9], [-1.25, 0.9], [1.25, 0.9]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, -0.072, z]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
          <meshStandardMaterial color="#0e1014" roughness={0.95} metalness={0} />
        </mesh>
      ))}

      {/* Puertos laterales (pequeños rebajes oscuros) */}
      {([-0.5, 0, 0.5] as const).map((z, i) => (
        <mesh key={i} position={[-1.503, 0.005, z]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.16, 0.045]} />
          <meshStandardMaterial color="#0b0d11" roughness={0.9} />
        </mesh>
      ))}

      {/* ══ Tapa (pivota en la bisagra) ══ */}
      <group ref={lid} position={[0, 0.065, -1.02]}>
        {/* Carcasa de la tapa */}
        <RoundedBox args={[3, 1.92, 0.075]} radius={0.05} smoothness={4} position={[0, 0.96, 0]} castShadow>
          <meshStandardMaterial {...ALU} />
        </RoundedBox>

        {/* Bisel negro alrededor de la pantalla (le da profundidad de "producto") */}
        <mesh position={[0, 0.96, 0.039]}>
          <planeGeometry args={[2.9, 1.84]} />
          <meshStandardMaterial color="#08090c" metalness={0.2} roughness={0.55} />
        </mesh>

        {/* Pantalla (editor oscuro con glow suave) */}
        <mesh position={[0, 0.96, 0.041]}>
          <planeGeometry args={[2.74, 1.68]} />
          <meshStandardMaterial color="#0b1220" emissive="#1e2a4a" emissiveIntensity={0.55} metalness={0} roughness={0.4} />
        </mesh>

        {/* Cámara del bisel */}
        <mesh position={[0, 1.86, 0.042]}>
          <circleGeometry args={[0.022, 12]} />
          <meshStandardMaterial color="#1a1d24" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* "Código": barras emisivas. Es lo que hace que se lea como pantalla de dev. */}
        {CODE_LINES.map((ln, i) => (
          <mesh key={i} position={[-1.13 + ln.w / 2 + ln.indent, 1.60 - i * 0.132, 0.043]}>
            <planeGeometry args={[ln.w, 0.036]} />
            <meshStandardMaterial color={ln.c} emissive={ln.c} emissiveIntensity={1.7} toneMapped={false} />
          </mesh>
        ))}

        {/* Logo emisivo en la carcasa trasera — hace que el reverso NO quede muerto
            cuando el laptop gira y muestra la espalda. */}
        <mesh position={[0, 0.96, -0.041]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.19, 32]} />
          <meshStandardMaterial color="#6366F1" emissive="#6366F1" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
