import {useGLTF, useTexture} from '@react-three/drei';

export function CanvasRoom() {
  const {nodes} = useGLTF('/models/model15.glb');
  const bakedTexture1 = useTexture('/models/baked1.jpg');
  const bakedTexture2 = useTexture('/models/baked2.jpg');
  bakedTexture1.flipY = false;
  bakedTexture2.flipY = false;

  return (
    <group dispose={null}>
      <mesh
        scale={4}
        position={[8.5, -2, -5]}
        rotation={[0, -Math.PI * 2.2, 0]}
        geometry={nodes.UpperSection.geometry}
      >
        <meshBasicMaterial map={bakedTexture1} />
      </mesh>
      <mesh
        scale={4}
        position={[8.5, -2, -5]}
        rotation={[0, -Math.PI * 2.2, 0]}
        infinite
        pages={4}
        damping={0.6}
        geometry={nodes.LowerSection.geometry}
      >
        <meshBasicMaterial map={bakedTexture2} />
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/model15.glb');
