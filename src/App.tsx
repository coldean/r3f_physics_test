import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, useSphere, usePlane, useBox } from '@react-three/cannon';
import * as THREE from 'three';
import './App.css';
import { Bowl } from './bowl';

function Box({ position }: { position: [number, number, number] }) {
  const [ref] = useSphere(() => ({
    mass: 0.0001, // 질량 설정
    position: position, // 초기 위치 설정
    args: [0.1],
    material: {
      restitution: 0.9
    }
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color="orange" metalness={0.4} roughness={0.3} />
    </mesh>
  );
}

function Plane({ position }: { position: [number, number, number] }) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0], // 평면의 회전 설정
    position: position, // 평면의 위치 설정
    args: [100, 100],
    material: {
      restitution: 0.5
    }
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="blue" metalness={0.4} roughness={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Wall({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const [ref] = useBox(() => ({
    position: position,
    rotation: rotation,
    args: [0.2, 1, 5] // Narrow wall with height 2 and length 15
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={[0.2, 2, 15]} />
      <meshStandardMaterial color="grey" />
    </mesh>
  );
}

function App() {
  const boxes = Array.from({ length: 300 }, () => ([
    (Math.random() - 0.5) * 10, // Random X position
    Math.random() * 5 + 1,      // Random Y position
    (Math.random() - 0.5) * 10  // Random Z position
  ]));

  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 75 }}>
      <axesHelper scale={10} />
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={1} castShadow />
      <Physics gravity={[0, -9.81, 0]}> {/* 중력 설정 */}
        {boxes.map((position, index) => (
          <Box key={index} position={position as [number, number, number]} />
        ))}
        <Plane position={[0, -1, 0]} />
        <Wall position={[-4.5, 0, 0]} rotation={[0, 0, 0]} /> {/* Left wall */}
        <Wall position={[4.5, 0, 0]} rotation={[0, 0, 0]} /> {/* Right wall */}
        <Wall position={[0, 0, -4.5]} rotation={[0, Math.PI / 2, 0]} /> {/* Front wall */}
        <Wall position={[0, 0, 4.5]} rotation={[0, Math.PI / 2, 0]} /> {/* Back wall */}
      </Physics>
      <OrbitControls />
    </Canvas>
  );
}

export default App;
