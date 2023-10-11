import {
  Bloom,
  EffectComposer,
  SMAA,
  Vignette,
} from '@react-three/postprocessing';

export default function Postprocessing() {
  return (
    <>
      <EffectComposer disableNormalPass multisampling={0}>
        <SMAA />
        <Bloom
          mipmapBlur
          luminanceThreshold={1}
          intensity={0.01}
          luminanceSmoothing={0.025}
          height={300}
        />
        <Vignette offset={0.35} darkness={0.7} />
      </EffectComposer>
    </>
  );
}
