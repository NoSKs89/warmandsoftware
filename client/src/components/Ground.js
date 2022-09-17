// import * as THREE from 'three'
// import { useState, useRef, Suspense, useMemo } from 'react'
// import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber'
// import { /*Reflector, */ CameraShake, OrbitControls, useTexture } from '@react-three/drei'
// import { KernelSize } from 'postprocessing'
// import { EffectComposer, Bloom } from '@react-three/postprocessing'
// import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'


// import Reflector from '../Reflector'

// const Ground = () => {
//     const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])
//   return (
//     <Reflector resolution={1024} args={[8, 8]} {...props}>
//       {(Material, props) => <Material color="#f0f0f0" metalness={0} roughnessMap={floor} normalMap={normal} normalScale={[0.6, 0.6]} {...props} />}
//     </Reflector>
//   )
// }