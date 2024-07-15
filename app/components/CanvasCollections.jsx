import {memo, useMemo, useRef, useState} from 'react';
import {useCursor} from '@react-three/drei';
import {useNavigate, useRouteLoaderData} from '@remix-run/react';
import {AnimatedImage} from './AnimatedImage';
import {useFrame} from '@react-three/fiber';
import {easing} from 'maath';
import {TitleCard} from './TitleCard';

export const Collections = memo(function Collections({params}) {
  const indexData = useRouteLoaderData('root');
  const collections = useMemo(
    () => indexData?.nodes?.collections?.nodes,
    [indexData],
  );
  const collectionTextureUrls = collections?.map(
    (collection) => collection?.image?.url || '/placeholders/placeholder.svg',
  );

  return (
    <>
      {collections &&
        collections.map((collection, index) => {
          return (
            <Collection
              key={collection.id}
              index={index}
              texture={collectionTextureUrls[index]}
              collectionTitle={collection.title}
              handle={collection.handle}
              locale={params.locale}
            />
          );
        })}
    </>
  );
});

const Collection = memo(function Collection({
  texture,
  collectionTitle,
  index,
  handle,
  locale,
}) {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  useFrame((_, delta) => {
    if (groupRef.current) {
      easing.damp3(groupRef.current.scale, hovered ? 1.02 : 1, 0.1, delta);
    }
  });
  useCursor(hovered);

  const navigate = useNavigate();
  const handleNavigate = (e, handle) => {
    navigate(
      locale ? `${locale}/collections/${handle}` : `/collections/${handle}`,
    );
  };

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => handleNavigate(e, handle)}
    >
      <AnimatedImage
        url={texture}
        hovered={hovered}
        position={[index * 13 + 4.6, 7, 10]}
        size={[10, 10, 20, 20]}
      />
      <TitleCard
        title={collectionTitle}
        index={index}
        position={[index * 13 + 4.6, 0.7, 10]}
        hovered={hovered}
      />
    </group>
  );
});
