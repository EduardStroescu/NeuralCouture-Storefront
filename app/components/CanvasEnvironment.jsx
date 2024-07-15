import {Environment, Lightformer} from '@react-three/drei';
import {useThree} from '@react-three/fiber';

export function CanvasEnvironment() {
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
      />
    </>
  );
}
