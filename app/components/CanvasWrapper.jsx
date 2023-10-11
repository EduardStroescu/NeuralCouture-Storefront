import {
  Environment,
  Float,
  Html,
  Lightformer,
  Line,
  ScrollControls,
  Stats,
  Text,
  useCursor,
  useGLTF,
  useScroll,
  useTexture,
} from '@react-three/drei';
import {useNavigate, useRouteLoaderData, useParams} from '@remix-run/react';
import {useState, useEffect, useRef, useMemo} from 'react';
import {extend, useFrame, useThree} from '@react-three/fiber';
import {
  DoubleSide,
  EllipseCurve,
  FrontSide,
  MeshBasicMaterial,
  Vector3,
} from 'three';
import {geometry} from 'maath';

import {useIsHomePath} from '~/lib/utils';
import {RoundedRectGeometry} from './RoundedRectGeometry';
import Camera from './Camera';
import Postprocessing from './Postprocessing';

extend({
  RoundedRectGeometry,
  RoundedPlaneGeometry: geometry.RoundedPlaneGeometry,
});

export default function CanvasWrapper() {
  const {size} = useThree();
  const isHome = useIsHomePath();
  const params = useParams();
  const indexData = useRouteLoaderData('root');
  const collections = indexData?.nodes?.collections?.nodes;

  const collectionsTextures = useTexture(
    collections.map((collection) => collection.image.url),
  );

  const {nodes} = useGLTF('/models/model15.glb');
  const bakedTexture1 = useTexture('/models/baked1.jpg');
  const bakedTexture2 = useTexture('/models/baked2.jpg');
  bakedTexture1.flipY = false;
  bakedTexture2.flipY = false;

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
      <ScrollControls infinite pages={5} damping={0.6}>
        {collections && isHome
          ? collections.map((collection, index) => {
              return (
                <Collections
                  key={collection.id}
                  index={index}
                  textures={collectionsTextures[index]}
                  collectionTitle={collection.title}
                  handle={collection.handle}
                  navigate={handleMeshClick}
                  size={size.width}
                />
              );
            })
          : null}
        <CollectionProducts locale={params} size={size.width} />
      </ScrollControls>
      <Camera position={[5, 0, 26]} />
      {/* <OrbitControls position={[6, 5, 2]} makeDefault /> */}
      <mesh
        scale={4}
        position={[8.5, -2, -5]}
        rotation={[0, -Math.PI * 2.2, 0]}
        geometry={nodes.UpperSection.geometry}
      >
        <meshBasicMaterial map={bakedTexture1} />
      </mesh>
      <mesh
        scale={4}
        position={[8.5, -2, -5]}
        rotation={[0, -Math.PI * 2.2, 0]}
        infinite
        pages={4}
        damping={0.6}
        geometry={nodes.LowerSection.geometry}
      >
        <meshBasicMaterial map={bakedTexture2} />
      </mesh>
      <Environment
        files={'/environment/surreal_desert.hdr'}
        background={'only'}
      />
      <Environment
        files={'/environment/evening_road_01_puresky_1k.hdr'}
        background={false}
        blur={1}
      >
        {size.width > 768 && (
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
      <Postprocessing />
      {/* <Stats /> */}
    </>
  );
}

function Collections(props) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    groupRef.current.scale.setScalar(hovered ? 1 + 0.02 : 1);
  }, [hovered]);
  useCursor(hovered);
  const scrollData = useScroll();

  return (
    <group ref={groupRef} rotateX={Math.PI / 2}>
      <mesh
        position={[props.index * 13 + 4.6, 7, 10]}
        onClick={() => props.navigate(props.handle)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        side={FrontSide}
      >
        <roundedRectGeometry args={[10, 10, 0.4]} />
        {/* <meshBasicMaterial
          map={props.textures}
          color={hovered ? '#8c8c8c' : 'grey'}
        /> */}
        {props.size > 768 ? (
          <meshStandardMaterial
            map={props.textures}
            side={FrontSide}
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
          <roundedRectGeometry args={[9, 2, 0.4]} />
          <meshStandardMaterial
            color={'#017382'}
            transparent
            opacity={0.9}
            roughness={0}
          />
        </mesh>
      </group>
      {/* <Html
        occlude="blending"
        position={[props.index * 13.2 + 4.6, 0.5, 9.5]}
        transform
        wrapperClass="m-0 p-0 box-border overflow-hidden h-full w-full"
        portal={{current: scrollData.fixed}}
        geometry={<roundedPlaneGeometry args={[8.2, 2, 0.4]} />}
      >
        <div className="rounded-xl blur-sm bg-[#23d3ee9d] border px-[165px] pt-[50px] pb-[40px] border-[#10D9E182]"></div>
      </Html> */}
    </group>
  );
}

function CollectionProducts(props) {
  const collectionItemsData = useRouteLoaderData(
    'routes/($locale).collections.$collectionHandle',
  );
  const collectionsContent = collectionItemsData?.collection?.products?.nodes;

  const productsTextures = useTexture(
    collectionsContent
      ? collectionsContent.map(
          (collection) => collection.variants.nodes[0].image.url,
        )
      : [],
  );

  const groupRef = useRef();
  const scroll = useScroll();
  const numProducts = collectionsContent?.length;

  const points = useMemo(
    () =>
      new EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, true, 0).getPoints(300),
    [],
  );

  let tOffset = 0; // Offset to stagger the products
  let t = 0; // Animation time

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(11, 1, 1);
      groupRef.current.rotation.set(Math.PI / 2, 0, 0);

      // Update positions of products along the path
      groupRef.current.children.forEach((product, index) => {
        const tProduct =
          (((-scroll.offset + tOffset + index / numProducts) % 1) + 1) % 1; // Wrap within [0, 1]
        const productPointIndex =
          Math.floor(tProduct * points.length) % points.length;
        const productPoint = points[productPointIndex];
        const lerpedPosition = new Vector3().lerpVectors(
          product.position,
          new Vector3(productPoint.x, productPoint.y, 0),
          0.06, // Adjust the interpolation factor for smoother or faster animation
        );

        product.position.set(lerpedPosition.x, lerpedPosition.y, 0);
        product.rotation.set(-Math.PI / 2, 0, 0); // Rotate the product as it moves along the path
      });
    }
  });

  const navigate = useNavigate();
  function handleProductsNavigate(handle) {
    navigate(
      props.locale.locale
        ? `${props.locale.locale}/products/${handle}`
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
                size={props.size}
              />
            );
          })}
      </group>
    </>
  );
}

function Product(props) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    groupRef.current.scale.setScalar(hovered ? 1 + 0.02 : 1);
  }, [hovered]);
  useCursor(hovered);
  const scrollData = useScroll();

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh
        position={[0, 7.5, 0]}
        onClick={(e) => (e.stopPropagation(), props.navigate(props.handle))}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={(e) => setHovered(false)}
      >
        <roundedRectGeometry args={[10, 10, 0.4]} />

        {props.size > 768 ? (
          <meshStandardMaterial
            map={props.textures}
            side={FrontSide}
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
      <group position={[0, 0.2, 0]}>
        <Text
          position={[0, 1.1, 0]}
          scale={0.8}
          textAlign="center"
          color={hovered ? 'white' : '#f2f2f2'}
        >
          {props.title}
        </Text>
        <Text
          position={[0, -0.2, 0]}
          scale={0.7}
          textAlign="center"
          color={hovered ? 'white' : '#f2f2f2'}
        >
          {props.amount} {props.currency}
        </Text>
        {/* <mesh position={[0, 0.5, -0.5]}>
          <roundedRectGeometry args={[9, 2, 0.4]} />
          <meshBasicMaterial color={'#017382'} />
        </mesh> */}
        <Html
          occlude="blending"
          position={[0, 0.4, -0.5]}
          transform
          style={{pointerEvents: 'none'}}
          pointerEvents={'none'}
          wrapperClass="m-0 p-0 box-border overflow-hidden h-full w-full"
          portal={{current: scrollData.fixed}}
          geometry={<roundedPlaneGeometry args={[8, 2.5, 0.4]} />}
        >
          <div className="rounded-xl blur-xl bg-[#02A3BBB8] border px-[160px] pt-[50px] pb-[48px] border-[#10D9E182] "></div>
        </Html>
        {/* <mesh position={[0, 0.4, -0.5]}>
          <roundedPlaneGeometry args={[8, 2.5, 0.4]} />
          <meshPhysicalMaterial
            color={'#003239'}
            roughness={0.6}
            transmission={0.1}
          />
        </mesh> */}
      </group>
    </group>
  );
}
