import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useTransition } from '@react-three/fiber'
import * as THREE from 'three'

import Triangle from '../components/Triangle'
// notes: middle school fortune teller as page navigation. When the final 'flap' opens it will cross whole viewport with new page color

const sizes = {
    square: [1, 1, 1],
    diamond: [1, 1],
    triangle: [1, 1, 1]
}

const Fortune = (props) => {
    const mesh = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
  
    const triangleVertices = [
        new THREE.Vector3(0, 20, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(20, 0, 0),
    ]

    // const points = [
    //     [0, 0, 0],
    //     [0, 5, -10],
    //     [0, -5, -20],
    //     [0, 0, -30]
    // ]
    // const vertices = useMemo(() => points.map(point => new THREE.Vector3(...point)), [points])
    return (
        <mesh
        {...props}
        ref={mesh}
        // scale={active ? 1.5 : 1}
        scale={0.1}
        onClick={(e) => setActive(!active)}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
        // geometry={geom}
        >
        <Triangle vertices={triangleVertices} position={[-10,0,0]}/>
        {/* <boxGeometry args={[1, 1, 1]} /> */}
        {/* <shapeGeometry args={[1, 1, 1]} /> */}
        {/* <line>
            <bufferGeometry vertices={vertices} />
            <lineBasicMaterial color="red" />
        </line> */}


        {/* <planeGeometry attach="geometry" args={[1, 1, faces, faces]} /> */}
        {/* <meshNormalMaterial attach="material" wireframe={true} /> */}
      </mesh>
        // <img src={jpg} alt='whoops' style={{textAlign:'center'}} className="paper"/>
    )
  }

export default Fortune