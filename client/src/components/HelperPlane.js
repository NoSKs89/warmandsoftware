import React, { useState, useRef } from 'react'
import { render } from 'react-dom'
import { useTrail, a } from 'react-spring'
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

let alreadyRendered = false

const HelperPlane = (props) => {
    let { size, viewport, camera } = useThree()
    // console.log('camera: ' + JSON.stringify(camera))
    //this finds the perfect size of the viewport based on the camera/canvas
    let ang_rad = camera.fov * Math.PI / 180
    let fov_y = camera.position.z * Math.tan(ang_rad / 2) * 2
    let viewportX = fov_y * camera.aspect
    let viewportY = fov_y
    //now that I know the size of the viewport, we can determine the scale based on how many rows or columns.
    let offset = props.offset ?? 10
    let sizeX = viewportX / offset
    let sizeY = viewportY / offset
    console.log('sizes: ' +  JSON.stringify(viewport))
    console.log('x: ' + sizeX + '; y: ' + sizeY + '; vwX: ' + viewportX + '; viewportY: ' + viewportY)
    const mesh = useRef()
    if(mesh.current && !alreadyRendered){
      // console.log(JSON.stringify(mesh))
      const bbox = new THREE.Box3().setFromObject(mesh.current);
      const sphere = bbox.getBoundingSphere(new THREE.Sphere())
      const { center, radius } = sphere
      console.log('plane sphere: ' + JSON.stringify(sphere))
      console.log('plane bbox: ' + JSON.stringify(bbox))
      console.log('plane box: ' + JSON.stringify(sphere))
      alreadyRendered = true
    }
    return (
        <mesh ref={mesh} position={[0,0,0]} scale={[1, 1, 1]}>
        <planeBufferGeometry args={[sizeX, sizeY]}  />
        <meshBasicMaterial wireframe={true} color={"red"} />
        </mesh>
    )
  }

export default HelperPlane