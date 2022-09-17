import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import React, { Suspense, useState, useEffect, useMemo } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { useTransition, useSpring, a } from '@react-spring/three'

const colors = ['#ea5158', '#0d4663', '#ffbcb7', '#2d4a3e', '#8bd8d2']
const urls = ['berry', 'purple'].map(
    (name) => `../${name}_icon.svg`
  )
  

function Shape({ shape, rotation, position, color, opacity, index }) {
    if (!position) return null
    return (
    //   <a.mesh rotation={rotation} position={position.to((x, y, z) => [x, y, z + index * 50])}>
      <a.mesh rotation={rotation} position={position.to((x, y, z) => [x, y, z + index * 50])}>
        <a.meshPhongMaterial attach="material" color={color} opacity={opacity} side={THREE.DoubleSide} depthWrite={false} transparent />
        <shapeBufferGeometry attach="geometry" args={[shape]} />
      </a.mesh>
    )
  }

function Scene() {
    const { viewport } = useThree()
    const [page, setPage] = useState(0)
    useEffect(() => void setInterval(() => setPage((i) => (i + 1) % urls.length), 3500), [])
  
    const data = useLoader(SVGLoader, urls[page])
    const shapes = useMemo(() => data.paths.flatMap((g, index) => g.toShapes(true).map((shape) => ({ shape, color: g.color, index }))), [
      data
    ])
    const { color } = useSpring({ color: colors[page] })
    const transition = useTransition(shapes, {
      keys: (item) => item.shape.uuid,
      from: { rotation: [0.0, -Math.PI / 4, 0], position: [0, 50, 200], opacity: 0 },
      enter: { rotation: [0, 0, 0], position: [0, 0, 0], opacity: 1 },
      leave: { rotation: [0, 0.25, 0], position: [0, -50, 10], opacity: 0 },
      trail: 5
    })
  
    return (
      <>
        {/* color background */}
        <mesh scale={[viewport.width * 2, viewport.height * 2, 1]} position={[0,0,-5]}>
          <planeGeometry attach="geometry" args={[1, 1]} />
          <a.meshPhongMaterial attach="material" transparent color={color} depthTest={false} />
        </mesh>
        <group position={[viewport.width / 2, viewport.height / 4, page]} scale={[0.004, 0.004, 0.004]} rotation={[0, 0, Math.PI]}>
          {transition((props, item) => (
            <Shape {...item} {...props} />
          ))}
        </group>
      </>
    )
  }

  export default Scene