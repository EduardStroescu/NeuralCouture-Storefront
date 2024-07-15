import {Html, Text} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import {RoundedRectGeometry} from './RoundedRectGeometry';
import React, {Suspense} from 'react';

export function TitleCard({title, position, hovered, index, children}) {
  const {size} = useThree();
  const childrenCount = React.Children.count(children) || 0;
  return (
    <group position={position}>
      <Text
        position={[0, 0.1 + childrenCount / 2, 0.1]}
        textAlign="center"
        scale={childrenCount > 0 ? childrenCount / 2 + 0.5 : 1}
        color={hovered ? 'white' : '#f2f2f2'}
      >
        {title}
      </Text>
      {React.Children.map(children, (child) => (
        <Text
          key={index}
          position={[0, -(0.1 + childrenCount / 2.1), 0.1]}
          scale={childrenCount / 2 + 0.2}
        >
          {child}
        </Text>
      ))}
      {size.width > 768 ? (
        <Html
          occlude="blending"
          transform
          style={{pointerEvents: 'none'}}
          pointerEvents={'none'}
          wrapperClass="m-0 p-0 box-border overflow-hidden h-full w-full"
          geometry={
            <RoundedRectGeometry args={[9, 1.5 + childrenCount, 0.4]} />
          }
        >
          <div className="rounded-xl blur-xl bg-[#02A3BBB8] border px-[160px] pt-[50px] pb-[48px] border-[#10D9E182] " />
        </Html>
      ) : (
        <mesh>
          <RoundedRectGeometry args={[9, 1.5 + childrenCount, 0.4]} />
          <meshBasicMaterial color={'#017382'} />
        </mesh>
      )}
    </group>
  );
}
