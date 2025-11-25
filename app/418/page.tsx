// app/418/page.tsx
// 3D Teapot version using @react-three/fiber + @react-three/drei
// Shows a 3D teapot with rising smoke animation
"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Suspense } from "react";

function Smoke() {
  return (
    <group>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0, 1.2 + i * 0.4, 0]} scale={1 - i * 0.12}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function Teapot() {
  return (
    <mesh castShadow receiveShadow>
      <torusKnotGeometry args={[0.6, 0.25, 100, 16]} />
      <meshStandardMaterial color="#d1d1d1" metalness={0.6} roughness={0.3} />
    </mesh>
  );
}

export default function TeapotPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl mb-10">
        <Canvas camera={{ position: [3, 2, 4], fov: 50 }} shadows>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

          <Suspense fallback={null}>
            <group position={[0, -0.5, 0]}>
              <Teapot />
              <Smoke />
            </group>
          </Suspense>

          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <h1 className="text-7xl font-bold">418</h1>
        <p className="text-2xl opacity-80">I'm a teapot ☕</p>
        <p className="opacity-60 max-w-md mx-auto">
          This server refuses to brew coffee because it is, permanently, a
          teapot.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 rounded-2xl bg-white text-black font-medium shadow hover:opacity-80 transition"
        >
          Go Home
        </a>
      </motion.div>
    </div>
  );
}
