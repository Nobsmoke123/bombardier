"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Group,
  type Points,
} from "three";
import {
  createLandPositions,
  createStarPositions,
  latLngToVector,
} from "./land-points";

const LABELS = [
  { text: "Lagos", lat: 6.52, lng: 3.38 },
  { text: "Backend Resume", lat: 51.5, lng: -0.12 },
  { text: "+1 Interview", lat: 40.71, lng: -74.0 },
] as const;

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

function Continents() {
  const points = useRef<Points>(null);
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(createLandPositions(1.01, 1.2), 3));
    return geo;
  }, []);

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#F97316"
        size={0.016}
        sizeAttenuation
        transparent
        opacity={0.92}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.08, 48, 48]} />
      <meshBasicMaterial
        color="#F97316"
        transparent
        opacity={0.07}
        side={BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function FloatingLabels() {
  return (
    <>
      {LABELS.map((label) => {
        const [x, y, z] = latLngToVector(label.lat, label.lng, 1.16);
        return (
          <Html key={label.text} position={[x, y, z]} distanceFactor={5} zIndexRange={[10, 0]}>
            <div className="rounded-sm border border-void-line bg-void-surface/90 px-2.5 py-1 text-[11px] whitespace-nowrap text-zinc-200 shadow-none backdrop-blur-sm">
              {label.text}
            </div>
          </Html>
        );
      })}
    </>
  );
}

function Globe({ reduceMotion }: { reduceMotion: boolean }) {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current || reduceMotion) return;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.045;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#0c0c10" roughness={0.92} metalness={0.08} />
      </mesh>
      <Continents />
      <Atmosphere />
      <FloatingLabels />
    </group>
  );
}

function Scene({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      <color attach="background" args={["#09090B"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 2, 4]} intensity={0.7} color="#fff7ed" />
      <Stars />
      <Globe reduceMotion={reduceMotion} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.35}
        rotateSpeed={0.55}
      />
    </>
  );
}

export function Earth() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="relative h-[22rem] w-full sm:h-[28rem] lg:h-[min(36rem,72vh)]">
      <Canvas
        camera={{ position: [0, 0.15, 3.05], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.style.touchAction = "none";
        }}
      >
        <Scene reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
