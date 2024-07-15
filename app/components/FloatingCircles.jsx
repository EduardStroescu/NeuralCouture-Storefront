import {Float, Line} from '@react-three/drei';

export function FloatingCircles({points}) {
  return (
    <group>
      <Float
        speed={3}
        rotationIntensity={0}
        floatIntensity={6}
        floatingRange={[0, -0.3]}
      >
        <Line
          worldUnits
          points={points}
          color={[0, 97, 87]}
          toneMapped={false}
          lineWidth={0.3}
          rotation={[Math.PI / 2, 0, 0]}
          position={[11, 0, 1]}
          scale={1}
        />
      </Float>
      <Float
        speed={3}
        rotationIntensity={0}
        floatIntensity={3}
        floatingRange={[0.3, 0]}
      >
        <Line
          worldUnits
          points={points}
          color={[0, 97, 87]}
          toneMapped={false}
          lineWidth={0.3}
          rotation={[Math.PI / 2, 0, 0]}
          position={[11, -1, 1]}
          scale={1.2}
        />
      </Float>
    </group>
  );
}
