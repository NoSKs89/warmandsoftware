import { useFrame, useThree } from '@react-three/fiber'
import { Text } from "@react-three/drei"
import { useEffect, useState, forwardRef, useRef } from 'react'
import { animated, useSpring } from '@react-spring/three'
import Box from '../components/Box'
import { Select } from '@react-three/postprocessing'


const Stars = {
    //https://supabase.com/blog/interactive-constellation-threejs-react-three-fiber
    //https://codesandbox.io/s/react-three-fiber-particles-ii-moio2
}

const RotatingCubes = (props) => {
    const groupRef = useRef();
    useFrame(() => {
      // groupRef.current.rotation.x += 0.01; // Rotate around X-axis
      // groupRef.current.rotation.y += 0.01; // Rotate around Y-axis
      // groupRef.current.position.x = position[0]
      // groupRef.current.position.y = position[1]
      // groupRef.current.position.z = position[2]
    });
    return (
      <group ref={groupRef}>
        <Box position={props.position} wireframe={true} color="white" />
      </group>
    );
}

const AnimatedText = animated(Text)
//todo leave the color on selected.
const CanvasText = forwardRef((props, ref) => {
    const bIsMobile = props.bIsMobile
    const { viewport } = useThree()
    const angle = ((props.index / (4 - 1))) * (Math.PI)
    const x = !bIsMobile ? (viewport.width * 0.565) : ((4  - 1 - props.index - 0.5))
    const y = !bIsMobile ? ((props.index - 2.25) * 1.22) : Math.sin(angle) + 2
    const pos = [x, y, 0]
    const hoveredPosition = [...pos]
    if(!bIsMobile){
      hoveredPosition[2] = props.text === 'ABOUT' ? hoveredPosition[2] - 1.5 : hoveredPosition[2] - 1.5
      hoveredPosition[0] = hoveredPosition[0] + 1
      hoveredPosition[1] = props.text === 'ABOUT' || props.text === 'ART'? hoveredPosition[1] - 0.25 : hoveredPosition[1]
    }
    else{
      hoveredPosition[0] = 0
      hoveredPosition[1] = 1.5
      hoveredPosition[2] = props.text === 'ART' || props.text === 'POEMS' ? 0 : 0
    }
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
    

    const posOffScren = bIsMobile ? [0, 5, 0] : [11, 0, 0]
    const { color, fontSize, position, secondaryColor, strokeWidth } = useSpring({
        color: props.isClickable ? (props.currentItem === props.text || !hovered ? 'white' : 'grey') : props.color,
        secondaryColor: props.isClickable ? (props.currentItem === props.text || !hovered ? 'white' : 'grey') : 'black',
        strokeWidth: props.isClickable ? ('0.5%') : '2%',
        fontSize: props.isClickable ? 0.3 : 0.5,
        position:  props.currentItem === props.text ? hoveredPosition : (props.isClickable ? pos : posOffScren),
        config:  { mass: 5, tension: 1000, friction: 50, precision: 0.0001}
    })
    const { rotation } = useSpring({
        rotation: !bIsMobile ? [25,0,45] : (props.currentItem === props.text ? [25, 0, 44] : [25, 0, 45])
    })
    return (
        <>
        <animated.group ref={ref} position={position} className={'menuOption'} scale={bIsMobile ? 0.75 : 1}>
        <Select enabled={false}>
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
            {bIsMobile && props.hideMenuItems ? '' : props.text}
        </AnimatedText>
        </Select>
        </animated.group>
        </>
        )
})

export default CanvasText