import React, { useMemo, useRef } from 'react'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'

const Dolly = () => {
    // This one makes the camera move in and out
    useFrame(({ clock, camera }) => {
      camera.position.z = 50 + Math.sin(clock.getElapsedTime()) * 30
    })
    return null
  }

export default Dolly