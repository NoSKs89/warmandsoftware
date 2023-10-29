import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Billboard } from "@react-three/drei"
import { useEffect, useState, forwardRef, useRef } from 'react'
import { animated, SpringValue, useSpring, config } from '@react-spring/three'
import * as THREE from 'three'
import Box from '../components/Box'


const Stars = {
    //https://supabase.com/blog/interactive-constellation-threejs-react-three-fiber
    //https://codesandbox.io/s/react-three-fiber-particles-ii-moio2
}

const RotatingCubes = () => {
    const groupRef = useRef();
    useFrame(() => {
      groupRef.current.rotation.x += 0.01; // Rotate around X-axis
      groupRef.current.rotation.y += 0.01; // Rotate around Y-axis
    });
    return (
      <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
        <Box position={[-2, 0, -2]} scale={[0.05, 0.05, 0.05]} color="red" />
        <Box position={[2, 0, 2]} scale={[0.5, 0.5, 0.5]} color="blue" />
      </group>
    );
}

const AnimatedText = animated(Text)
//todo leave the color on selected.
const CanvasText = forwardRef((props, ref) => {
    const { viewport } = useThree()
    const x = (viewport.width * 0.565)
    const y = ((props.index - 2.25) * 1.22)
    const pos = [x, y, 0]
    const hoveredPosition = [...pos]
    hoveredPosition[2] = props.text === 'ABOUT' ? hoveredPosition[2] - 1.5 : hoveredPosition[2] - 1.5
    hoveredPosition[0] = hoveredPosition[0] + 1
    hoveredPosition[1] = props.text === 'ABOUT' || props.text === 'ART'? hoveredPosition[1] - 0.25 : hoveredPosition[1]
    const onClick = () => {
        if(!props.isClickable){
            return
        }
        if(props.text === props.currentItem){
            props.setCurrentItem('blank')
        }
        else
            props.setCurrentItem(props.text)
    }
    const [hovered, setHovered] = useState(false)
    useEffect(() => {
        document.body.style.cursor = hovered ? (props.isClickable ? 'pointer' : 'progress') : 'var(--cursorToUse)'
      }, [hovered, props.isClickable])
    const handleMouseEnter = () => {
        setHovered(true)
        props.setHovered(true)
      }
    
      const handleMouseLeave = () => {
        setHovered(false)
        props.setHovered(false)
      }
    
    // console.log('pos: ' + pos + '; x: ' + x + '; y: ' + y + '; hovered pos: ' + hoveredPosition)
    const posOffScren = [11, 0, 0]
    const { color, fontSize, position, secondaryColor, strokeWidth } = useSpring({
        color: props.isClickable ? (props.currentItem === props.text || !hovered ? 'white' : 'grey') : props.color,
        secondaryColor: props.isClickable ? (props.currentItem === props.text || !hovered ? 'white' : 'grey') : 'black',
        strokeWidth: props.isClickable ? ('0.5%') : '2%',
        fontSize: props.isClickable ? 0.3 : 0.5,
        position:  props.currentItem === props.text ? hoveredPosition : (props.isClickable ? pos : posOffScren),
        config:  { mass: 5, tension: 1000, friction: 50, precision: 0.0001}  //props.isClickable ? { mass: 5, tension: 1000, friction: 50, precision: 0.0001} : config.stiff
    })
    const { rotation } = useSpring({
        // rotation: props.isClickable ? [25,0,45] : [25,0,44], // for some reason this like spins around a bunch...
        rotation: [25,0,45] 
    })
    return (
        <animated.group ref={ref} position={position} className={'menuOption'}>
        <AnimatedText
            color={color}
            fontSize={fontSize}
            maxWidth={(viewport.width / 100) * 8}
            lineHeight={1.15}
            letterSpacing={0.05}
            textAlign={"center"}
            font={"https://fonts.gstatic.com/s/bagelfatone/v1/hYkPPucsQOr5dy02WmQr5Zkd0B5mvv0dSbM.ttf"} //ttf otf or woff (notwoff2)
            // outlineBlur={'3%'} //not noticeable without things behind it... creates interesting effects on the animation
            fillOpacity={props.currentItem !== props.text ? 3.5 : 1.5} //Controls the opacity of just the glyph's fill area, separate from any configured strokeOpacity, outlineOpacity, and the material's opacity. A fillOpacity of 0 will make the fill invisible, leaving just the stroke and/or outline.
            material-toneMapped={false}
            anchorY={-1.8}
            strokeColor={secondaryColor}
            strokeWidth={strokeWidth}
            onPointerOver={handleMouseEnter}
            onPointerOut={handleMouseLeave}
            onClick={onClick}
            rotation={rotation}
            >
            {props.text}
        </AnimatedText>
        {/* {hovered ? <RotatingCubes /> : null} */}
        </animated.group>)
})

export default CanvasText