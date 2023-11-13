import * as THREE from 'three'
import { useMemo, useRef, useState, useEffect, ReactNode, Suspense } from 'react'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import { act } from 'react-dom/test-utils'
import { Selection, Select, EffectComposer, Bloom, Noise, Vignette, SelectiveBloom } from '@react-three/postprocessing'

extend({ MeshLineGeometry, MeshLineMaterial })

const lerp = (x, y, a) => {
  const r = (1 - a) * x + a * y 
  return Math.abs(x - y) < 0.001 ? y : r
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

const colorLerp = (a, b, t) => {
  return a * (1 - t) + b * t
}

const lerpColors = (colors, t) => {
  const segmentCount = colors.length - 1
  const segmentIndex = t * segmentCount
  const segmentFloor = Math.floor(segmentIndex)
  const segmentCeil = Math.ceil(segmentIndex)
  const segmentT = segmentIndex - segmentFloor
  const colorFloor = Array.isArray(colors[segmentFloor]) ? colors[segmentFloor] : [0, 0, 0]
  const colorCeil = Array.isArray(colors[segmentCeil]) ? colors[segmentCeil] : [0, 0, 0]
  return colorFloor.map((channel, index) =>
    colorLerp(channel, colorCeil[index], segmentT)
  )
}
// Line Generation:
// For each line, a position 
//(pos) is created using random coordinates within a cubic space defined by the radius. This means the lines will be positioned randomly within a cube.
//(points) An array of points is generated, which will be used to create a curved path for the line. It starts with the initial position pos and 
//.....then iteratively adds random displacement vectors to create a set of points.
// A Catmull-Rom curve is created based on these points, and the curve is further subdivided into 300 equally spaced points. This will be the path that the line follows.
// The line object includes the following properties:
// color: A randomly selected color from the colors array.
// width: The line's width, which is a random value within a range based on the radius.
// speed: The speed at which the line travels, a random value.
// curve: An array of coordinates that make up the path of the line. This array is flattened, meaning that the coordinates are stored as a flat sequence of numbers.

function Lines({ dash, active, count, colors, radius = 50, ResetSlowDown, singlePoemIsActive, firstExplosionComplete, hovered, rand = THREE.MathUtils.randFloatSpread, bIsMobile }) {
  let radiusFactor = 0.025
  //use memo gleeks out when I try to add the colors to it.
  const [minZ, setMinZ] = useState(100)
  const [maxZ, setMaxZ] = useState(-100)
  useEffect(() => {
    console.log('minZ: ' + minZ + '; maxZ: ' + maxZ)
  }, [minZ, maxZ])
  const lines = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const colorIndex = (index + 1) / count
      const lerpedColor = lerpColors(colors, colorIndex)
      const delay = index + 1
      radiusFactor += (delay * 0.00064)
      const pos = new THREE.Vector3(rand(radius * radiusFactor), rand(radius * radiusFactor), rand(radius * radiusFactor));
      const points = Array.from({ length: delay <= 50 ? 20 : 10 }, () => pos.add(new THREE.Vector3(rand(radius * radiusFactor), rand(radius * radiusFactor), rand(radius * radiusFactor))).clone());
      const curve = new THREE.CatmullRomCurve3(points).getPoints(delay <= 50 ? 20 : 30)
      return {
        color: colors[parseInt(colors.length * Math.random())],
        // color: lerpedColor,
        width: Math.max(radius / 100, (radius / 50) * Math.random()),
        speed: Math.max(0.1, 1 * Math.random()),
        curve: curve.flatMap((point) => point.toArray()),
        delay
      }
    }, [colors])
  }, [count, radius]) //removing colors stops the re-render but then won't change color

  return lines.map((props, index) => <Fatline key={index} minZ={minZ} setMinZ={setMinZ} maxZ={maxZ} setMaxZ={setMaxZ} dash={dash} delay={props.delay} active={active} {...props} singlePoemIsActive={singlePoemIsActive} hovered={hovered} ResetSlowDown={ResetSlowDown} firstExplosionComplete={firstExplosionComplete} />)
}

const calculateColorInterpolation = (index, max) => {
  // If the index is in the first 20, use full strength
  if (index <= 20) {
    return 1.0
  } else {
    // Otherwise, make the transition more gradual
    const gradualFactor = (index - 20) / (max - 20) // Adjust based on your needs
    return 1.0 - gradualFactor * 1.9 // Adjust the multiplier for the desired gradual effect
  }
}

// '#d62828': This is a shade of red. It's a deep and intense red color.
// '#f77f00': This is a shade of orange. It's a warm and vibrant orange color.
// '#003049': This is a shade of dark blue. It's a deep and rich blue color.
const AdjustSpeedAndSpiral = (max, index, lerpSpeed, spiralX, spiralY, spiralZ, dashSpeed) => {
  let lerpedColor
  const colorEnd = new THREE.Color('white') //d62828
  const colorStart = new THREE.Color('#f77f00') //f77f00 '#d62828','#f77f00', '#003049'
  const colorMid = new THREE.Color('#d62828')
  const colorWhite = new THREE.Color('#003049')
  for(let i = max; i > 1; i--){
    if(index % i === 0){
      let minSpeed = 10
      let maxSpeed = 80
      if(i <= minSpeed)
        lerpSpeed *= 20 / (minSpeed)
      else if(i >= maxSpeed - 20)
        lerpSpeed *= 20 / (maxSpeed / 2)
      else
        lerpSpeed *= 20 / i

      spiralX /= 9 / i
      spiralY /= 9 / i
      spiralZ /= 9 / i

      if(i <= minSpeed - 3)
        dashSpeed /= 15 / (minSpeed * 0.95)

      
      const interpolationFactor = calculateColorInterpolation(index, max) // Adjust this based on your color interpolation needs
      if(index >= 20 && index <= 50){
        lerpedColor = colorMid.clone().lerp(colorStart, 0)
      } 
      else if(index >= 85){
        lerpedColor = colorWhite.clone().lerp(colorEnd, 0)
      }
      else
        lerpedColor = colorStart.clone().lerp(colorEnd, interpolationFactor)
    }
  }  
  return {lerpSpeed, spiralX, spiralY, spiralZ, dashSpeed, lerpedColor }
}

function Fatline({ curve, width, color, speed, dash, active, hovered, ResetSlowDown, firstExplosionComplete, singlePoemIsActive, delay, bIsMobile, c = new THREE.Color(), minZ, maxZ, setMinZ, setMaxZ }) {
  const { viewport, camera } = useThree()
  width = !hovered && !active ? width : width * 2
  const ref = useRef()
  const lightsRef = useRef()
  const [slowDown, setSlowDown] = useState(speed)
  let originalSpeed = speed
  let spiralFactor = 50
  const [zoomBack, setZoomBack] = useState(false)
  const colorEnd = new THREE.Color('#003049')
  const colorStart = new THREE.Color('#f77f00')
  useFrame(( { mouse }, delta) => {
    camera.updateProjectionMatrix()
    let x = (mouse.x * viewport.width) / 2
    let y = (mouse.y * viewport.height) / 2
    const distanceFromCenter = Math.sqrt(x * x + y * y)
    const lerpThresholdMax = 0.95 * Math.min(viewport.width, viewport.height) // if off screen l/r
    const lerpThresholdMin = 0.4 * Math.min(viewport.width, viewport.height)

    //slow down after the burst so it's not as distracting behind the content.
    if(!active && slowDown > 300){
      setSlowDown(speed / 4)
      speed = slowDown
    }
    else if(ResetSlowDown){
      setSlowDown(originalSpeed)
    }
    else{
      if (distanceFromCenter < lerpThresholdMax && distanceFromCenter > lerpThresholdMin && active){
        speed *= 1.01
      }
      else if(!active && hovered)
      {
        speed = 1.01
      }

      if(!active)
        speed = 0.05
      if ((speed > 3 || speed < -2))
        speed = 0.1
    }

    //lines internal rotation speed logic, increase on right, decrease on left. (but not as heavily.) (top and bottom for mobile)
    const dashSpeedpre = 50
    const positionXFactor = ref.current.position.x / (viewport.width / 2)
    const positionYFactor = ref.current.position. y / (viewport.height / 2)
    let speedMultiplier = (positionXFactor > 0 ? (positionXFactor > 0.4 ? 1 : 0.4) : 0.9) + positionXFactor
    if(bIsMobile){
      speedMultiplier = (positionYFactor > 0 ? (positionYFactor > 0.15 ? 2 : 1.25) : 0.9) + positionYFactor
    }

    //change attributes of the clusters based on the index of the cluster
    let spiralXpre = Math.sin(ref.current.position.y * spiralFactor)
    let spiralYpre = Math.sin(ref.current.position.x * spiralFactor)
    let spiralZpre = Math.sin(ref.current.position.z * spiralFactor)
    let lerpSpeedpre =  0.035
    let { dashSpeed, lerpSpeed, spiralX, spiralY, spiralZ, lerpedColor } = AdjustSpeedAndSpiral(100, delay, lerpSpeedpre, spiralXpre, spiralYpre, spiralZpre, dashSpeedpre)
    ref.current.material.dashOffset -= (delta * speed * speedMultiplier) / dashSpeed
    
    //keep them from going too far off screen
    const leftLimitX = -0.425 * viewport.width
    const rightLimitX = 0.45 * viewport.width
    if (x <= leftLimitX) 
      x = leftLimitX
    else if(x >= rightLimitX)
      x = rightLimitX

    const topLimitY = viewport.height * 0.4
    const botLimitY = viewport.height * -0.4
    if(y >= topLimitY)
      y = topLimitY 
    else if(y <= botLimitY)
      y = botLimitY


    let deltaMod = 50
    y += spiralY * (delta / deltaMod)
    x += spiralX * (delta / deltaMod)
    ref.current.position.y = lerp(ref.current.position.y, !active ? 0 : y, lerpSpeed * 0.4)
    ref.current.position.x = lerp(ref.current.position.x, !active ? 0 : x, lerpSpeed * 0.4)

    ref.current.position.z = active || ResetSlowDown
      ? (setZoomBack ? MathUtils.lerp(ref.current.position.z, 0, lerpSpeed) : MathUtils.lerp(ref.current.position.z, ref.current.position.z += spiralZ * (delta / deltaMod), lerpSpeed))
      : MathUtils.lerp(ref.current.position.z, 4, lerpSpeed * 2.9)

    //zoom backwards during poems
    if(singlePoemIsActive){
      ref.current.position.z = MathUtils.lerp(ref.current.position.z, 0, explosionLerpSpeed * 0.25)
    }
    
    //burst reset on menuItemChange
    const explosionLerpSpeed = 0.125
    if(firstExplosionComplete){
      if(!active && ResetSlowDown){
        ref.current.position.x = lerp(ref.current.position.x * 1.03, x, explosionLerpSpeed * 0.6)
        ref.current.position.y = lerp(ref.current.position.y, y, explosionLerpSpeed * 1.25)
        ref.current.position.z = lerp(ref.current.position.z, ref.current.position.z += spiralZ * (delta / deltaMod), explosionLerpSpeed)
        ref.current.material.dashOffset -= (delta * speed * speedMultiplier) / (dashSpeed / 2)
      }
    }
    ref.current.material.color.set(lerpedColor)
  })
  useEffect(() => {
    console.log('active: ' + active + '; slowdown: ' + ResetSlowDown)
    if(active && ResetSlowDown){
      setZoomBack(true)
    }
    else if(active && !ResetSlowDown){
      setZoomBack(false)
    }
  }, [active, ResetSlowDown])
  return (
    <>
    <mesh ref={ref}>
      <meshLineGeometry points={curve} />
      <meshLineMaterial transparent lineWidth={width} color={color} depthWrite={false} dashArray={0.25} dashRatio={dash} toneMapped={false} />
    </mesh>
    </>
  )
}

export default Lines