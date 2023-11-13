import * as THREE from 'three'
import { useMemo, useRef, useState, useEffect } from 'react'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import { act } from 'react-dom/test-utils'

extend({ MeshLineGeometry, MeshLineMaterial })

const lerp = (x, y, a) => {
  const r = (1 - a) * x + a * y 
  return Math.abs(x - y) < 0.001 ? y : r
}

// Line Generation:
// For each line, a position (pos) is created using random coordinates within a cubic space defined by the radius. This means the lines will be positioned randomly within a cube.
// An array of points is generated, which will be used to create a curved path for the line. It starts with the initial position pos and 
//.....then iteratively adds random displacement vectors to create a set of points.
// A Catmull-Rom curve is created based on these points, and the curve is further subdivided into 300 equally spaced points. This will be the path that the line follows.
// The line object includes the following properties:
// color: A randomly selected color from the colors array.
// width: The line's width, which is a random value within a range based on the radius.
// speed: The speed at which the line travels, a random value.
// curve: An array of coordinates that make up the path of the line. This array is flattened, meaning that the coordinates are stored as a flat sequence of numbers.

function Lines({ dash, active, count, colors, radius = 50, ResetSlowDown, singlePoemIsActive, firstExplosionComplete, hovered, rand = THREE.MathUtils.randFloatSpread, bIsMobile }) {
  const currentColorsRef = useRef(colors)
  useEffect(() => {
    currentColorsRef.current = colors
    console.log(currentColorsRef.current)
  }, [colors])

  //use memo gleeks out when I try to add the colors to it.
  const lines = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const delay = index * 0.064
      const pos = new THREE.Vector3(rand(radius), rand(radius), rand(radius))
      const points = Array.from({ length: 10 }, () => pos.add(new THREE.Vector3(rand(radius), rand(radius), rand(radius))).clone())
      const curve = new THREE.CatmullRomCurve3(points).getPoints(300)
      return {
        // color: colors[parseInt(colors.length * Math.random())],
        color: currentColorsRef.current[parseInt(currentColorsRef.current.length * Math.random())],
        width: Math.max(radius / 100, (radius / 50) * Math.random()),
        speed: Math.max(0.1, 1 * Math.random()),
        curve: curve.flatMap((point) => point.toArray()),
        delay
      }
    }, [currentColorsRef.current])
  }, [count, radius]) //removing colors stops the re-render but then won't change color

  return lines.map((props, index) => <Fatline key={index} dash={dash} delay={props.delay} active={active} {...props} singlePoemIsActive={singlePoemIsActive} hovered={hovered} ResetSlowDown={ResetSlowDown} firstExplosionComplete={firstExplosionComplete} />)
}

function Fatline({ curve, width, color, speed, dash, active, hovered, ResetSlowDown, firstExplosionComplete, singlePoemIsActive, delay, bIsMobile }) {
  const { viewport, camera } = useThree()
  width = !hovered && !active ? width : width * 2
  const ref = useRef()
  const [slowDown, setSlowDown] = useState(speed)
  let originalSpeed = speed
  const spiralFactor = 0.05
  const [previousMouse, setPreviousMouse] = useState({ x: 0, y: 0 })
  useFrame(( { mouse }, delta) => {
    camera.updateProjectionMatrix()
    let x = (mouse.x * viewport.width) / 2
    let y = (mouse.y * viewport.height) / 2
    setPreviousMouse({ x, y })
    const distanceFromCenter = Math.sqrt(x * x + y * y)
    const lerpThresholdMax = 0.95 * Math.min(viewport.width, viewport.height) // if off screen l/r
    const lerpThresholdMin = 0.4 * Math.min(viewport.width, viewport.height)

    const spiralX = Math.cos(ref.current.position.y * spiralFactor)
    let spiralY = Math.cos(ref.current.position.x * spiralFactor)
    
    const lerpFactor = 2
    x = lerp(previousMouse.x, x, lerpFactor)
    y = lerp(previousMouse.y, y, lerpFactor)
    x *= delay
    y *= (delay / 3)

    //slow down after the burst so it's not as distracting behind the content.
    if(!active && slowDown > 300){
      setSlowDown(speed / 4)
      speed = slowDown
    }
    else if(ResetSlowDown){
      setSlowDown(originalSpeed)
    }
    else{
      if (distanceFromCenter < lerpThresholdMax && distanceFromCenter > lerpThresholdMin && active)
        speed *= 1.01
      else if(!active && hovered)
        speed = 1.01

      if(!active)
        speed = 0.05
      if ((speed > 3 || speed < -2))
        speed = 0.1
    }
    

    //lines internal rotation speed logic, increase on right, decrease on left. (but not as heavily.) (top and bottom for mobile)
    const dashSpeed = 10
    const positionXFactor = ref.current.position.x / (viewport.width / 2)
    const positionYFactor = ref.current.position. y / (viewport.height / 2)
    let speedMultiplier = (positionXFactor > 0 ? (positionXFactor > 0.2 ? 2 : 1.25) : 0.9) + positionXFactor
    if(bIsMobile){
      speedMultiplier = (positionYFactor > 0 ? (positionYFactor > 0.15 ? 2 : 1.25) : 0.9) + positionYFactor
    }
    ref.current.material.dashOffset -= (delta * speed * speedMultiplier) / dashSpeed

    const lerpSpeed =  0.035
    const leftFactor = -x > 0.4 ? 0.4 : -x
    const cursorXFactor = leftFactor / (viewport.width / 2)
    // Define the minimum and maximum `position.z` values
    const minZ = slowDown ? 3 : 2
    const maxZ = 5 
    let newZ = minZ + (maxZ - minZ) * cursorXFactor
    ref.current.position.z = active || ResetSlowDown
      ? MathUtils.lerp(ref.current.position.z, newZ += (spiralY / 4), lerpSpeed)
      : MathUtils.lerp(ref.current.position.z, 4, lerpSpeed * 2.9)
      

    //burst reset on menuItemChange
    if(firstExplosionComplete){
      if(!active && ResetSlowDown){
        ref.current.position.x = lerp(ref.current.position.x * 1.01, x, lerpSpeed * 0.6)
        ref.current.position.y = lerp(ref.current.position.y, y, lerpSpeed * 1.25)
      }
    }

    if(singlePoemIsActive){
      ref.current.position.z = MathUtils.lerp(ref.current.position.z, 0, lerpSpeed * 0.25)
    }

    const leftLimitX = -0.2 * viewport.width
    const rightLimitX = 0.6 * viewport.width
    if (x < leftLimitX) 
      x = leftLimitX
    else if(x > rightLimitX)
      x = rightLimitX

    y += spiralY * delta
    x += spiralX * delta
    ref.current.position.y = lerp(ref.current.position.y, !active ? 0 : y, lerpSpeed * 0.4)
    ref.current.position.x = lerp(ref.current.position.x, !active ? 0 : x + 1, lerpSpeed * 0.4)
    

  })
  return (
    <mesh ref={ref}>
      <meshLineGeometry points={curve} />
      <meshLineMaterial transparent lineWidth={width} color={color} depthWrite={false} dashArray={0.25} dashRatio={dash} toneMapped={false} />
    </mesh>
  )
}

export default Lines