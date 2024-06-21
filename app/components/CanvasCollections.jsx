import {memo, useEffect, useMemo, useRef, useState} from 'react';
import {Text, useCursor, useTexture} from '@react-three/drei';
import {useNavigate, useRouteLoaderData} from '@remix-run/react';
import {RoundedRectGeometry} from './RoundedRectGeometry';

export const Collections = memo(function Collections({width, params}) {
  const indexData = useRouteLoaderData('root');
  const collections = useMemo(
    () => indexData?.nodes?.collections?.nodes,
    [indexData],
  );
  const collectionsImageUrls =
    collections?.map((collection) => collection?.image?.url || '') || [];

  const collectionsTextures = useTexture(collectionsImageUrls);

  const navigate = useNavigate();
  function handleMeshClick(handle) {
    navigate(
      params.locale
        ? `${params.locale}/collections/${handle}`
        : `/collections/${handle}`,
    );
  }

  return (
    <>
      {collections &&
        collections.map((collection, index) => {
          return (
            <Collection
              key={collection.id}
              index={index}
              textures={collectionsTextures[index]}
              collectionTitle={collection.title}
              handle={collection.handle}
              navigate={handleMeshClick}
              width={width}
            />
          );
        })}
    </>
  );
});

const Collection = memo(function Collection(props) {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current?.scale.setScalar(hovered ? 1 + 0.02 : 1);
    }
  }, [hovered]);
  useCursor(hovered);

  return (
    <group ref={groupRef} rotateX={Math.PI / 2}>
      <mesh
        position={[props.index * 13 + 4.6, 7, 10]}
        onClick={() => props.navigate(props.handle)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <RoundedRectGeometry args={[10, 10, 0.4]} />
        {props.width > 768 ? (
          <meshStandardMaterial
            map={props.textures}
            color={hovered ? '#8c8c8c' : 'grey'}
            roughness={0.2}
            metalness={1}
            envMapIntensity={1.2}
          />
        ) : (
          <meshBasicMaterial
            map={props.textures}
            color={hovered ? 'white' : '#e8e8e8'}
          />
        )}
      </mesh>
      <group position={[0, -0.2, 0]}>
        <Text position={[props.index * 13 + 4.6, 0.5, 10]} textAlign="center">
          {props.collectionTitle}
        </Text>
        <mesh position={[props.index * 13.2 + 4.6, 0.5, 9.5]}>
          <RoundedRectGeometry args={[9, 2, 0.4]} />
          <meshStandardMaterial
            color={'#017382'}
            transparent
            opacity={0.9}
            roughness={0}
          />
        </mesh>
      </group>
    </group>
  );
});
