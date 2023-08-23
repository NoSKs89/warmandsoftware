import React, {useEffect} from "react"
import { Canvas, useThree } from "react-three-fiber"
import { Text, Billboard } from "@react-three/drei"
import { Controls, useControl } from "react-three-gui"

// import Poems from '../poems.json'
import CenterNav from '../components/CenterNav'

//todo:
//move center Nav into this component, each button corresponding to being the actively displayed poem
//scratch that... keep center nav a separate component because this is within the canvas
//however keep state in the parent and pass it.
//add hover effect to letters?? increase size or something

const ResponsiveText = (props) => {
      useEffect(() => {
        props.disableRepeatText()
    }, [])
    const { viewport } = useThree()
    const state = useThree()
    const color = useControl("color", { type: "color", value: "#EC2D2D" })
    const fontSize = useControl("fontSize", { type: "number", value: 1.5, min: 1, max: 100 })
    const maxWidth = useControl("maxWidth", { type: "number", value: 90, min: 1, max: 100 })
    const lineHeight = useControl("lineHeight", { type: "number", value: 0.75, min: 0.1, max: 10 })
    const letterSpacing = useControl("spacing", { type: "number", value: -0.08, min: -0.5, max: 1 })
    return (
      <>
      {props.poems.filter(function(el, index) {
        return props.poems.indexOf(el) === props.activePoem
      })
      .map((poem, index) => 
      <Text
        key={props.poems.indexOf(poem)}
        color={poem.color ?? "#ADD8E6"}
        fontSize={poem.shrink ? 0.15 : (props.bIsMobile ? 0.2 : 0.2)}
        maxWidth={(viewport.width / 100) * 80}
        lineHeight={1.15}
        letterSpacing={-0.01}
        textAlign={"left"}
        font={poem.font ?? "https://fonts.gstatic.com/s/dosis/v19/HhyJU5sn9vOmLxNkIwRSjTVNWLEJN7Ml2xMC.woff"} //ttf otf or woff (notwoff2)
        //curveRadius={15}
        //depthOffset={0}
        //glyphGeometryDetail={0}
        //material={myMaterial} //defaults to a MeshBasicMaterial
        // lots more fun props: https://github.com/protectwise/troika/tree/master/packages/troika-three-text
        outlineBlur={'70%'} //not noticeable without things behind it... creates interesting effects on the animation
        fillOpacity={1.5} //Controls the opacity of just the glyph's fill area, separate from any configured strokeOpacity, outlineOpacity, and the material's opacity. A fillOpacity of 0 will make the fill invisible, leaving just the stroke and/or outline.
        material-toneMapped={false}
        anchorX="center"
        anchorY="middle">
        {poem.text.split('\\n').join('\n').split('--').join(String.fromCharCode(8211))}
      </Text>)
      }

      {/* {props.poems
        .filter(function(obj) {return obj.selected})
        .map((poem, index) => 
        <Text
          key={props.poems.indexOf(poem)}
          color={poem.color ?? "#ADD8E6"}
          fontSize={props.bIsMobile ? 0.22 : 0.5}
          maxWidth={(viewport.width / 100) * 80}
          lineHeight={1.0}
          letterSpacing={-0.01}
          textAlign={"left"}
          font={poem.font ?? "https://fonts.gstatic.com/s/dosis/v19/HhyJU5sn9vOmLxNkIwRSjTVNWLEJN7Ml2xMC.woff"}
          anchorX="center"
          anchorY="middle">
          {poem.text.split('\\n').join('\n')}
        </Text>)
      } */}
      </>
    )
  }

  export default ResponsiveText
  
