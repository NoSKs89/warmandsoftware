import React, {useEffect, useRef, useState} from "react"
import { Canvas, useThree, useFrame } from "react-three-fiber"
import { Text, Billboard } from "@react-three/drei"
import { Controls, useControl } from "react-three-gui"
import * as THREE from 'three'

import CenterNav from '../components/CenterNav'
const ResponsiveText = (props) => {
  const [hovered, setHovered] = useState(false)
  useEffect(() => {
        props.disableRepeatText()
        if (hovered) document.body.style.cursor = 'pointer'
        return () => (document.body.style.cursor = 'auto')
    }, [hovered])
    const { viewport, camera } = useThree()
    const state = useThree()
    // const color = useControl("color", { type: "color", value: "#EC2D2D" })
    let fontSize = useControl("fontSize", { type: "number", value: 1.5, min: 1, max: 100 })
    const maxWidth = useControl("maxWidth", { type: "number", value: 90, min: 1, max: 100 })
    let lineHeight = useControl("lineHeight", { type: "number", value: 0.75, min: 0.1, max: 10 })
    const letterSpacing = useControl("spacing", { type: "number", value: -0.08, min: -0.5, max: 1 })

    //color hover logic
    const over = (e) => (e.stopPropagation(), setHovered(true), console.log('hovered'))
    const out = () => setHovered(false)
    const refs = useRef([]);
    useFrame(() => {
      const color = new THREE.Color();
      refs.current.forEach((ref) => {
        // console.log(ref.material[0])
        if (ref && ref.material[1] && ref.material[1].color) {
          ref.material[1].color.lerp(
            color.set(hovered ? '#fa2720' : 'white'),
            0.07
          );
        }
      });
    });

    return (
      <>
      {props.poems.filter(function(el, index) {
        return props.poems.indexOf(el) === props.activePoem
      })
      .map((poem, index) => {
        camera.position.y = 0
        return ( 
          <>
        {/* title */}
        <Text
          key={props.poems.indexOf(poem) + 'title'}
          color={poem.color ?? "#ADD8E6"}
          fontSize={0.3}
          maxWidth={(viewport.width / 100) * 80}
          lineHeight={1.15}
          letterSpacing={0.05}
          textAlign={"center"}
          font={poem.font ?? "https://fonts.gstatic.com/s/dosis/v19/HhyJU5sn9vOmLxNkIwRSjTVNWLEJN7Ml2xMC.woff"} //ttf otf or woff (notwoff2)
          outlineBlur={'70%'} //not noticeable without things behind it... creates interesting effects on the animation
          fillOpacity={1.5} //Controls the opacity of just the glyph's fill area, separate from any configured strokeOpacity, outlineOpacity, and the material's opacity. A fillOpacity of 0 will make the fill invisible, leaving just the stroke and/or outline.
          material-toneMapped={false}
          // anchorX="center"
          anchorY={-1.8}
          onPointerOver={over}
          onPointerOut={out}
          ref={(ref) => (refs.current[index] = ref)}
          >
          {poem.title}
        </Text>
        <Text
          key={props.poems.indexOf(poem)}
          color={poem.color ?? "#ADD8E6"}
          fontSize={poem.shrink ? 0.15 : (props.bIsMobile ? 0.2 : 0.2)}
          maxWidth={(viewport.width / 100) * 80}
          lineHeight={1.15}
          letterSpacing={-0.01}
          textAlign={"center"}
          font={poem.font ?? "https://fonts.gstatic.com/s/dosis/v19/HhyJU5sn9vOmLxNkIwRSjTVNWLEJN7Ml2xMC.woff"} //ttf otf or woff (notwoff2)
          outlineBlur={'70%'} //not noticeable without things behind it... creates interesting effects on the animation
          fillOpacity={1.5} //Controls the opacity of just the glyph's fill area, separate from any configured strokeOpacity, outlineOpacity, and the material's opacity. A fillOpacity of 0 will make the fill invisible, leaving just the stroke and/or outline.
          material-toneMapped={false}
          anchorX="center"
          anchorY={-1.8}
          >
          {'\n \n'}
          {poem.text.split('\\n').join('\n').split('--').join(String.fromCharCode(8211))}
        </Text>
        </>)
      }
      )
      }
      </>
    )
  }

  export default ResponsiveText
  
