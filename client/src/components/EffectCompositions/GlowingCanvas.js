import React, { useRef, useMemo } from 'react';
import { EffectComposer, BloomEffect, EffectPass, RenderPass } from "postprocessing";
import { useFrame, useThree } from 'react-three-fiber';

const GlowingCanvas = () => {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new EffectPass(camera, new BloomEffect({
        intensity: 5.5, // Adjust to control the intensity of the bloom
        threshold: 5.9, // Adjust to control what parts of the scene bloom
    })))
    return composer
  }, [gl, scene, camera]);

  useFrame(() => {
    composer.render();
  });

  return null;
};

export default GlowingCanvas;
