/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useConvexPolyhedron } from '@react-three/cannon';
import * as THREE from 'three';

export function Bowl(props) {
  const { nodes } = useGLTF('/Bowl.glb');

  // Extract vertices and faces from the GLTF geometry
  const bowlGeometry = nodes.Bowl.geometry;

  const vertices = useMemo(() => {
    const positionAttribute = bowlGeometry.attributes.position;
    const verticesArray = [];
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      verticesArray.push([x, y, z]);
    }
    return verticesArray;
  }, [bowlGeometry]);

  const faces = useMemo(() => {
    const indexAttribute = bowlGeometry.index;
    const facesArray = [];
    for (let i = 0; i < indexAttribute.count; i += 3) {
      const a = indexAttribute.getX(i);
      const b = indexAttribute.getX(i + 1);
      const c = indexAttribute.getX(i + 2);
      facesArray.push([a, b, c]);
    }
    return facesArray;
  }, [bowlGeometry]);

  // Create a convex polyhedron shape for the bowl
  const [ref, api] = useConvexPolyhedron(() => ({
    mass: 1,
    position: props.position || [0, 0, 0],
    args: [vertices, faces],
    ...props
  }));

  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Bowl.geometry}
        material={nodes.Bowl.material} //Use the same material.
      />
    </group>
  );
}

useGLTF.preload('/Bowl.glb');
