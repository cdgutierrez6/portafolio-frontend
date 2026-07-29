"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { stage } from "./scene-stage";

// ── RUEDA/EMBLEMA (el stack de Cristian en las 8 esquinas del octágono) ───────────────
// El octágono se ve DE FRENTE y gira sobre el eje Z (hacia la cámara) como un dial. En cada
// esquina flota un nombre del stack; los nombres ORBITAN con la gema pero se mantienen
// DERECHOS (contra-rotados) → siempre legibles, sin texto al revés. Mono, un solo tint
// (== color del vidrio), outline color-niebla, sin logos ni colores de marca. Off en el
// hero puro (no pisa el titular colosal), arranca al hacer scroll, se retira al revelar la cara.
const STACK_LABELS = [".NET", "ANGULAR", "C#", "REACT", "JAVA", "NODE.JS", "KAFKA", "DOCKER"];
const RING_R = 0.74;   // holder-local: los nombres orbitan JUSTO en las esquinas del octágono
const FRONT_Z = 0.42;  // holder-local: los labels flotan al FRENTE de la gema (hacia la cámara)

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };

type CanvasCtxLS = CanvasRenderingContext2D & { letterSpacing?: string };

/** Texto → textura de canvas (mono, tinte acento, outline color-niebla). $0, sin fuente
 *  externa ni worker CSP (evita el fetch de troika a gstatic). Se genera UNA vez por label. */
function makeLabelTexture(text: string): { tex: THREE.CanvasTexture; aspect: number } {
  // Supersample x2 (128px, no 64) → el texto se ve NÍTIDO al escalar sobre el cristal;
  // a 64px se veía borroso/tenue. Pesos/paddings escalados a la par. Peso 700 = más legible.
  const fontPx = 128, padX = 60, padY = 40, track = 9;
  const font = `700 ${fontPx}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
  const m = (document.createElement("canvas").getContext("2d") as CanvasCtxLS);
  m.font = font; m.letterSpacing = `${track}px`;
  const textW = Math.ceil(m.measureText(text).width);
  const w = textW + padX * 2, h = fontPx + padY * 2;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const c = canvas.getContext("2d") as CanvasCtxLS;
  c.font = font; c.letterSpacing = `${track}px`;
  c.textAlign = "center"; c.textBaseline = "middle"; c.lineJoin = "round";
  c.lineWidth = 14; c.strokeStyle = "#05060a"; c.strokeText(text, w / 2, h / 2); // outline niebla (más contraste)
  c.fillStyle = "#dbe4ff"; c.fillText(text, w / 2, h / 2);                        // glifo (tinte vidrio, más brillante; bajo el umbral de bloom 0.9)
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  // Nitidez: filtro lineal sin mipmaps (canvas NPOT) + anisotropía alta → texto crujiente
  // también en ángulo. three recorta la anisotropía al máximo real del dispositivo.
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.anisotropy = 16;
  return { tex, aspect: w / h };
}

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
export default function HeroArtifact({
  lowPerf = false,
  isMobile = false,
}: {
  lowPerf?: boolean;
  isMobile?: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const holder = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const labelMeshes = useRef<THREE.Mesh[]>([]);

  // Shard tallado en Blender (OCTÁGONO doble-terminado facetado). GLB self-host sin draco.
  const { nodes } = useGLTF("/models/shard.glb") as unknown as {
    nodes: Record<string, THREE.Mesh>;
  };
  const shardGeo = nodes.Shard?.geometry;

  // Texturas de los 8 labels (una vez). Cada uno en una ESQUINA (vértice) del octágono.
  const labels = useMemo(
    () =>
      STACK_LABELS.map((text, i) => {
        const ang = (i / STACK_LABELS.length) * Math.PI * 2; // 0,45,90… → las 8 esquinas
        return { text, ang, ...makeLabelTexture(text) };
      }),
    []
  );

  // Gate de encuadre: en móvil los nombres van un pelín más grandes (viewport angosto).
  const LABEL_H = isMobile ? 0.135 : 0.11;
  const PEAK = isMobile ? 0.9 : 0.98;   // más sólidas/legibles (antes 0.72/0.82, se veían tenues)

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.1);
    if (mesh.current) {
      // RUEDA: la gema gira sobre Z (eje hacia la cámara) → el octágono rota DE FRENTE
      // como un dial; un toque más rápido durante el intercambio.
      mesh.current.rotation.z += d * (0.16 + stage.swap * 0.2);
      mesh.current.rotation.x = 0;
      mesh.current.rotation.y = 0;
    }
    // Posición del ESCENARIO compartido (órbita cristal↔cara en Beat 2).
    if (holder.current) holder.current.position.copy(stage.crystal);

    // RUEDA DE NOMBRES: las esquinas (y sus nombres) ORBITAN con la gema, pero cada nombre
    // se contra-rota para quedar DERECHO (legible, sin texto al revés). Beat por scroll:
    // OFF en el hero (hp<0.20, no pisa el titular) → arranca al scrollear → se retira a ×0.25
    // cuando el swap revela la cara ("y este soy yo").
    if (ring.current && mesh.current) {
      const spin = mesh.current.rotation.z;
      ring.current.rotation.z = spin; // los nombres orbitan CON la gema
      const hp = stage.hp;
      const gain = smooth((hp - 0.2) / 0.22) * (1 - 0.75 * smooth((hp - 0.8) / 0.18));
      const meshes = labelMeshes.current;
      for (let i = 0; i < meshes.length; i++) {
        const lm = meshes[i];
        if (!lm) continue;
        lm.rotation.z = -spin; // contrarresta la órbita → el nombre queda derecho
        (lm.material as THREE.MeshBasicMaterial).opacity = gain * PEAK;
      }
    }
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

      {/* Arriba-DERECHA → en el espacio negativo, sin pisar el titular colosal.
          En MÓVIL se encoge (~0.58) para que en el cruce de la órbita NO tape la cara
          ni luzca gigante en el viewport angosto; en desktop queda con presencia (1.05). */}
      <group ref={holder} scale={isMobile ? 0.58 : 1.05}>
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
            samples={lowPerf ? 4 : 10}
            resolution={lowPerf ? 256 : 512}
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

          {/* RUEDA DE NOMBRES — hija de <Float> (respira/orbita con la gema) pero NO del mesh.
              Cada nombre en una esquina (X-Y, de frente), al FRENTE de la gema (FRONT_Z),
              orbitando con el spin de la gema pero contra-rotado en useFrame para quedar
              DERECHO. depthTest off → siempre por encima. En lowPerf NO se monta. */}
          {!lowPerf && (
            <group ref={ring}>
              {labels.map((l, i) => (
                <mesh
                  key={l.text}
                  ref={(el) => { if (el) labelMeshes.current[i] = el; }}
                  position={[Math.cos(l.ang) * RING_R, Math.sin(l.ang) * RING_R, FRONT_Z]}
                  renderOrder={10}
                >
                  <planeGeometry args={[LABEL_H * l.aspect, LABEL_H]} />
                  <meshBasicMaterial
                    map={l.tex}
                    transparent
                    opacity={0}
                    toneMapped={false}
                    depthWrite={false}
                    depthTest={false}
                  />
                </mesh>
              ))}
            </group>
          )}
        </Float>
      </group>
    </>
  );
}
