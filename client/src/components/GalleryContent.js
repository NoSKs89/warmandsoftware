import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Image, ScrollControls, Scroll, useScroll, Text } from '@react-three/drei'
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

function Item({ index, position, scale, showGallery, onClick, c = new THREE.Color(), ...props }) {
  const ref = useRef()
  const scroll = useScroll()
  const { clicked, urls } = useSnapshot(state)
  const [hovered, hover] = useState(false)
  const click = (index) => {
    onClick(index)    
    (state.clicked = index === clicked ? null : index)
  } 
  const over = () => hover(true)
  const out = () => hover(false)
  useFrame((state, delta) => {
    if(showGallery){
      const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)

      //changes the scaling (size) of the items based on their scrolled position or whether it is clicked
      ref.current.material.scale[1] = ref.current.scale.y = damp(ref.current.scale.y, clicked === index ? 5 : 4 + y, 8, delta)
      ref.current.material.scale[0] = ref.current.scale.x = damp(ref.current.scale.x, clicked === index ? 4.7 : scale[0], 6, delta)
      
      //this is super slick. controls the x-axis position of the objects based on whether it is to the left of, right of, or is the clicked object. 
      if (clicked !== null && index < clicked) ref.current.position.x = damp(ref.current.position.x, position[0] - 2, 6, delta)
      if (clicked !== null && index > clicked) ref.current.position.x = damp(ref.current.position.x, position[0] + 2, 6, delta)
      if (clicked === null || clicked === index) ref.current.position.x = damp(ref.current.position.x, position[0], 6, delta)
      
      if (clicked !== null && index < clicked) ref.current.position. y = damp(ref.current.position.y, position[1] - 0.25, 6, delta)
      if (clicked !== null && index > clicked) ref.current.position. y = damp(ref.current.position.y, position[1] + 0.25, 6, delta)
      if (clicked === null || clicked === index) ref.current.position.y = damp(ref.current.position.y, position[1], 6, delta)


      //adjust the greyscale based on being hovered/clicked or near the Y (scrolled) position
      ref.current.material.grayscale = damp(ref.current.material.grayscale, hovered || clicked === index ? 0 : Math.max(0, 1 - y), 6, delta)
      
      ref.current.material.zoom = damp(ref.current.material.zoom, hovered ? (clicked ? 1.1 : 1.2) : 1, 6, delta)

      //if hovered or clicked, we lerp the material color, which in essence changes it from 'white' (normal) or greyscale
      ref.current.material.color.lerp(c.set(hovered || clicked === index ? 'white' : '#aaa'), hovered ? 0.3 : 0.1)
    }
  })
  return <Image visible={showGallery} ref={ref} {...props} position={position} scale={scale} onClick={() => click(index)} onPointerOver={over} onPointerOut={out} />
}

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
  return (
    <>
    {showGallery ?
    <Text
        scale={[3.5, 3.5, 3.5]}
        color="grey" // default
        anchorX="center" // default
        anchorY="middle" // default
        position={[titleX, titleY, 0]}
        font={"http://fonts.gstatic.com/s/akatab/v7/VuJwdNrK3Z7gqJEPWIz5NIh-YA.ttf"} //ttf otf or woff (notwoff2)
      >{artTitle}</Text> : null}
    <ScrollControls horizontal damping={0.5} pages={(width - xW + urls.length * xW) / width}>
      {showGallery ?
      <Scroll>
      {urls.map((url, i) => <Item key={i} index={i} position={[i * xW, 0, 0]} showGallery={showGallery} scale={[w, 4, 1]} url={url} onClick={() => onClick(i)} />)}
      </Scroll>
      : null}
    </ScrollControls></>
  )
}

export default Items
