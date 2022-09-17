import * as THREE from 'three'
import { SVGLoader as loader } from 'three/examples/jsm/loaders/SVGLoader'
import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber'
import flatten from 'lodash-es/flatten'
import { useTransition, useSpring, a, config } from '@react-spring/three'
import { Controls, useControl } from 'react-three-gui'
import { PositionalAudio } from '@react-three/drei'

const SVG_URL = '../paws-for-my-lover.svg'
const colorArray = ['#E85858', '#EB826B', '#D9E3DA', '#3D837B', '#C2C2B4']

const rand = (min, max) => {
    if(max === undefined){
        max = min
        min = 0
    }
    return Math.floor(Math.random() * (max - min) + min)
}

const randFromColorArray = Math.floor(Math.random() * colorArray.length) //this isn't working quite like expected.

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
  const mesh = useRef()
  return (
      <mesh
          ref={mesh}
      >
          <shapeBufferGeometry attach="geometry" args={[shape]} />
          <meshBasicMaterial
              aspect={window.innerWidth / window.innerHeight}
              attach="material"
              color={new THREE.Color(colorArray[randFromColorArray])}
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

//todo: find out best way to scale and center SVG. once we know that we can determine how to add multiple rows

//steps:
//1. determine size of canvas (width and height)
//2. determine size of svg and determine how many rows/columns could fit
//3. on frame, determine when it should walk.
//4. after random walk is complete in 2d, pop out the z axis and do a camera rotate
//5. after a short time, pop back to 2d, recolor all black and then remove rows beginning at the top

const SingleSVG = (props) => {
  //load shapes into state
  const [shapes, setShapes] = useState([])
  useEffect(() => svgResource.then(setShapes), [])

  let [posX, posY, posZ] = props.pos
  //animation for a step. start from above camera and stamp down.
  const transitions = useTransition(shapes, {
    from: { position: [posX -2, posY, posZ + 10], scale: [0.044,0.044,0.044], opacity: 1 },
    enter: { position: [posX, posY, posZ], scale: [0.025,0.025,0.025], opacity: 1 },
    order: ['leave', 'enter'],
    trail: 5,
    config: config.gentle,
    lazy: true
  })
  return (
    <>
    {transitions(({position, scale}, item) => (
        <a.group 
          // color={THREE.MathUtils.randInt(0, 0xffffff)} 
          color={new THREE.Color('white')} 
          position={position}
          scale={scale}
          rotation={[THREE.Math.degToRad(0), THREE.Math.degToRad(180), THREE.Math.degToRad(180)]}>
          {shapes.map(item2 =>  
              <SvgShape key={item2.shape.uuid} {...item2} />
          )}
      </a.group>
    ))}
      </>
  )
}

const SVGWalker = (props) => {
    const { size } = useThree()
    let offset = props.offset
    let positionArray = []
    let additionCount = 0

    const [positions, setPositions] = useState(positionArray)
    //need to create an object {[position], bool occupied, direction: null}
    //can set direction when the switch determines where to place the next one (create a can place function that checks or calls a new random)

    //then we set a global variable last position and base the direction off that?
    
    

    //random walker: 4 choices r/l/u/d on each frame
    const speedRatio = props.speedRatio ?? 4
    let centerX = size.width/2, centerY = size.height/2, x = 0, y = 0

    //another approach is generate a grid of booleans and toggle visible based on grid..

    let positionGrid = []
    //this creates an array of 1's to flip which will guide the walker
    // 1 - 1 - 1
    // 1 - 1 - 1
    // 1 - 1 - 1
    useEffect(() => {
      const generateGrid = (w, h, spacing, offset) => {
        for(let x = offset; x<w-offset; x+=spacing){
            let row = []
            for(let y = offset; y<h-offset; y+=spacing){
                row.push(rand(1,1))
            }
            positionGrid.push(row)
          }
        }
      generateGrid(size.width, size.width, offset, offset)
      // console.log('position grid: ' + positionGrid)
    })
    
    useEffect(() => {
      const interval = setInterval(() => {
        if(additionCount <= props.count){
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
          console.log('random: ' + r + '; x: ' + x + '; y: ' + y)
          additionCount++
          setPositions(positions => [...positions, [x,y,0]])
        }
        else 
        { 
          setPositions([[]])
          additionCount = 0
        }
      }, 500);
      return () => clearInterval(interval)
    }, [])
    

    // console.log('props: ' + JSON.stringify(props))
    console.log('positions: ' + positions)


    return (
      positions.map((position, index) =>
        <SingleSVG key={index} pos={position} scale={props.scl}  /> )
    )
}

export default SVGWalker