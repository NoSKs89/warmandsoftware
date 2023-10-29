import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useTransition, extend, useLoader } from '@react-three/fiber'
import { TextureLoader, LinearFilter, BoxBufferGeometry, MathUtils, IcosahedronGeometry } from "three"
import { /*Reflector, */ CameraShake, OrbitControls, useTexture, shaderMaterial, ShaderMaterial, useFBO } from '@react-three/drei'
import { animate, inView } from 'motion'
import glsl from 'babel-plugin-glsl/macro'
import { StudyShader } from "../shaders/StudyShader"

function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    const hover = useRef(false)
  
    // const boxGeoRef = new BoxBufferGeometry(1,1,1)
    const groupRef = useRef()
    const scrollGroupRef = useRef()
    //without this second useRef, the hover event triggers a state change causing the component to re-render.
    const animationStarted = useRef(false)
    useEffect(() => {
        if (!animationStarted.current) {
          animationStarted.current = true;
          animate((t) => {
            if (groupRef.current)
              groupRef.current.position.y = -10 + 10 * t;
          }, { duration: 2, delay: 1 });
        }
      }, [])

      const uniforms = useMemo(() => ({
          u_intensity: {
            value: 0.3,
          },
          u_time: {
            value: 0.0,
          },
        }),[])

    useFrame((state) => {
        const { clock } = state
        if(scrollGroupRef.current){
            scrollGroupRef.current.rotation.y = window.scrollY * 0.001
        }
        if(mesh.current){
            mesh.current.material.uniforms.u_time.value = 0.4 * clock.getElapsedTime();
            mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
            mesh.current.material.uniforms.u_intensity.value,
            hover.current ? 0.85 : 0.15,
            0.02
            )
        }
    })  
    
    return (
    <>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={2}/>
      <ambientLight color={props.color} />
      <directionalLight color={props.color} position={[-1, 1, 3]} intensity={1} />
      <directionalLight color={props.color} intensity={0.5} position={[1, 1, 3]} />
      <directionalLight position={[-1, 3, -1]} />
      <group ref={scrollGroupRef}>
      <group position={[0, -10, 0]} ref={groupRef}>
      <mesh
        {...props}
        ref={mesh}
        scale={active ? 0.75 : 0.25}
        onClick={(e) => setActive(!active)}
        onPointerOver={(e) => {
            setHover(true)
            (hover.current = true)
        }}
        onPointerOut={(e) => {
            setHover(false)
            (hover.current = false)
        }}
        // geometry={boxGeoRef}
        >
        <icosahedronGeometry args={[2, 20]} />
        {/* <meshLambertMaterial color={hovered ? 'green' : 'tan'} /> */}
        <shaderMaterial
            attach="material"
            args={[StudyShader]}
            uniforms={uniforms}
        />
      </mesh>
      </group></group>
      </>
    )
  }

  export default Box