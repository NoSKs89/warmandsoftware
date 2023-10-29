import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { useSpring, animated } from 'react-spring';

const CustomCameraControls = () => {
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  const scrollSpeed = 0.01;
  const startingYPosition = 0; // Adjust this to set your desired starting Y position
  const minYPosition = -10; // Set the minimum Y position to restrict scrolling
  
  useEffect(() => {
    cameraRef.current = camera;
    camera.lookAt(0, 0, 0)
  }, [camera]);

  const handleScroll = (event) => {
    if (cameraRef.current) {
      // Adjust the camera's position along the Y-axis based on the scroll wheel input
      cameraRef.current.position.y += -event.deltaY * scrollSpeed;

      // Restrict the camera's Y position
      // if (cameraRef.current.position.y < minYPosition) {
      //   cameraRef.current.position.y = minYPosition;
      // }

      if (cameraRef.current.position.y > startingYPosition) {
        cameraRef.current.position.y = startingYPosition;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return null;
};

export default CustomCameraControls;
