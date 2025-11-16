import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { DiffuserBladeAssembly } from './DiffuserBladeAssembly';
import { CentrifugalPumpCasing } from './CentrifugalPumpCasing';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type CameraView = 'top' | 'side' | 'isometric';
type ModelType = 'diffuser' | 'casing';

interface Scene3DProps {
  view: CameraView;
  bladeCount: number;
  modelType: ModelType;
}

export const Scene3D = ({ view, bladeCount, modelType }: Scene3DProps) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    // Set camera position based on view
    switch (view) {
      case 'top':
        camera.position.set(0, 4, 0);
        controls.target.set(0, 0, 0);
        break;
      case 'side':
        camera.position.set(4, 0, 0);
        controls.target.set(0, 0, 0);
        break;
      case 'isometric':
        camera.position.set(3, 2.5, 3);
        controls.target.set(0, 0, 0);
        break;
    }

    controls.update();
  }, [view]);

  return (
    <Canvas
      shadows
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      className="w-full h-full"
    >
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[3, 2.5, 3]}
        fov={50}
      />
      
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={8}
      />

      {/* Lighting setup for engineering visualization */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} />
      <pointLight position={[0, 3, 0]} intensity={0.3} />

      {/* Environment for reflections */}
      <Environment preset="studio" />

      {/* Main component */}
      {modelType === 'diffuser' ? (
        <DiffuserBladeAssembly bladeCount={bladeCount} />
      ) : (
        <CentrifugalPumpCasing />
      )}

      {/* Ground plane for reference */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </Canvas>
  );
};
