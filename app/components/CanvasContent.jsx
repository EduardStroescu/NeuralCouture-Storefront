import {useParams} from '@remix-run/react';
import {extend, useThree} from '@react-three/fiber';
import {ScrollControls, Stats} from '@react-three/drei';
import {geometry} from 'maath';

import {useIsHomePath} from '~/lib/utils';
import {RoundedRectGeometry} from '~/lib/RoundedRectGeometry';
import {
  Camera,
  CanvasRoom,
  Postprocessing,
  CanvasEnvironment,
  Collections,
  CollectionProducts,
} from '~/components';

extend({
  RoundedRectGeometry,
  RoundedPlaneGeometry: geometry.RoundedPlaneGeometry,
});

export function CanvasContent() {
  const {size} = useThree();
  const isHome = useIsHomePath();
  const params = useParams();

  return (
    <>
      {isHome && <Collections locale={params} width={size.width} />}
      <ScrollControls infinite pages={4} damping={0.5}>
        <CollectionProducts locale={params} width={size.width} />
      </ScrollControls>
      <CanvasRoom />
      <Camera position={[5, 0, 26]} />
      <CanvasEnvironment width={size.width} />
      <Postprocessing width={size.width} />
      {/* <Stats /> */}
    </>
  );
}
