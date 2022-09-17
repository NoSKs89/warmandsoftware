// import * as THREE from 'three'
// import { SVGLoader as loader } from 'three/examples/jsm/loaders/SVGLoader'
// import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react'
// import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber'
// import flatten from 'lodash-es/flatten'
// import { useTransition, useSpring, a, config } from '@react-spring/three'
// import { useGesture } from 'react-with-gesture'
// import clamp from 'lodash-es/clamp'

// const SVG_URL = '../paws-for-my-lover.svg'

// const handleOnClick = (e) => {
//   console.log('click')
//   return false
// }

// const getRatio = (count, camera) => {
//     const svgDpi = 1 / 90 //possibly 1/96
//     let ang_rad = camera.fov * Math.PI / 180
//     let fov_y = camera.position.z * Math.tan(ang_rad / 2) * 2
//     let viewportX = fov_y * camera.aspect
  
//     let ratio = ((svgDpi * viewportX) / count * 0.95) //this *.95 was just to make SURE that it fits in viewports... lazy
//     return ratio
//   }

// // Promise of an SVG parsed into paths 
// // with which the threejs engine will make shapes
// const svgResource = new Promise(resolve =>
//     new loader().load(SVG_URL, shapes => {
//         resolve(flatten(shapes.paths.map((group, index) => {
//             return group.toShapes(true).map(shape => {
//                 const fillColor = group.userData.style.fill
//                 return ({ shape, color: fillColor, index })
//             })
//         }))
//         )
//     })
//   )
  
//   /** 
//    * A very special thanks to @neftaly for open source contribution.
//    * https://gist.github.com/neftaly/7c4d96f1ba37aada7f366b5393e59ddb 
//    * 
//    * Use a shape of the SVG to associate a Mesh Material with a Geometry 
//    */
//    const SvgShape = ({shape, color, index, bFollow}) => {
//     const mesh = useRef()
//     const { viewport, camera, size } = useThree()

//     //write a sequence to translate the diff between ending pos and where the cursor is.

//     useFrame(({ mouse }) => {
//       if(bFollow){
//         // const x = (mouse.x * size.width) / 2
//         // const y = (mouse.y * size.height) / 2
//         const x = (mouse.x * viewport.width) / 2
//         const y = (mouse.y * viewport.height) / 2
//         // console.log('viewport: ' + JSON.stringify(viewport) + '; x: ' + x + '; y: ' + y)
//         //camera.position.x += (state.mouse.x * viewport.width - camera.position.x) * 0.05

//         let vector = new THREE.Vector3(mouse.x, mouse.y, -1).unproject(camera)

//         // let dir = vector.sub(camera.position).normalize()
//         // let distance = -camera.position.z / dir.z
//         // let pos = camera.position.clone().add(dir.multiplyScalar(distance))

//         // console.log('dir: ' + JSON.stringify(dir) + '; distance: ' + distance + '; pos: ' + JSON.stringify(pos))
//         mesh.current.position.set(vector)
//         // mesh.current.position.set(pos.x, pos.y, pos.z)
//         // mesh.current.position.set(x, y, 0)
//         //mesh.current.rotation.set(-y, x, 0)
//       }
//     })
//     return (
//         <mesh
//             ref={mesh}
//             rotation={[0, 0, 0]}
//         >
//             <shapeBufferGeometry attach="geometry" args={[shape]} />
//             <meshBasicMaterial
//               //aspect={window.innerWidth / window.innerHeight}
//                 attach="material"
//                 color={color}
//                 opacity={1}
//                 side={THREE.DoubleSide}
//                 flatShading={true}
//                 depthWrite={true}
//                 /*
//           HACK: Offset SVG polygons by index
//           The paths from SVGLoader Z-fight.
//           This fix causes stacking problems with detailed SVGs.
//         */
//                 polygonOffset
//                 polygonOffsetFactor={index * -0.1}
//             />
//         </mesh>
//     );
//   }

  
// const SingleSVG = (props) => {
//     //load shapes into state
//     const [shapes, setShapes] = useState([])
//     useEffect(() => svgResource.then(setShapes), [])
//     let { camera } = useThree()
//     let ratio = getRatio(props.count, camera)
//     let [posX, posY, posZ] = props.pos
//     const [bFollow, setCursorFollow] = useState(false)

//     //animation for a step. start from above camera and stamp down.
//     const transitions = useTransition(shapes, {
//       from: { position: [posX -2, posY, posZ + 10], scale: [ratio * 4, ratio * 4, ratio * 4], opacity: 1, color: props.color },
//       enter: { position: [posX, posY, posZ], scale: [ratio, ratio, ratio], opacity: 1, color: props.color },
//       order: ['leave', 'enter'],
//       trail: 5,
//       config: config.gentle,
//       lazy: true
//     })
//     return (
//       <>
//       {transitions(({position, scale, color}, item) => (
//           <a.group 
//             color={color} 
//             position={position}
//             scale={scale}
//             onClick={(e) => {
//                 setCursorFollow(!bFollow)
//             }}
//             rotation={[THREE.Math.degToRad(0), THREE.Math.degToRad(180), THREE.Math.degToRad(180)]}>
//             {shapes.map(item2 =>  
//                 <SvgShape key={item2.shape.uuid} {...item2} color={props.color} bFollow={bFollow}/>
//             )}
//         </a.group>
//       ))}
//         </>
//     )
//   }

//   //attempt changing from a translate3d css to moving the actual position of the single svg.
//   const SVGCursor = (props) => {
//       return (
//             <SingleSVG pos={[0, 0, 0]} count={props.count} color="teal"/>
//       )
//   }

//   export default SVGCursor

import React, { Suspense, useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import clamp from 'lodash-es/clamp'
import { useSpring, a } from 'react-spring'
import { useGesture } from 'react-with-gesture'
import { Canvas, useThree, useFrame } from "react-three-fiber"

import hkUseMousePosition from './hkUseMousePosition'
import { AutoComplete } from 'antd'
import { Content } from 'antd/lib/layout/layout'

const SVG_URL = '../paws-for-my-lover.svg'
const SVG_PAW_PATH = 'M29.2,16.6a13.34,13.34,0,0,1,2.1,5.5,7,7,0,0,1-.1,2.5,2.68,2.68,0,0,1-2.1,2,3.78,3.78,0,0,1-2.1-.4,7.27,7.27,0,0,0-2.1-.6,5.8,5.8,0,0,0-3.6,1c-1.3.8-3.3,1.9-4.8.5a5.38,5.38,0,0,1-.9-1.2c-1.7-3.1,0-8.3,2.1-11.1,2.5-3.3,7.2-3.1,10-.2A20.68,20.68,0,0,1,29.2,16.6Zm-16.69-13c1.54-.87,3.91.41,5.3,2.86s1.26,5.14-.28,6S13.62,12,12.24,9.57,11,4.43,12.51,3.56Zm8,2.32c.19-2.81,1.81-5,3.63-4.87s3.14,2.5,2.95,5.31-1.82,5-3.63,4.87S20.34,8.69,20.53,5.88ZM4.72,13.36c1.08-2,3.94-2.67,6.38-1.38s3.54,4,2.46,6.05S9.62,20.7,7.18,19.41,3.63,15.41,4.72,13.36Zm24-6.25c1.8-2.45,4.78-3.31,6.64-1.93s1.92,4.47.12,6.91S30.73,15.4,28.86,14,26.94,9.55,28.75,7.11ZM50.1,43.5a13.38,13.38,0,0,1-1.5,5.7,6.15,6.15,0,0,1-1.6,2,2.8,2.8,0,0,1-2.9.4A5.72,5.72,0,0,1,42.6,50a7.94,7.94,0,0,0-1.4-1.8,5.39,5.39,0,0,0-3.5-1.3c-1.6-.1-3.8-.3-4.2-2.4a3.79,3.79,0,0,1,0-1.5c.4-3.5,4.9-6.8,8.2-7.8,4-1.2,7.6,1.7,8.2,5.7A5.65,5.65,0,0,1,50.1,43.5ZM40.55,27.86c.32-2.8,2-4.91,3.75-4.71s2.93,2.63,2.61,5.43-2,4.9-3.75,4.71S40.24,30.66,40.55,27.86Zm8.86,1.81c1.8-2.17,4.4-3,5.8-1.81s1.07,3.87-.73,6-4.39,3-5.8,1.81S47.61,31.83,49.41,29.67ZM38.7,29.3c.9,1.8.8,4.1-1.2,5.1-2.6,1.3-5.3-1.6-5.3-4.1a3.25,3.25,0,0,1,3.3-3.4A3.79,3.79,0,0,1,38.7,29.3Zm16.61,6.21c2.9-.92,5.81.12,6.52,2.33s-1.07,4.75-4,5.67-5.81-.12-6.51-2.33S52.42,36.43,55.31,35.51Z'
const SVG_SINGLEPAW_PATH = 'M23.5,14c-2.4-3.2-7.1-3.9-10-1c-2.4,2.5-4.7,7.5-3.4,10.8c0.3,0.4,0.4,1,0.8,1.3c1.3,1.6,3.4,0.7,4.8,0.1,c1.1-0.5,2.5-0.9,3.7-0.6c0.9,0.3,1.3,0.3,2,0.8c0.6,0.4,1.3,0.7,2,0.6c1,0,1.9-0.8,2.3-1.7c0.3-0.8,0.4-1.7,0.4-2.5,c0-1.8-0.6-3.9-1.5-5.7C24.3,15.3,23.8,14.5,23.5,14z'

//todo:
//currently clickable region requires a lot of padding.
//change the new XY to spring back to start position.
//combine svgs.

const doFakeDrag = (ele, mousePos) => {
    let element = document.getElementById(ele)
    element.dispatchEvent(new DragEvent('dragstart', {
        // clientX: element.getBoundingClientRect().left,
        // clientY: element.getBoundingClientRect().top,
        clientX: mousePos.x,
        clientY: mousePos.y,
        bubbles: true,
        cancelable: true
    }))
    element.dispatchEvent(new DragEvent('dragend', {
        clientX: mousePos.x + 50,
        clientY: mousePos.y + 50,
        bubbles: true,
        cancelable: true
    }))
    element.dispatchEvent(new DragEvent('dragend', {
        bubbles: true,
        cancelable: true
    }))
}

const ThisSVG = ({svg_path, color}) => {

    let svg1 = document.getElementById('svg')
    // console.log('width: ' + svg1.clientWidth + '; height: ' + svg1.clientHeight) //960 | 768
    // console.log('viewport: ' + window.innerWidth + ' ' + window.innerHeight) // 1920 | 937
  return (
    <svg 
        //displayed width of the rectangluar viewport (not width of its coordinate system)
        width="100%" 
        //the viewbox attribute specifies a rectangle in user space which is mapped to the bounds of the viewport for the SVG element (not browser viewport)
        viewBox="0 0 250 250"
        //class="svg"    
        id="svg"
        // style={{borderLeft: '-50%', paddingTop: '-50%', display: 'block', alignSelf: 'center'}}
        style={{margin: 'auto', display: 'inline-block', alignItems: 'center !important'}}
    >
      <defs>
      <filter id="f1" x="0" y="0">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.1" />
      </filter>
      </defs>
      <path filter="url(#f1)" d={svg_path} fill={color} style={{display: 'flex', justifyContent: 'center'}} />
    </svg>
  )
}

const Pull = (props) => {
    const [bFollow, setCursorFollow] = useState(false)
    const mousePos = hkUseMousePosition()
    let offsetX = 185
    let offsetY = 165

    let svg = document.getElementById('svg3')
    //useSpring turns values into animated-values.
    const [{ xy }, set] = useSpring(() => ({ xy: [0,0] }))
    const bind = useGesture(({ down, delta, velocity}) => {
        velocity = clamp(velocity, 1, 8)
        velocity = velocity === 1 ? 8 : velocity
        console.log(delta)
        set({ xy: down ? delta : [0, 0], config: { mass: velocity, tension: 500 * velocity, friction: 50 } })
    })


    //INSTEAD OF ALL THIS.
    //The problem seems to be the fact that bfollow is toggling it STRAIGHT back to 0 immediately.
    //instead create a function that interpolates or translates it back to x when setting the onclick...

    return (
        <a.div id="svg3" className="svg" {...bind()} 
        //style={ !bFollow ? { transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`) } : { transform: xy.interpolate((x, y) =>  `translate3d(${mousePos.x - offsetX}px,${mousePos.y - offsetY}px,0)`)} } 
        style={ { transform: xy.interpolate((x, y) =>  `translate3d(${!bFollow ? x : mousePos.x - offsetX}px,${!bFollow ? y : mousePos.y - offsetY}px,0)`)} } 
        // <a.div className="svg" style={ { transform:  `translate3d(${mousePos.x}px,${mousePos.y}px,0)`} } 
            onClick={(e) => {
                let bound = svg.getBoundingClientRect()
                // console.log(e.clientX + ' ' + JSON.stringify(bound)) 
                offsetX = bound.width / 2
                offsetY = bound.height / 2
                // bind()
                // doFakeDrag('svg3', { x: mousePos.x - offsetX, y: mousePos.y - offsetY})

                setCursorFollow(!bFollow)
                if(bFollow === false){
                    document.body.style.cursor = 'none'
                    svg.style.cursor = 'none'
                }
                else{
                    svg.style.top += 3
                    svg.dispatchEvent(new Event('mouseup'))
                    doFakeDrag('svg3', { x: mousePos.x - offsetX, y: mousePos.y - offsetY})
                    // set({ xy: [0, 0], config: { mass: 1, tension: 250, friction: 100 }})
                    document.body.style.cursor = 'cursor'
                    svg.style.cursor = 'grab'
                }
            }}
        >
            <ThisSVG  svg_path={props.path ?? SVG_PAW_PATH} color={props.color ?? "galaxy"} />
        </a.div>
    )
}

const SVGCursor2 = (props) => {
    return (
        <Suspense fallback={null}>
            <Pull svg_path={props.path ?? SVG_PAW_PATH} color={props.color ?? "galaxy"}
            />
        </Suspense>
    )
}

export default SVGCursor2