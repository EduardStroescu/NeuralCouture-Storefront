import {useEffect, useState, useRef, useMemo, memo} from 'react';
import {useNavigate, useRouteLoaderData} from '@remix-run/react';
import {useFrame} from '@react-three/fiber';
import {EllipseCurve, Vector3} from 'three';
import {
  Float,
  Html,
  Line,
  Text,
  useCursor,
  useTexture,
} from '@react-three/drei';

import {useScrollContext} from '~/components';

import {RoundedRectGeometry} from './RoundedRectGeometry';

const CollectionProducts = memo(function CollectionProducts({params, width}) {
  const collectionItemsData = useRouteLoaderData(
    'routes/($locale).collections.$collectionHandle',
  );

  const collectionsContent = useMemo(
    () => collectionItemsData?.collection?.products?.nodes,
    [collectionItemsData],
  );
  const productTexturesUrls = collectionsContent
    ? collectionsContent.map(
        (collection) => collection?.variants?.nodes?.[0]?.image?.url,
      )
    : [];

  const productsTextures = useTexture(productTexturesUrls);

  const groupRef = useRef();
  const scroll = useScrollContext();
  const numProducts = collectionsContent?.length;

  const points = useMemo(
    () =>
      new EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, true, 0).getPoints(300),
    [],
  );

  let tOffset = 0.5; // Offset to stagger the products

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(11, 1, 1);
      groupRef.current.rotation.set(Math.PI / 2, 0, 0);

      // Update positions of products along the path
      groupRef.current.children.forEach((product, index) => {
        const tProduct =
          (((-scroll.progress + tOffset + index / numProducts) % 1) + 1) % 1; // Clamp within [0, 1]
        const productPointIndex =
          Math.floor(tProduct * points.length) % points.length;
        const productPoint = points[productPointIndex];
        const lerpedPosition = new Vector3().lerpVectors(
          product.position,
          new Vector3(productPoint.x, productPoint.y, 0),
          0.055, // Adjust the interpolation factor for smoother or faster animation
        );

        product.position.set(lerpedPosition.x, lerpedPosition.y, 0);
        product.rotation.set(-Math.PI / 2, 0, 0); // Rotate the product to face the camera
      });
    }
  });

  const navigate = useNavigate();
  function handleProductsNavigate(handle) {
    navigate(
      params.locale
        ? `${params.locale}/products/${handle}`
        : `/products/${handle}`,
    );
  }
  return (
    <>
      {collectionsContent && (
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
      )}
      <group ref={groupRef}>
        {collectionsContent &&
          collectionsContent.map((product, index) => {
            return (
              <Product
                key={product.id}
                index={index}
                textures={productsTextures[index]}
                title={product.title}
                amount={product.variants.nodes[0].price.amount}
                currency={product.variants.nodes[0].price.currencyCode}
                handle={product.handle}
                navigate={handleProductsNavigate}
                width={width}
              />
            );
          })}
      </group>
    </>
  );
});

const Product = memo(function Product(props) {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(hovered ? 1 + 0.02 : 1);
    }
  }, [hovered]);
  useCursor(hovered);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh
        position={[0, 7.5, 0]}
        onClick={(e) => (e.stopPropagation(), props.navigate(props.handle))}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={(e) => setHovered(false)}
      >
        <RoundedRectGeometry args={[9, 11, 0.4]} />

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
      <group position={[0, 0, 0]}>
        <Text
          position={[0, 1, 0]}
          scale={0.8}
          textAlign="center"
          color={hovered ? 'white' : '#f2f2f2'}
        >
          {props.title}
        </Text>
        <Text
          position={[0, -0.1, 0]}
          scale={0.7}
          textAlign="center"
          color={hovered ? 'white' : '#f2f2f2'}
        >
          {props?.amount} {props?.currency}
        </Text>
        {props.width > 768 ? (
          <Html
            occlude="blending"
            position={[0, 0.4, -0.5]}
            transform
            style={{pointerEvents: 'none'}}
            pointerEvents={'none'}
            wrapperClass="m-0 p-0 box-border overflow-hidden h-full w-full"
            geometry={<roundedPlaneGeometry args={[8, 2.5, 0.4]} />}
          >
            <div className="rounded-xl blur-xl bg-[#02A3BBB8] border px-[160px] pt-[50px] pb-[48px] border-[#10D9E182] "></div>
          </Html>
        ) : (
          <mesh position={[0, 0.5, -0.5]}>
            <RoundedRectGeometry args={[9, 2.5, 0.4]} />
            <meshBasicMaterial color={'#017382'} />
          </mesh>
        )}
      </group>
    </group>
  );
});

export default CollectionProducts;
