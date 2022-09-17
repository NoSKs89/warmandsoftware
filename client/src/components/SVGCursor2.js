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
const SVG_SINGLEPAW_PATH = 'M23.5,14a6.65,6.65,0,0,0-10-1c-2.4,2.5-4.7,7.5-3.4,10.8.3.4.4,1,.8,1.3,1.3,1.6,3.4.7,4.8.1a6,6,0,0,1,3.7-.6,6,6,0,0,1,2,.8,3,3,0,0,0,2,.6,2.73,2.73,0,0,0,2.3-1.7,7.27,7.27,0,0,0,.4-2.5,13.46,13.46,0,0,0-1.5-5.7A13.39,13.39,0,0,0,23.5,14Zm-9.9-3.3c1.6-.7,2.1-3.3,1-5.9S11.3.7,9.7,1.3s-2.1,3.3-1,5.9S12,11.4,13.6,10.7Zm6-.6c1.8.3,3.7-1.6,4.2-4.4S23.3.4,21.5.1s-3.7,1.6-4.2,4.4S17.9,9.8,19.6,10.1ZM7.3,9.5C5,7.9,2.1,8.2.8,10.1s-.5,4.7,1.7,6.3,5.2,1.3,6.5-.6S9.5,11,7.3,9.5Zm24.9-4c-1.7-1.6-4.8-1.1-6.8,1.2S23,12,24.7,13.6s4.8,1.1,6.8-1.2S33.9,7.1,32.2,5.5Z'

//todo:
//currently clickable region requires a lot of padding.
//change the new XY to spring back to start position.
//combine svgs.

//USE BOOKMARK ANIMATION.
//use a stop on the useGesture and create a function that animates it back to the svg head.

//fake drag does not appear to be working. will animate instaed.
// const doFakeDrag = (ele, mousePos) => {
//     let element = document.getElementById(ele)
//     element.dispatchEvent(new DragEvent('dragstart', {
//         // clientX: element.getBoundingClientRect().left,
//         // clientY: element.getBoundingClientRect().top,
//         clientX: mousePos.x,
//         clientY: mousePos.y,
//         bubbles: true,
//         cancelable: true
//     }))
//     element.dispatchEvent(new DragEvent('dragend', {
//         clientX: mousePos.x + 50,
//         clientY: mousePos.y + 50,
//         bubbles: true,
//         cancelable: true
//     }))
//     element.dispatchEvent(new DragEvent('dragend', {
//         bubbles: true,
//         cancelable: true
//     }))
// }

const ThisSVG = ({svg_path, color, elementID}) => {
    let svg1 = document.getElementById(elementID)
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

//change it to similar to dbl poem for percentages.
//on click create a three column area that when entered will light up and activate something based on hover back to the logo.

const Pull = (props) => {
    const [bFollow, setCursorFollow] = useState(false)
    const mousePos = hkUseMousePosition()
    let offsetX = 185
    let offsetY = 165
    let svg = document.getElementById('svg3')
    //useSpring turns values into animated-values.

    let body = document.body,
    html = document.documentElement
    let height = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight )

    const animationStyles = useSpring({
        // opacity: bFollow ? 0 : 1,
        marginTop: bFollow ? mousePos.y - offsetY: 125,
        marginLeft: bFollow ? mousePos.x - offsetX: 575
    })

    return (
        <a.div id="svg3" className="svg" 
        style={ animationStyles } 
            onClick={(e) => {
                let bound = svg.getBoundingClientRect()
                offsetX = bound.width / 2
                offsetY = bound.height / 2
                setCursorFollow(!bFollow)
                if(bFollow === false){
                    document.body.style.cursor = 'none'
                    svg.style.cursor = 'none'
                }
                else{
                    document.body.style.cursor = 'cursor'
                    svg.style.cursor = 'grab'
                }
            }}
        >
            <ThisSVG elementID={props.elementID ?? 'svg'}  svg_path={props.svg_path ?? SVG_PAW_PATH} color={props.color ?? "galaxy"} />
        </a.div>
    )
}

const SVGCursor2 = (props) => {
    useEffect(() => {
        props.setSidebar() 
        props.disableRepeatText()
    }, [])
    const [titleText, setTitleText] = useState("Moveable Header Demo: \n Click Paw To Begin.")
    return (
        <>
        <div className={'svgHeaderLogo'} >
                {titleText}
            </div>
        <Suspense fallback={null}
        onPress={() => {
            alert('hi')
            titleText === 'Moveable Header Demo: \n Click Paw To Begin.' ? 
            setTitleText('Now Click An Option.')
            : setTitleText('Moveable Header Demo: \n Click Paw To Begin.')
        }}>
            <Pull svg_path={props.path ?? SVG_SINGLEPAW_PATH} color={props.color ?? "galaxy"}
            />
            <div className="svg" style={
                {marginTop: 125,
                    marginLeft: 575,
                position:'relative !important'}}>
                <ThisSVG elementID={'svg2'} svg_path={SVG_SINGLEPAW_PATH} color={"red"} style={{position:'inherit'}}/>
            </div>
        </Suspense>
        </>
    )
}

export default SVGCursor2