import * as THREE from 'three'
import { useMemo } from 'react'
import { extend, Canvas,  } from '@react-three/fiber'


function Spheres({ count, colors, radius = 50, rand = THREE.MathUtils.randFloatSpread }) {
  const spheres = useMemo(() => {
    return Array.from({ length: count }, () => {
      const position = new THREE.Vector3(rand(radius), rand(radius), rand(radius))
      return {
        color: colors[parseInt(colors.length * Math.random())],
        radius: Math.max(radius / 100, (radius / 50) * Math.random()),
        position: position.toArray()
      }
    })
  }, [colors, count, radius])

  return spheres.map((props, index) => <Sphere key={index} {...props} />)
}

function Sphere({ position, radius, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

export default Spheres
