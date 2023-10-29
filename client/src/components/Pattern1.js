import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useTransition, Plane } from '@react-three/fiber'
import * as THREE from 'three'

const params = {
    //wireframe version
    size: 0.5,
    magnitude: 2,
    randomness: 1,
    wireframe: true,
    centerX: 0,
    centerY: 0,
    startColor: new THREE.Color("red"),
    endColor: new THREE.Color("#F8DBEA"),
    fixedTime: 0,
    rotationSpeed: 0,
    emissiveIntensity: 0,
    speed: 400,
    pauseWireSwap: false
}

const Pattern1 = (props) => {
    // This reference will give us direct access to the mesh
    const center = new THREE.Vector2(params.centerX, params.centerY)
    const planeRef = useRef()
    useFrame((state) => {
        if(planeRef && planeRef.current){
            let positions = planeRef.current.geometry.attributes.position.array
            let ms = state.clock.getElapsedTime() * 1000
            for (let i = 0; i < positions.length; i++) {
                let i3 = i * 3
        
                let dist = new THREE.Vector2(positions[i3], positions[i3 + 1]).sub(center)
                let size = params.size
                let magnitude = params.magnitude
        
                //create a wave by changing the z access position
                positions[i3 + 2] = Math.sin(dist.length()/-size + (ms/params.speed) ) * magnitude
                planeRef.current.geometry.attributes.position.needsUpdate = true
            }

        }
      })
    return (
        <mesh ref={planeRef} wireframe>
        <planeBufferGeometry attach="geometry" args={[4, 4, 75, 75]} />
        <meshStandardMaterial color={'orange'}  wireframe/>
        </mesh>
    )
}

export default Pattern1