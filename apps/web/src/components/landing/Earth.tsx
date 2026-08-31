"use client";

import { Html, Line, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  NormalBlending,
  Vector3,
  type Camera,
} from "three";
import { GLOBE_ROLES } from "./globe-roles";
import { createLandPositions, createStarPositions, loadLandMask } from "./land-points";

type OrbitDef = {
  normal: [number, number, number];
  radius: number;
};

const ORBIT_DEFS: OrbitDef[] = [
  { normal: [0.1, 1, 0.16], radius: 1.18 },
  { normal: [0.96, 0.18, 0.22], radius: 1.24 },
  { normal: [0.14, 0.28, 0.95], radius: 1.15 },
  { normal: [0.56, 0.74, 0.36], radius: 1.28 },
  { normal: [-0.7, 0.46, 0.54], radius: 1.21 },
];

const NODE_MOTION = [
  { orbit: 0, phase: 0.2, speed: 0.16 },
  { orbit: 0, phase: 3.35, speed: 0.16 },
  { orbit: 1, phase: 0.9, speed: 0.13 },
  { orbit: 1, phase: 4.05, speed: 0.13 },
  { orbit: 2, phase: 1.5, speed: 0.2 },
  { orbit: 2, phase: 4.7, speed: 0.2 },
  { orbit: 3, phase: 0.45, speed: 0.11 },
  { orbit: 3, phase: 3.6, speed: 0.11 },
  { orbit: 4, phase: 2.15, speed: 0.15 },
  { orbit: 4, phase: 5.3, speed: 0.15 },
] as const;

const NODES = GLOBE_ROLES.map((title, index) => ({
  title,
  ...NODE_MOTION[index],
}));

const GLOW_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const GLOW_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 2.55);
    gl_FragColor = vec4(uColor, fresnel * uStrength);
  }
`;

function orbitBasis(normal: [number, number, number]) {
  const n = new Vector3(...normal).normalize();
  const tangent = new Vector3();
  if (Math.abs(n.y) < 0.92) tangent.set(0, 1, 0);
  else tangent.set(1, 0, 0);
  tangent.cross(n).normalize();
  const bitangent = new Vector3().copy(n).cross(tangent).normalize();
  return { tangent, bitangent };
}

function writeOrbitPoint(
  out: Vector3,
  tangent: Vector3,
  bitangent: Vector3,
  radius: number,
  angle: number,
) {
  out.copy(tangent).multiplyScalar(Math.cos(angle) * radius);
  out.addScaledVector(bitangent, Math.sin(angle) * radius);
  return out;
}

function palette(dark: boolean) {
  return {
    land: dark ? "#f97316" : "#1c1915",
    landSoft: dark ? "#fdba74" : "#ea580c",
    ocean: dark ? "#08080c" : "#f3ebdd",
    arc: dark ? "#fdba74" : "#c2410c",
    node: dark ? "#fff7ed" : "#9a3412",
    glow: dark ? "#f97316" : "#c2410c",
    bg: dark ? "#09090b" : "#f4efe6",
    star: "#fafafa",
  };
}

function Stars() {
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(createStarPositions(640), 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#fafafa" size={0.02} transparent opacity={0.16} depthWrite={false} />
    </points>
  );
}

function Continents({
  color,
  soft,
  additive,
}: {
  color: string;
  soft: string;
  additive: boolean;
}) {
  const [core, setCore] = useState<BufferGeometry | null>(null);
  const [halo, setHalo] = useState<BufferGeometry | null>(null);

  useEffect(() => {
    let cancelled = false;
    const geometries: BufferGeometry[] = [];

    loadLandMask().then(() => {
      const land = new BufferGeometry();
      land.setAttribute("position", new BufferAttribute(createLandPositions(1.005, 0.7, 11), 3));
      const glow = new BufferGeometry();
      glow.setAttribute("position", new BufferAttribute(createLandPositions(1.018, 1.15, 29), 3));
      if (cancelled) {
        land.dispose();
        glow.dispose();
        return;
      }
      geometries.push(land, glow);
      setCore(land);
      setHalo(glow);
    });

    return () => {
      cancelled = true;
      for (const geometry of geometries) geometry.dispose();
    };
  }, []);

  if (!core) return null;

  return (
    <group>
      <points key={additive ? "land-glow" : "land-ink"} geometry={core}>
        <pointsMaterial
          color={color}
          size={0.015}
          sizeAttenuation
          transparent
          opacity={additive ? 0.95 : 0.88}
          depthWrite={false}
          blending={additive ? AdditiveBlending : NormalBlending}
        />
      </points>
      {additive && halo ? (
        <points geometry={halo}>
          <pointsMaterial
            color={soft}
            size={0.028}
            sizeAttenuation
            transparent
            opacity={0.28}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
      ) : null}
    </group>
  );
}

function Atmosphere({ color, strength }: { color: string; strength: number }) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(color) },
      uStrength: { value: strength },
    }),
    [color, strength],
  );

  return (
    <group>
      <mesh scale={1.12}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={GLOW_VERT}
          fragmentShader={GLOW_FRAG}
          transparent
          depthWrite={false}
          side={BackSide}
          blending={AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.06, 48, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={strength * 0.12}
          side={BackSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function OrbitArcs({
  orbits,
  color,
  opacity,
}: {
  orbits: { points: [number, number, number][] }[];
  color: string;
  opacity: number;
}) {
  return (
    <>
      {orbits.map((orbit, index) => (
        <Line
          key={index}
          points={orbit.points}
          color={color}
          lineWidth={1.15}
          transparent
          opacity={opacity}
          depthWrite={false}
          toneMapped={false}
        />
      ))}
    </>
  );
}

function OrbitNode({
  title,
  tangent,
  bitangent,
  radius,
  phase,
  speed,
  reduceMotion,
  nodeColor,
  glowColor,
}: {
  title: string;
  tangent: Vector3;
  bitangent: Vector3;
  radius: number;
  phase: number;
  speed: number;
  reduceMotion: boolean;
  nodeColor: string;
  glowColor: string;
}) {
  const group = useRef<Group>(null);
  const label = useRef<HTMLDivElement>(null);
  const local = useMemo(() => new Vector3(), []);
  const world = useMemo(() => new Vector3(), []);
  const center = useMemo(() => new Vector3(), []);
  const start = useMemo(() => {
    const point = new Vector3();
    writeOrbitPoint(point, tangent, bitangent, radius, phase);
    return point;
  }, [tangent, bitangent, radius, phase]);

  function place(time: number, camera?: Camera) {
    if (!group.current) return;
    const angle = reduceMotion ? phase : phase + time * speed;
    writeOrbitPoint(local, tangent, bitangent, radius, angle);
    group.current.position.copy(local);

    if (!label.current || !camera || !group.current.parent) return;
    world.copy(group.current.position).normalize();
    center.copy(camera.position);
    group.current.parent.worldToLocal(center).normalize();
    const facing = world.dot(center);
    const opacity = Math.max(0, Math.min(1, (facing - 0.28) * 3.2));
    label.current.style.opacity = String(opacity);
    label.current.style.visibility = opacity < 0.08 ? "hidden" : "visible";
  }

  useFrame(({ clock, camera }) => {
    place(clock.elapsedTime, camera);
  });

  return (
    <group ref={group} position={start}>
      <mesh>
        <sphereGeometry args={[0.024, 16, 16]} />
        <meshBasicMaterial color={nodeColor} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <Html
        center
        sprite
        zIndexRange={[20, 0]}
        wrapperClass="pointer-events-none !overflow-visible"
        style={{ pointerEvents: "none" }}
      >
        <div
          ref={label}
          className="-translate-y-5 border border-line bg-surface px-2 py-0.5 text-[10px] tracking-wide whitespace-nowrap text-ink"
        >
          {title}
        </div>
      </Html>
    </group>
  );
}

function Globe({ reduceMotion, dark }: { reduceMotion: boolean; dark: boolean }) {
  const group = useRef<Group>(null);
  const colors = palette(dark);

  const orbits = useMemo(
    () =>
      ORBIT_DEFS.map((def) => {
        const basis = orbitBasis(def.normal);
        const points: [number, number, number][] = [];
        const scratch = new Vector3();
        const segments = 128;
        for (let i = 0; i <= segments; i += 1) {
          writeOrbitPoint(scratch, basis.tangent, basis.bitangent, def.radius, (i / segments) * Math.PI * 2);
          points.push([scratch.x, scratch.y, scratch.z]);
        }
        return { ...basis, radius: def.radius, points };
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current || reduceMotion) return;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.045;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color={colors.ocean}
          transparent={dark}
          opacity={dark ? 0.55 : 1}
        />
      </mesh>
      <Continents color={colors.land} soft={colors.landSoft} additive={dark} />
      <Atmosphere color={colors.glow} strength={dark ? 0.86 : 0.22} />
      <OrbitArcs orbits={orbits} color={colors.arc} opacity={dark ? 0.55 : 0.38} />
      {NODES.map((node) => {
        const orbit = orbits[node.orbit];
        return (
          <OrbitNode
            key={node.title}
            title={node.title}
            tangent={orbit.tangent}
            bitangent={orbit.bitangent}
            radius={orbit.radius}
            phase={node.phase}
            speed={node.speed}
            reduceMotion={reduceMotion}
            nodeColor={colors.node}
            glowColor={colors.glow}
          />
        );
      })}
    </group>
  );
}

function Scene({ reduceMotion, dark }: { reduceMotion: boolean; dark: boolean }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.28 : 0.5} />
      <directionalLight position={[3, 2, 4]} intensity={dark ? 0.55 : 0.7} color="#fff7ed" />
      {dark ? <Stars /> : null}
      <Globe reduceMotion={reduceMotion} dark={dark} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.35}
        rotateSpeed={0.55}
        minDistance={5.4}
        maxDistance={5.4}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.78}
      />
    </>
  );
}

export function Earth() {
  const reduceMotion = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[36rem] overflow-visible lg:max-w-none">
      <Canvas
        camera={{ position: [0, 0.02, 5.4], fov: 36 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.domElement.style.touchAction = "none";
        }}
      >
        <Scene reduceMotion={reduceMotion} dark={dark} />
      </Canvas>
    </div>
  );
}
