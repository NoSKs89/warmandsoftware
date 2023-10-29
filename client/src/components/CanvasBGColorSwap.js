import React, { useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Color } from 'three';

function BackgroundColorLerp() {
  const { gl } = useThree(); // Use gl from useThree
  const initialColor = new Color('red'); // Initial background color (black)
  const targetColor = new Color('blue'); // Target background color (a shade of blue)
  const lerpFactor = 0.02; // Lerp factor (adjust as needed)

  const background = useRef();

  // Use useFrame to update the background color
//   useFrame(() => {
//     if (background.current) {
//       gl.setClearColor(initialColor.lerp(targetColor, lerpFactor)); // Set the background color using gl
//     }
//   });

  return (
    <mesh>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshBasicMaterial attach="material" ref={background} toneMapped={false} />
    </mesh>
  );
}

export default BackgroundColorLerp;
