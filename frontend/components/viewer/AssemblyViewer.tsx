"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { getScenePreset, PrimitivePart } from '@/lib/scene-presets';

interface AssemblyViewerProps {
  scenePreset?: string;
}

export default function AssemblyViewer({ scenePreset }: AssemblyViewerProps) {
  const scene = getScenePreset(scenePreset);

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
      <Canvas
        camera={{
          position: scene.camera.position,
          fov: 50
        }}
      >
        {/* Background color */}
        <color attach="background" args={['#f8f9fa']} />
        
        {/* Lighting setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} />

        {/* Render all parts in the scene */}
        {scene.parts.map((part, i) => (
          <Part key={i} {...part} />
        ))}

        {/* Camera controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          target={scene.camera.lookAt}
        />

        {/* Floor grid for spatial reference */}
        <gridHelper args={[5, 20, '#999999', '#cccccc']} position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}

/**
 * Component to render a single primitive part
 */
function Part({ type, color, args, position, rotation, scale = [1, 1, 1] }: PrimitivePart) {
  // Map primitive type to Three.js geometry
  const geometries = {
    box: <boxGeometry args={args as [number, number, number]} />,
    cylinder: <cylinderGeometry args={args as [number, number, number, number]} />,
    sphere: <sphereGeometry args={args as [number, number]} />
  };

  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      {geometries[type]}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
