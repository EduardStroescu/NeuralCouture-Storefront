import {Environment, Lightformer} from '@react-three/drei';

export function CanvasEnvironment({width}) {
  return (
    <>
      <Environment
        files={'/environment/surreal_desert.hdr'}
        background={'only'}
      />
      <Environment
        files={'/environment/evening_road_01_puresky_1k.hdr'}
        background={false}
        blur={1}
      >
        {width > 768 && (
          <group>
            <Lightformer
              intensity={7}
              position={[4, 2, 10]}
              scale={[5, 5, 1]}
              target={[0, 1, 10]}
            />
            <Lightformer
              intensity={6}
              position={[0, 2, 10]}
              scale={[5, 5, 1]}
              target={[0, 2, 10]}
            />
            <Lightformer
              intensity={6}
              position={[-4, 2, 10]}
              scale={[5, 5, 1]}
              target={[0, 1, 10]}
            />
          </group>
        )}
      </Environment>
    </>
  );
}
