import * as THREE from 'three'
import { SVGLoader as loader } from 'three/examples/jsm/loaders/SVGLoader'
import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber'
import flatten from 'lodash-es/flatten'
import { useTransition, useSpring, a, config } from '@react-spring/three'

const SVG_URL = '../paws-for-my-lover.svg'
// const SVG_URL = '../heart.svg'
const colorArray = ['#E85858', '#EB826B', '#D9E3DA', '#3D837B', '#C2C2B4']
let alreadyRendered = false

const rand = (min, max) => {
    if(max === undefined){
        max = min
        min = 0
    }
    return Math.floor(Math.random() * (max - min) + min)
}

const getRatio = (count, camera) => {
  const svgDpi = 1 / 90 //possibly 1/96
  let ang_rad = camera.fov * Math.PI / 180
  let fov_y = camera.position.z * Math.tan(ang_rad / 2) * 2
  let viewportX = fov_y * camera.aspect

  let ratio = ((svgDpi * viewportX) / count * 0.95) //this *.95 was just to make SURE that it fits in viewports... lazy
  return ratio
}

// Promise of an SVG parsed into paths 
// with which the threejs engine will make shapes
const svgResource = new Promise(resolve =>
  new loader().load(SVG_URL, shapes => {
      resolve(flatten(shapes.paths.map((group, index) => {
          return group.toShapes(true).map(shape => {
              const fillColor = group.userData.style.fill
              return ({ shape, color: fillColor, index })
          })
      }))
      )
  })
)

/** 
 * A very special thanks to @neftaly for open source contribution.
 * https://gist.github.com/neftaly/7c4d96f1ba37aada7f366b5393e59ddb 
 * 
 * Use a shape of the SVG to associate a Mesh Material with a Geometry 
 */
 const SvgShape = ({shape, color, index}) => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const mesh = useRef()
  // useFrame(() => (mesh.current.rotation.x += 0.01))

  // if(mesh.current && !alreadyRendered){
  //   // console.log(JSON.stringify(mesh))
  //   const bbox = new THREE.Box3().setFromObject(mesh.current);
  //   const sizze = bbox.getSize(new THREE.Vector3())
  //   const sphere = bbox.getBoundingSphere(new THREE.Sphere())
  //   const { center, radius } = sphere
  //   console.log('shape size: ' + JSON.stringify(sizze))
  //   // console.log('sphere: ' + JSON.stringify(sphere))
  //   // console.log('bbox: ' + JSON.stringify(bbox))
  //   // console.log('box: ' + JSON.stringify(sphere))
  //   alreadyRendered = true
  // }
  return (
      <mesh
          ref={mesh}
          rotation={[0, 0, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => setActive(!active)}
          scale={active ? 0.01 : 1}
      >
          <shapeBufferGeometry attach="geometry" args={[shape]} />
          <meshBasicMaterial
            //aspect={window.innerWidth / window.innerHeight}
              attach="material"
              color={hovered ? "lightcoral" : color}
              opacity={1}
              side={THREE.DoubleSide}
              flatShading={true}
              depthWrite={true}
              /*
        HACK: Offset SVG polygons by index
        The paths from SVGLoader Z-fight.
        This fix causes stacking problems with detailed SVGs.
      */
              polygonOffset
              polygonOffsetFactor={index * -0.1}
          />
      </mesh>
  );
}

const SingleSVG = (props) => {
  //load shapes into state
  const [shapes, setShapes] = useState([])
  useEffect(() => svgResource.then(setShapes), [])
  let { camera } = useThree()
  let ratio = getRatio(props.count, camera)
  let [posX, posY, posZ] = props.pos

  //animation for a step. start from above camera and stamp down.
  const transitions = useTransition(shapes, {
    from: { position: [posX -2, posY, posZ + 10], scale: [ratio * 4, ratio * 4, ratio * 4], opacity: 1, color: props.color },
    enter: { position: [posX, posY, posZ], scale: [ratio, ratio, ratio], opacity: 1, color: props.color },
    order: ['leave', 'enter'],
    trail: 5,
    config: config.gentle,
    lazy: true
  })
  return (
    <>
    {transitions(({position, scale, color}, item) => (
        <a.group 
          color={color} 
          position={position}
          scale={scale}
          rotation={[THREE.Math.degToRad(0), THREE.Math.degToRad(180), THREE.Math.degToRad(180)]}>
          {shapes.map(item2 =>  
              <SvgShape key={item2.shape.uuid} {...item2} color={props.color}/>
          )}
      </a.group>
    ))}
      </>
  )
}

const SVGWalker = (props) => {
    const { viewport } = useThree()
    let offset = viewport.width / props.count
    let positionArray = []
    let additionCount = 0
    const [positions, setPositions] = useState(positionArray)

    //todo:
    //HAVE THE HTML CONTENT navigation work with the pads... have a constant top and bottom pad row.. when navigating, the old page walks out with paws, and the new page walks in left to right with them
    //this would in fact be a good exercise on how to have actual sites embedded. just have a 2 page site to navigate between.
    // the top and bottom expand to create lanes for the paws to move depending on page.

    const speedRatio = props.speedRatio ?? 4
    let centerX = viewport.width/2, centerY = viewport.height/2, viewportWPadding = (viewport.width) / 2 * 0.025, viewportHPadding = (viewport.height) / 2 * 0.05, fullLeft = -(viewport.width) / 2 + viewportWPadding, fullTop = (viewport.height) / 2 - viewportHPadding
    let x = props.isRandom ? 0 : fullLeft, y = props.isRandom ? 0 : fullTop

    //need to determine offset based on count? if 10 of this scale will on a browser, how wide should it be? somehow work in the ratio
    useEffect(() => {
      const interval = setInterval(() => {
        if(additionCount === 0 && additionCount <= props.count){
            additionCount++
            props.isRandom ? setPositions(positions => [...positions, [x,y,0]]) : setPositions(positions => [...positions, [x,y,0], [x, -y + (offset * 0.5), 0]])
        }
        else if(additionCount <= props.count - 1){
          if(props.isRandom){
            let r = rand(0, 4)
            switch(r) {
              case 0:
                x = x + offset
                break
              case 1:
                x = x - offset
                break
              case 2:
                y = y + offset
                break
              case 3:
                y = y - offset
                break
              default:
            }
            // console.log('random: ' + r + '; x: ' + x + '; y: ' + y)
          }
          else{
            x = x + offset
            y = fullTop
          }
          additionCount++
          setPositions(positions => [...positions, [x,y,0], [x, -y + (offset * 0.5), 0]])
        }
        else
        { 
          setTimeout(() => {
            setPositions(positionArray)
            x = props.isRandom ? 0 : fullLeft
            y = props.isRandom ? 0 : fullTop
            additionCount = 0
          }, 4000)
        }
      }, 500);
      return () => clearInterval(interval)
    }, [])
    
    // console.log('props: ' + JSON.stringify(props))
    // console.log('positions: ' + positions)

    return (
      positions.map((position, index) =>
      {
        let randFromColorArray = Math.floor(Math.random() * colorArray.length) //this isn't working quite like expected.
        return (<SingleSVG key={index} pos={position} scale={props.scl} count={props.count} color={new THREE.Color(colorArray[randFromColorArray])}  /> ) 
      })
    )
}

export default SVGWalker