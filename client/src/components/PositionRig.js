import React, { useMemo, useRef } from 'react'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'

const Rig = (props) => {
    const { camera, viewport } = useThree()
    useFrame((state) => {
      if(!props.reset){
        camera.position.x += (state.mouse.x * viewport.width - camera.position.x) * 0.05
        camera.position.y += (-state.mouse.y * viewport.height - camera.position.y) * 0.05
      }
      else{
        camera.position.x = 0
        camera.position.y = 0
      }
      camera.lookAt(0, 0, 0)
    })
    return null
}

export default Rig