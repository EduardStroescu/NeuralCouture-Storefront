import {Image} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import {easing} from 'maath';
import {useRef} from 'react';

export function AnimatedImage({url, hovered, position, size}) {
  const imageRef = useRef(null);

  useFrame((_, delta) => {
    if (imageRef?.current) {
      easing.damp(
        imageRef.current.material,
        'radius',
        hovered ? 0.15 : 0.07,
        0.2,
        delta,
      );
      easing.damp(
        imageRef.current.material,
        'zoom',
        hovered ? 1 : 1.1,
        0.2,
        delta,
      );
      easing.damp(
        imageRef.current.material,
        'grayscale',
        hovered ? 0 : 0.9,
        0.15,
        delta,
      );
      easing.dampC(
        imageRef.current.material.color,
        hovered ? 'white' : '#f2f2f2',
        hovered ? 0.3 : 0.15,
        delta,
      );
    }
  });
  return (
    <Image
      transparent
      ref={imageRef}
      url={url}
      radius={0.07}
      position={position}
    >
      <bentPlaneGeometry args={size} parameters={{width: 1, height: 1}} />
    </Image>
  );
}
