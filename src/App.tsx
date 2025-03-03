// todo
// 미우스 위치에 정확히 멈추도록

import React, { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, useSphere, usePlane, useBox } from '@react-three/cannon';
import * as THREE from 'three';
import './App.css';
import { Bowl } from './bowl';
import { Raycaster } from 'three';

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
    args: [0.2, 2, 15] // Narrow wall with height 2 and length 15
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={[0.2, 2, 15]} />
      <meshStandardMaterial color="grey" />
    </mesh>
  );
}

function Scene() {
  const [gravity, setGravity] = useState<[number, number, number]>([0, -9.81, 0]);
  const raycaster = new Raycaster();
  const mouse = new THREE.Vector2();
  const { camera, scene } = useThree();

  const handleMouseMove = (event: MouseEvent) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      const targetPosition = intersects[0].point;
      setGravity([targetPosition.x, -9.81, targetPosition.z]);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const boxes = Array.from({ length: 300 }, () => ([
    (Math.random() - 0.5) * 10,
    Math.random() * 5 + 1,
    (Math.random() - 0.5) * 10
  ]));

  return (
    <>
      <axesHelper scale={10} />
      <ambientLight intensity={2} />
      <pointLight position={[3, 3, 3]} intensity={10} castShadow />
      <Physics gravity={gravity}>
        {boxes.map((position, index) => (
          <Box key={index} position={position as [number, number, number]} />
        ))}
        <Plane position={[0, -1, 0]} />
        <Wall position={[-4.5, 0, 0]} rotation={[0, 0, 0]} />
        <Wall position={[4.5, 0, 0]} rotation={[0, 0, 0]} />
        <Wall position={[0, 0, -4.5]} rotation={[0, Math.PI / 2, 0]} />
        <Wall position={[0, 0, 4.5]} rotation={[0, Math.PI / 2, 0]} />
      </Physics>
      <OrbitControls />
    </>
  );
}

function App() {
  const boxes = Array.from({ length: 300 }, () => ([
    (Math.random() - 0.5) * 10,
    Math.random() * 5 + 1,
    (Math.random() - 0.5) * 10
  ]));

  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 75 }}>
      <Scene />
    </Canvas>
  );
}

export default App;
