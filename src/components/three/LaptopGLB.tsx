"use client";

import { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { scrollStore } from "./scroll-store";

/**
 * Laptop REAL: modelo .glb generado con Blender por script (tools/blender/build_laptop.py).
 * Coste: $0 — no se compró ningún asset. Geometría de verdad: 70 teclas, chaflanes,
 * bisel, bisagra, patas, puertos y logo.
 *
 * El .glb trae un nodo `LidPivot` (Empty) situado en la bisagra, con toda la tapa dentro.
 * Rotarlo en X abre/cierra el portátil — eso es lo que ata la tapa al scroll.
 */

const MODEL = "/models/laptop.glb";
useGLTF.preload(MODEL);

export default function LaptopGLB({ mode }: { mode: "hero" | "showcase" }) {
  const { scene } = useGLTF(MODEL);

  // Cada instancia (hero y showcase) necesita su propio clon: si no, comparten el
  // mismo Object3D y se pisan las rotaciones.
  const model = useMemo(() => scene.clone(true), [scene]);

  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Object3D | null>(null);

  useLayoutEffect(() => {
    lid.current = model.getObjectByName("LidPivot") ?? null;

    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      // Las barras de "código" y el logo deben pasar del tone mapping para que el
      // bloom las encienda de verdad (si no, quedan lavadas).
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && /^(Code|Logo)/i.test(mat.name)) {
        mat.toneMapped = false;
      }
    });

    // Arranca con la tapa CERRADA (en showcase se abre con el scroll).
    if (lid.current) lid.current.rotation.x = mode === "showcase" ? Math.PI / 2 : -0.16;
  }, [model, mode]);

  useFrame((state, dt) => {
    const g = group.current;
    const l = lid.current;
    if (!g || !l) return;

    // dt acotado: tras una pestaña en background, dt es enorme y el damp pega un salto.
    const d = Math.min(dt, 0.1);
    const t = state.clock.elapsedTime;

    if (mode === "showcase") {
      const p = scrollStore.showcase; // 0→1, escrito por ScrollTrigger (nunca por setState)

      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.35 + p * Math.PI * 2, 6, d);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -0.30 + Math.sin(p * Math.PI) * 0.30, 6, d);
      g.position.y = THREE.MathUtils.damp(g.position.y, -0.25 + Math.sin(p * Math.PI) * 0.22, 6, d);
      g.position.x = THREE.MathUtils.damp(g.position.x, 1.45, 5, d);
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 0.78, 5, d));

      // La TAPA se abre con el scroll: cerrada (π/2) → abierta (-0.16), entre el 6% y el 48%.
      const open = THREE.MathUtils.smoothstep(p, 0.06, 0.48);
      l.rotation.x = THREE.MathUtils.damp(
        l.rotation.x,
        THREE.MathUtils.lerp(Math.PI / 2, -0.16, open),
        6,
        d
      );
    } else {
      // Hero: acento de fondo, girando suave a la derecha y atrás. Tapa abierta.
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
      <primitive object={model} />
    </group>
  );
}
