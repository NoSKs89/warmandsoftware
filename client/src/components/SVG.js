import * as THREE from 'three'
import React, { Suspense, useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import flatten from 'lodash-es/flatten'
import { SVGLoader as loader } from 'three/examples/jsm/loaders/SVGLoader'
import { Text, MapControls } from '@react-three/drei'

const svgResource = new Promise(resolve =>
    // new loader().load('./berry_icon.svg', shapes =>
    //   resolve(flatten(shapes.map((group, index) => group.toShapes(true).map(shape => ({ shape, color: group.color, index })))))
    // )
    new loader().load('../berry_icon.svg', shapes =>
    {
        console.log(shapes)
        resolve(flatten(shapes.map((group, index) => group.toShapes(true).map(shape => ({ shape, color: group.color, index })))))
    }
  )
  )
  
  function Shape({ shape, position, color, opacity, index }) {
    return (
      <mesh position={[0, 0, -index * 50]}>
        <meshPhongMaterial attach="material" color={color} side={THREE.DoubleSide} />
        <shapeBufferGeometry attach="geometry" args={[shape]} />
      </mesh>
    )
  }
  
  function Scene() {
    const [shapes, set] = useState([])
    useEffect(() => void svgResource.then(set), [])
    return (
        //GROUP HERE SEEMS ODD.
      <group position={[1600, -700, 0]} rotation={[0, THREE.Math.degToRad(180), 0]}>
        {shapes.map(item => (
          <Shape key={item.shape.uuid} {...item} />
        ))}
      </group>
    )
  }

export default Scene