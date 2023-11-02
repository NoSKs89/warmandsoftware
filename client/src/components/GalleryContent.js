import * as THREE from 'three'
import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Image, ScrollControls, Scroll, useScroll, Text, Text3D } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'
import c1 from '../images/Collage/1.jpg'
import c2 from '../images/Collage/2.jpg'
import c3 from '../images/Collage/3.jpg'
import c4 from '../images/Collage/4.jpg'
import c5 from '../images/Collage/5.jpg'
import c6 from '../images/Collage/6.jpg'
import c7 from '../images/Collage/7.jpg'
import c8 from '../images/Collage/8.jpg'
import c9 from '../images/Collage/9.jpg'
import c10 from '../images/Collage/10.jpg'
import Box from '../components/Box'
import bagelFatOne from '../fonts/bagel_fat_one.json'
import { text } from '@fortawesome/fontawesome-svg-core'
// import { damp } from 'maath/dist/declarations/src/easing'

//why does this fail?
// const imageFolder = '../images/Collage';
// const imageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const urlArray =  imageNumbers.map((u) => `${imageFolder}/${u}.jpg`)
const artTitles = ['Higher Ground', 'Divine Chord', 'Desire', 'Unseen Hands', 'Trickle Down', 'Breathwork (left)', 'Mythos v Logos', 'Untitled', 'Grow and Sleep', 'Literally']
const damp = THREE.MathUtils.damp
//allows us to keep track of which were clicked via proxy
const state = proxy({
  clicked: null,
  urls: [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10]
})

function Item({ index, position, scale, showGallery, onImgClick, c = new THREE.Color(), ...props }) {
  const ref = useRef()
  const scroll = useScroll()
  const { clicked, urls } = useSnapshot(state)
  const [hovered, hover] = useState(false)
  const [everyOther, setEveryOther] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const click = (index) => {
    setClickCount((prevCount) => prevCount + 1)
    if (clickCount % 2 === 1) {
      setEveryOther(!everyOther)
    }
    onImgClick(index)    
    (state.clicked = index === clicked ? null : index)
    console.log('clicked...')
  } 
  const over = () => hover(true)
  const out = () => hover(false)
  const dampSpeed = 2
  useLayoutEffect(() => void (ref.current.material.needsUpdate = true), [ref])
  useFrame((state, delta) => {
    if(showGallery){
      const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)

      //changes the scaling (size) of the items based on their scrolled position or whether it is clicked
      ref.current.material.scale[1] = ref.current.scale.y = damp(ref.current.scale.y, clicked === index ? 5 : 4 + y, 8, delta)
      ref.current.material.scale[0] = ref.current.scale.x = damp(ref.current.scale.x, clicked === index ? 4.7 : scale[0], 6, delta)
      
      //this is super slick. controls the x-axis position of the objects based on whether it is to the left of, right of, or is the clicked object. 
      // if (clicked !== null && index < clicked) ref.current.position.x = damp(ref.current.position.x, position[0] - 2, 6, delta)
      // if (clicked !== null && index > clicked) ref.current.position.x = damp(ref.current.position.x, position[0] + 2, 6, delta)
      // if (clicked === null || clicked === index) ref.current.position.x = damp(ref.current.position.x, position[0], 6, delta)
      
      const arcRadius = 1.75 // how far from the center we are circling
      const arcAngle = 180 // Adjust the angle (in degrees) of the circular arc
      let maxZ = -Infinity
      if (clicked !== null) {
        const clickedX = position[0];
        const clickedZ = position[2];
        const angle = ((index - clicked) * arcAngle) / 2

        const newX = clickedX + arcRadius * Math.cos((angle * Math.PI) / 180)
        const newZ = clickedZ - arcRadius * Math.sin((angle * Math.PI) / 180)
        
        // Calculate the distance from the center of the arc for each item
        const distanceFromCenter = Math.sqrt(Math.pow(newX - clickedX, 2) + Math.pow(newZ - clickedZ, 2))
        
        // Adjust the Z position based on distance
        maxZ = newZ + distanceFromCenter;
        ref.current.position.x = damp(ref.current.position.x, newX, dampSpeed, delta)
        ref.current.position.z = damp(ref.current.position.z, maxZ, dampSpeed, delta)

        if (index === clicked) {
          // Ensure that the clicked item is centered and has the maximum Z value
          ref.current.position.x = damp(ref.current.position.x, clickedX, dampSpeed, delta)
          ref.current.position.z = damp(ref.current.position.z, maxZ + 1, dampSpeed, delta) // Set maxZ to be greater for the clicked item
        }

        // if (index < clicked) {
        //   ref.current.rotation.y = damp(ref.current.rotation.y, (clicked - index) * 1.2, dampSpeed, delta)
        // } else if (index > clicked) {
        //   ref.current.rotation.y = damp(ref.current.rotation.y, (index - clicked) * 1.2, dampSpeed, delta)
        // }
        // else {
        //   ref.current.rotation.y = damp(ref.current.rotation.y, 0, dampSpeed, delta)
        // }
      } else {
        // Return all items to their default positions
        ref.current.position.x = damp(ref.current.position.x, position[0], dampSpeed, delta)
        ref.current.position.z = damp(ref.current.position.z, position[2], dampSpeed, delta)
        ref.current.rotation.y = damp(ref.current.rotation.y, 0, dampSpeed, delta)
      }

      //adjust the greyscale based on being hovered/clicked or near the Y (scrolled) position
      ref.current.material.grayscale = damp(ref.current.material.grayscale, hovered || clicked === index ? 0 : Math.max(0, 1 - y), dampSpeed, delta)

      ref.current.material.zoom = damp(ref.current.material.zoom, hovered ? (clicked ? 1.1 : 1.2) : 1, dampSpeed, delta)

      //if hovered or clicked, we lerp the material color, which in essence changes it from 'white' (normal) or greyscale
      ref.current.material.color.lerp(c.set(hovered || clicked === index ? 'white' : '#aaa'), hovered ? 0.3 : 0.1)
    }
  })
  return (
    <Image visible={showGallery} ref={ref} {...props} position={position} scale={scale} onClick={() => click(index)} onPointerOver={over} onPointerOut={out} />
  ) 
}

const AText3D = (props) => {
  const textRef = useRef()
  const scroll = useScroll()
  const averageCharacterWidth = 0.04
  const text = props.artTitle
  const estimatedWidth = text.length * averageCharacterWidth
  useFrame(({mouse}, delta) => {
    const { x, y } = mouse
    // Calculate rotation angles based on the mouse position
    const rotationX = ((0.5 - y) * Math.PI / 4) - (-estimatedWidth / 2)
    const rotationY = ((x - 0.5) * Math.PI / 4) - (-estimatedWidth / 2)

    // Update the rotation of the text
    textRef.current.rotation.x = damp(textRef.current.rotation.x, rotationX, 3, delta)
    textRef.current.rotation.y = damp(textRef.current.rotation.y, rotationY, 3, delta)
    
    // The offset is between 0 and 1, you can apply it to your models any way you like
    const offset = scroll.offset
    textRef.current.position.y = damp(textRef.current.position.y, offset, 3, delta)

    textRef.current.position.x = (-estimatedWidth / 2) + offset * 6.5

    // Calculate the rotation based on the scroll offset
    // const rotationY = (-1 + offset * 2) * Math.PI * (-estimatedWidth / 2)
    // textRef.current.rotation.y = damp(textRef.current.rotation.y, rotationY, 6, delta)
    // const lookDownPosition = 0.25
    // const lookUpPosition = 0.75
    // // Calculate the rotation on the X-axis based on scroll position
    // let rotationX = 0 
    // if (offset >= lookDownPosition && offset <= lookUpPosition) {
    //   // Rotate from looking down to looking up
    //   rotationX = (offset - lookDownPosition - 0.25) * Math.PI
    // } else if (offset < lookDownPosition) {
    //   // Rotate down
    //   rotationX = (offset - lookDownPosition) * Math.PI 
    // } else if (offset > lookUpPosition) {
    //   // Rotate up
    //   rotationX = (offset - lookUpPosition) * Math.PI
    // }
    // textRef.current.rotation.x = damp(textRef.current.rotation.x, rotationX, 6, delta)
    // console.log(offset)
  })
  
  return (
    <Text3D ref={textRef} font={bagelFatOne} letterSpacing={-0.01} size={0.15} position={[-0.5, 1, 3]} anchorX="center">
      {props.artTitle}
      <meshNormalMaterial />
    </Text3D>
  )
}

//Make the text3drotate up and down left and right without fully turning
function Items({ w = 0.7, gap = 0.15, showGallery }) {
  const { urls } = useSnapshot(state)
  const { width } = useThree((state) => state.viewport)
  const { viewport } = useThree()
  const xW = w + gap
  const titleX = (viewport.width * 0.015)
  const titleY = (viewport.height * 0.40)
  const [artTitle, setArtTitle] = useState('')
  const onClick = (index) => {
    setArtTitle(artTitles[index])
  }
  //right now scroll controls are empty because it's not in scroll... but I want it to rotate based on position
  return (
    <>
    <ScrollControls horizontal damping={0.5} pages={(width - xW + urls.length * xW) / width}>
      {showGallery ?
      <Scroll>
      {urls.map((url, i) => <Item key={i} index={i} position={[i * xW, 0, 0]} showGallery={showGallery} scale={[w, 4, 1]} url={url} onImgClick={() => onClick(i)} />)}
      {showGallery ?
        <AText3D artTitle={artTitle} />
      : null}
      </Scroll>
      : null}
    </ScrollControls></>
  )
}

export default Items
