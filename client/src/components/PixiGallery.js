import React, { useEffect } from 'react'
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree, useLoader } from "react-three-fiber"
import { Image, ScrollControls, Scroll, useScroll } from "@react-three/drei"
import { proxy, useSnapshot } from 'valtio'
//todo:
//rebrand twitter to X
//find a real soundcloud logo
//add an insta icon

//make the unclicked tiles wider (and slightly taller)
//have a hover effect that gives the title of the work
//make them warp fun on hover events
//have the shift + scroll functionality move faster
const vertexShader = `
  varying vec2 vUv; // Declare vUv as a varying variable
  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform sampler2D u_texture; // <---------------------------------- texture sampler uniform
  varying vec2 vUv;
  void main(){
      gl_FragColor = texture2D(u_texture, vUv);
  }
`;

const ArtGallery = (props) => {
    //import all images in the folder
    const [imageUrls, setImageUrls] = useState([])
    const [texturesLoaded, setTexturesLoaded] = useState(false);
    useEffect(() => {
      async function fetchImages() {
        try {
          const importAll = (r) => r.keys().map(r);
          const images = importAll(require.context('../images', false, /\.(jpg)$/));
          const texturePromises = images.map((imageUrl) =>
            new Promise((resolve, reject) => {
              const textureLoader = new THREE.TextureLoader();
              textureLoader.load(imageUrl, resolve, undefined, reject);
            })
          );
          await Promise.all(texturePromises);
          setImageUrls(images);
          setTexturesLoaded(true); // Mark textures as loaded
          console.log('all loaded')
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }
      fetchImages();
    }, []);
    const damp = THREE.MathUtils.damp
    const material = new THREE.LineBasicMaterial({color: 'white'})
    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.5, 0)])
    const state = proxy({
        clicked: null,
        urls: imageUrls
    })
        
    const Minimap = (props) => {
      const ref = useRef()
      const scroll = useScroll()
      const { urls } = useSnapshot(state)
      const { height } = useThree((state) => state.viewport)
      useFrame((state, delta) => {
          ref.current.children.forEach((child, index) => {
            // Give me a value between 0 and 1
            //   starting at the position of my item
            //   ranging across 4 / total length
            //   make it a sine, so the value goes from 0 to 1 to 0.
            const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)
            child.scale.y = damp(child.scale.y, 0.1 + y / 6, 8, 8, delta)
          })
        })
        return (
          <group ref={ref}>
            {urls.map((_, i) => (
              <line key={i} geometry={geometry} material={material} position={[i * 0.06 - urls.length * 0.03, -height / 2 + 0.6, 0]} />
            ))}
          </group>
        )
    }

    //The ternary operator index === clicked ? null : index is used to determine the new value for the clicked state.
      // If the current index of the clicked item matches the value of the clicked state, it means that the item was already clicked. In this case, the clicked state is set to null, effectively unselecting the item.
      // If the current index of the clicked item does not match the value of the clicked state, it means the item was not previously clicked. In this case, the clicked state is set to the index of the clicked item, effectively selecting it.
    const Item = ({ index, position, scale, c = new THREE.Color(), ...props }) => {
      const itemRef = useRef()
      const scroll = useScroll()
      const { clicked, urls } = useSnapshot(state)
      const [hovered, hover] = useState(false)
      
      const click = () => (state.clicked = index === clicked ? null : index)
      const over = () => hover(true)
      const out = () => hover(false)

      const texture = useLoader(THREE.TextureLoader, props.url)
      const uniforms = {
        hoverAmount: { value: 0.0 },
        // texture: { value: texture },
        u_texture: {type: 't', value: texture}
      };
      
      const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });
      const [hasLogged, setHasLogged] = useState(false)
      useFrame((state, delta) => {
          const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)
          if(itemRef.current){
            if(!hasLogged)
            {
              console.log(JSON.stringify(itemRef))
              setHasLogged(true)
            }
            itemRef.current.shaderMaterial.scale[1] = itemRef.current.scale.y = damp(itemRef.current.scale.y, clicked === index ? 5 : 4 + y, 8, delta)
            // ref.current.material.scale[0] = ref.current.scale.x = damp(ref.current.scale.x, clicked === index ? 4.7 : scale[0], 6, delta)
            // if (clicked !== null && index < clicked) ref.current.position.x = damp(ref.current.position.x, position[0] - 2, 6, delta)
            // if (clicked !== null && index > clicked) ref.current.position.x = damp(ref.current.position.x, position[0] + 2, 6, delta)
            // if (clicked === null || clicked === index) ref.current.position.x = damp(ref.current.position.x, position[0], 6, delta)
            // ref.current.material.grayscale = damp(ref.current.material.grayscale, hovered || clicked === index ? 0 : Math.max(0, 1 - y), 6, delta)
            // ref.current.material.color.lerp(c.set(hovered || clicked === index ? 'white' : '#aaa'), hovered ? 0.3 : 0.1)
            // Update the hoverAmount uniform based on the hovered state
            shaderMaterial.uniforms.hoverAmount.value = hovered ? 1.0 : 0.0;
          }
        }, [itemRef, clicked])
        return(
          <mesh
            ref={itemRef}
            {...props}
            position={position}
            scale={scale}
            onClick={click}
            onPointerOver={over}
            onPointerOut={out}
          >
            <planeGeometry args={[1, 1]} />
            <shaderMaterial {...shaderMaterial} />
          </mesh>
        )
    }


    const Items = ({ w = 0.65, gap = 0.35 }) => {
      const { urls } = useSnapshot(state);
      const { width } = useThree((state) => state.viewport);
      const xW = w + gap;
    
      return (
        <ScrollControls horizontal damping={0.85} pages={(width - xW + urls.length * xW) / width}>
          <Minimap />
          <Scroll>
            {urls.map((url, i) => (
              <Item
                key={i}
                index={i}
                position={[i * xW, 0, 0]}
                scale={[1,1,1]}
                //scale={[state.clicked === i ? w : w + 0.2, 4.5, 1]} // Adjust the width and height
                url={url}
              />
            ))}
          </Scroll>
        </ScrollControls>
      );
    };

    
    return (
        //note! must be used within a canvas.
        texturesLoaded && <Items />
    )
}

export default ArtGallery

