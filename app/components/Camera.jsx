import {useRef, useEffect} from 'react';
import {useLocation} from '@remix-run/react';
import {useFrame, useThree} from '@react-three/fiber';
import {PerspectiveCamera} from '@react-three/drei';
import {easing} from 'maath';

export function Camera(props) {
  const location = useLocation();
  const {size} = useThree();
  const group = useRef();
  const cameraRef = useRef();

  const set = useThree((state) => state.set);
  useEffect(() => void set({camera: cameraRef.current}));
  useFrame(() => cameraRef.current?.updateMatrixWorld());

  useFrame((state, delta) => {
    if (location.pathname.startsWith('/')) {
      easing.damp3(
        state.camera.position,
        [
          6 + state.pointer.x,
          5 + -state.pointer.y / 6,
          (size.width / size.height) * 500 <= 500 ? 6 : 2,
        ],
        0.5,
        delta,
        25,
      );
      easing.dampE(
        state.camera.rotation,
        [state.pointer.y * 0.02, state.pointer.x * 0.08, 0],
        0.5,
        delta,
      );
    }
  });

  return (
    <group ref={group} {...props}>
      <group name="Scene">
        <PerspectiveCamera
          ref={cameraRef}
          damping={true}
          name="Camera"
          far={130}
          near={0.01}
          fov={(size.width / size.height) * 500 <= 500 ? 95 : 75}
          makeDefault
        />
      </group>
    </group>
  );
}
