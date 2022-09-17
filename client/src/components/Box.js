import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useTransition } from '@react-three/fiber'
import * as THREE from 'three'

function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
  
    const boxGeoRef = new THREE.BoxBufferGeometry(1,1,1)

    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => {
      mesh.current.rotation.x = mesh.current.rotation.y += 0.01
      // mesh.current.geometry.vertices[0].x += -25 * 50 
      
    })
    return (
      <mesh
        {...props}
        ref={mesh}
        scale={active ? 1.5 : 1}
        onClick={(e) => setActive(!active)}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
        geometry={boxGeoRef}
        >
        {/* <boxGeometry args={[1, 1, 1]} onPointerOver={(self) => console.log('self: ' + self.vertices[0])} /> */}
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
  }

  export default Box