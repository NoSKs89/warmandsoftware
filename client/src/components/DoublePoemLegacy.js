import React, { useState, useEffect, useRef } from "react"
import { useSpring, a } from 'react-spring'
import { folder, useControls } from 'leva'

import hkUseMousePosition from './hkUseMousePosition'

const NewlineText = (props) => {
    const text = props.text;
    const newText = text.split('\n').map(str => <p>{str}</p>);

    return (
        <a.div style={props.aStyle ?? props.aStyle}>
            {newText}
            <a.div style={props.bStyle ?? props.bStyle}>{props.author}</a.div>
        </a.div>
    );
  }

const heartSVGPath = "M20,35.09,4.55,19.64a8.5,8.5,0,0,1-.13-12l.13-.13a8.72,8.72,0,0,1,12.14,0L20,10.79l3.3-3.3a8.09,8.09,0,0,1,5.83-2.58,8.89,8.89,0,0,1,6.31,2.58,8.5,8.5,0,0,1,.13,12l-.13.13Z"
const text1 = {text: "Aflame for you//nSubdue the wildfire in my head//nSatisfy my thirst as a spontaneous urge//nSeal the hole in the trenches of my heart//nSmooth down my soul until I am crinkle-free//nSwelling embers deep within me//nScope out for only you to tend", author: 'Brooke C.'}
const text2 = {text: "Only for you//nMy hands may sear to douse the spread//nThe steam will hiss from flesh to ember//nTogether we’ll meld what was once apart//nI’ll melt into you as a fever degree//nI’ll stoke up the embers now placed as should be//nOur flame will burn bright, ablaze to no end", author: 'Stephen E.'}

const ThisSVG = ({svg_path, color, elementID, aStyle}) => {
  return (
    <a.svg 
        //displayed width of the rectangluar viewport (not width of its coordinate system)
        width="100%" 
        //the viewbox attribute specifies a rectangle in user space which is mapped to the bounds of the viewport for the SVG element (not browser viewport)
        viewBox="0 0 100 100"
        preserveAspectRatio={true}
        //class="svg"    
        id="svg"
        // style={{borderLeft: '-50%', paddingTop: '-50%', display: 'block', alignSelf: 'center'}}
        style={aStyle ?? aStyle}
    >
      <defs>
      <filter id="f1" x="0" y="0">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.01" />
      </filter>
      </defs>
      <path filter="url(#f1)" d={svg_path} fill={color} />
    </a.svg>
  )
}

const ResponsiveText = (props) => {
    useEffect(() => {props.setSidebar()}, [])
    const mousePos = hkUseMousePosition()
    let offsetX = 185, offsetY = 165, leftWidth, leftSide, leftHeight
    //getElementByID will throw null at times if the dom hasn't loaded. ensure it has. (doesn't really work? useRef is better?)
    useEffect(() => {
        leftSide = document.getElementById("leftSide")
        leftWidth = leftSide.offsetWidth
    })
    let idRef = useRef()
    if(idRef.current){
        leftWidth = idRef.current.offsetWidth
        leftHeight = idRef.current.offsetHeight
    }
    
    const leftColor = '#CF423C', rightColor = '#FC7D49', touchingColor = '#7A1631' //backgroundColor = '#FFD462'
    const isCenter = mousePos.x >= leftWidth * 0.55 && mousePos.x <= leftWidth + leftWidth * 0.33
    const overLeftPane = mousePos.x <= leftWidth
    const overRightPane = mousePos.x >= leftWidth
    
    //fade author tags and the heart animation a little slower.
    const [showLeftAuthor, setShowLeftAuthor] = useState(false)
    if(!overLeftPane || isCenter){
        setTimeout(() => { setShowLeftAuthor(false)}, 10)
    } else { setTimeout(() => { setShowLeftAuthor(true)}, 1000)}
    const [showRightAuthor, setShowRightAuthor] = useState(false)
    if(!overRightPane || isCenter){
        setTimeout(() => { setShowRightAuthor(false)}, 10)
    } else { setTimeout(() => { setShowRightAuthor(true)}, 1000)}
    const [showHearts, setShowHearts] = useState(false)
    if(!isCenter){
        setTimeout(() => { setShowHearts(false)}, 10)
    } else { setTimeout(() => { setShowHearts(true)}, 850)}

    const { fontSizeNormal, fontSizeHover, fontSizeCenter, fontSizeUnderline, fFamilyCenter, fFamilyNormal, fWeightCenter, fWeightNormal, dropShadowPX,
            fColorLeft, fColorRight, fColorTouching, fBlurColor, backgroundColor, heart1Color, heart2Color } = 
            useControls({ 'Text/Font': folder({fontSizeNormal: 16, fontSizeHover: 20, fontSizeCenter: 21, fontSizeUnderline: 14, fFamilyCenter: 'Calibri', fFamilyNormal: 'Helvetica', fWeightCenter: 500, fWeightNormal: 100, dropShadowPX: 5,
            fColorLeft: leftColor, fColorRight: rightColor, fColorTouching: touchingColor, fBlurColor: 'white'}), 'Colors': folder({backgroundColor: '#FFD462', heart1Color: '#7A1631', heart2Color: 'white'})})

    //spring data
    const springConfig = {
        mass: 18, tension: 550, friction: 140
    }
    const BackgroundStyles = useSpring({ backgroundColor: backgroundColor})
    const AuthStyleLeft = useSpring({
        opacity: showLeftAuthor && overLeftPane ? 1 : 0,
        fontSize: `${fontSizeUnderline}px`,
        textDecoration: 'overline',
    })
    const AuthStyleRight = useSpring({
        opacity: showRightAuthor && overRightPane ? 1 : 0,
        fontSize: `${fontSizeUnderline}px`,
        textDecoration: 'overline',
    })
    const animationStylesLeft = useSpring({
        // backgroundColor: backgroundColor,
        color: isCenter ? fColorTouching : (mousePos.x <= leftWidth ? fColorLeft : fBlurColor),
        marginLeft: 
                    //if hovering left
                    overLeftPane ? 
                        //don't mimic cursor until atleast 10% of margin, leave staticly center 
                        ((mousePos.x <= leftWidth * 0.15 ? leftWidth * 0.33 : 
                                //otherwise if we are greater than 75% of the side do not pull all the way, leave staticly
                                (mousePos.x >= leftWidth * 0.70 ? leftWidth * 0.6 : mousePos.x))) 
                    //mirror the above when hovering on the right
                    : (mousePos.x >= leftWidth + leftWidth * 0.85 ? leftWidth * 0.33 : (mousePos.x <= leftWidth + leftWidth * 0.25 ? leftWidth * 0.6 : leftWidth + leftWidth - mousePos.x)),
        // backgroundColor: mousePos.x <= leftWidth ? "green" : "gray",
        fontSize: isCenter ? `${fontSizeCenter}px` : (overLeftPane ? `${fontSizeHover}px` : `${fontSizeNormal}px`),
        fontFamily: isCenter ? `${fFamilyCenter}` : `${fFamilyNormal}`,
        fontWeight: isCenter ? fWeightCenter : fWeightNormal,
        zIndex: 10,
        // filter: overRightPane && !isCenter ? 'blur(1.5px)' : 'blur(0px)',
        filter: showHearts && isCenter ? `drop-shadow(${dropShadowPX}px ${dropShadowPX}px ${dropShadowPX}px black) blur(0px)` : (overRightPane && !isCenter ? 'drop-shadow(0px 0px 0px transparent) blur(1.5px)' : 'drop-shadow(0px 0px 0px transparent) blur(0px)'),
        // config: springConfig
    })
    const animationStylesRight = useSpring({
        // backgroundColor: backgroundColor,
        color: isCenter ? fColorTouching : (mousePos.x >= leftWidth + leftWidth * 0.25 ? fColorRight : fBlurColor),
        marginRight: overRightPane ? (mousePos.x >= leftWidth + leftWidth * 0.85 ? leftWidth * 0.33 : (mousePos.x <= leftWidth + leftWidth * 0.25 ? leftWidth * 0.6 : leftWidth + leftWidth - mousePos.x)) 
                     : (mousePos.x <=  leftWidth * 0.15 ? leftWidth * 0.33 : (mousePos.x >= leftWidth * 0.70 ? leftWidth * 0.6 : mousePos.x)),
        // backgroundColor: mousePos.x >= leftWidth ? "green" : "gray",
        fontSize: isCenter ? `${fontSizeCenter}px` : (overRightPane ? `${fontSizeHover}px` : `${fontSizeNormal}px`),
        fontFamily: isCenter ? `${fFamilyCenter}` : `${fFamilyNormal}`,
        fontWeight: isCenter ? fWeightCenter : fWeightNormal,
        zIndex: 10,
        // filter: overLeftPane && !isCenter ? 'blur(1.5px)' : 'blur(0px)',
        filter: showHearts && isCenter ? `drop-shadow(${dropShadowPX}px ${dropShadowPX}px ${dropShadowPX}px black) blur(0px)` : (overLeftPane && !isCenter ? 'drop-shadow(0px 0px 0px transparent) blur(1.5px)' : 'drop-shadow(0px 0px 0px transparent) blur(0px)'),
        // config: springConfig
    })
    const svgStyle = useSpring({
        margin: 'auto', 
        position:'fixed', 
        alignItems: 'center !important',
        overflow: 'hidden',
        zIndex: 0,
        // marginLeft: isCenter ? leftWidth : 0,
        opacity: isCenter ? 1 : 1,
        fill: 'none',
        stroke: '#646464',
        display: 'block',
        textAlign: 'center !important'
    })
    const [on, toggle] = useState(true)
    const { x, c } = useSpring({
        from: { xy: [0, 0], c: 0 },
        x: on ? 1 : 0,
        c: on ? 1 : 0
    })
    const cssHeartStyle = useSpring({
        // opacity: showHearts && isCenter ? 0.9 : 0,
        opacity: 1,
        // marginLeft: showHearts && isCenter? 950 - 50 : 0,
        // marginTop: showHearts && isCenter? -leftHeight + 575 : 0,
        filter: showHearts ? `drop-shadow(${dropShadowPX}px ${dropShadowPX}px ${dropShadowPX}px black)` : 'drop-shadow(0px 0px 0px transparent)',
        // background : isCenter ? '#7A1631' : '#000000'
        // animation: 'arc 4s forwards'
        transform: isCenter ? x.interpolate({
            range: [0, .25, .5, .75, 1, 2, 4],
            output: [0, 500, 200, 800, 500, 250, 1000]
          }).interpolate(x => `translateX(${x}px)`) : 'translateX(0px)'
    })
    const cssHeartStyle2 = useSpring({
        opacity: showHearts && isCenter ? 0.75 : 0,
        // marginLeft: isCenter ? mousePos.x - 30 : -250,
        // marginTop: isCenter ? mousePos.y - 325 : -200
        marginLeft: showHearts && isCenter ? 950 - 25 : 1500,
        marginTop: showHearts && isCenter ? -leftHeight + 550 : 0,
        // backgroundColor: heart2Color
    })

    //change cursor to small circle svg or something goofy and nice
    return (
      <>
      <a.div className={"dblPoemBackground"} style={BackgroundStyles} >
        {/* <ThisSVG svg_path={heartSVGPath} aStyle={svgStyle} /> */}
        <a.div id='heart' style={cssHeartStyle} />
        <a.div id='heart2' style={cssHeartStyle2} />
        <div ref={idRef} id="leftSide" className={"left-view"} style={BackgroundStyles} onClick={() => alert('thefuck')}>
            <NewlineText aStyle={animationStylesLeft} text={text1.text.split('//n').join('\n').split('--').join(String.fromCharCode(8211))}
                 author={text1.author.split('//n').join('\n').split('--').join(String.fromCharCode(8211))} bStyle={AuthStyleLeft} />
        </div>
        <div className={"right-view"} style={BackgroundStyles}>
            <NewlineText aStyle={animationStylesRight} text={text2.text.split('//n').join('\n').split('--').join(String.fromCharCode(8211))} 
                author={text2.author.split('//n').join('\n').split('--').join(String.fromCharCode(8211))} bStyle={AuthStyleRight}/>
        </div>
    </a.div>
    </>
      )
  }

  export default ResponsiveText
  
