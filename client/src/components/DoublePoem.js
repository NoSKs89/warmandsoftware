import React, { useState, useEffect, useRef, useCallback } from "react"
import { useSpring, a, config, easings } from 'react-spring'
import { folder, useControls, Leva } from 'leva'

import hkUseMousePosition from './hkUseMousePosition'

const NewlineText = (props) => {
    const text = props.text;
    const newText = text.split('\n').map(str => <p>{str}</p>);

    return (
        <a.div className={props.aClass ?? props.aClass} style={props.aStyle ?? props.aStyle}>
            {newText}
            <a.div className={props.aClass ?? props.aClass} style={props.bStyle ?? props.bStyle}>{props.author}</a.div>
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

const clearTimeouts = () => {
    var max = setTimeout(function(){ /* Empty function */ },1);
    for (var i = 1; i <= max ; i++) {
        window.clearInterval(i);
        window.clearTimeout(i);
        if(window.mozCancelAnimationFrame)window.mozCancelAnimationFrame(i); // Firefox
    }
}

// Function that returns a Promise for the FPS
const getFPS = () =>
  new Promise(resolve =>
    requestAnimationFrame(t1 =>
      requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
    )
  )

const ResponsiveText = (props) => {
    useEffect(() => {
      props.disableRepeatText()
      props.setSidebar()
    }, [])
    const mousePos = hkUseMousePosition()
    
    const [logText, setLogText] = useState('')
    const logRef = useCallback(node => {
      if(node != null){
        // node.innerHTML = log
      }
    })

    const [leftWidth, setWidth] = useState(0)
    const measuredRef = useCallback(node => {
        if (node !== null){
            const n = node.getBoundingClientRect()
            setWidth(n.width)
        }
    }, [])
    const [rightWidth, setRightWidth] = useState(0)
    const measuredRef2 = useCallback(node => {
        if (node !== null){
            setRightWidth(node.getBoundingClientRect().width)
        }
    }, [])

    const widthViewportPercent = Math.floor(mousePos.x / (leftWidth * 2) * 100)
    const oneSideViewportPercent = widthViewportPercent * 2

    //turn the following 2 chunks into functions
    const [width, setGlobalWidth] = useState(window.innerWidth)
    let pixelRatio = Math.ceil(window.devicePixelRatio)
    let bIsMobile = (width <= 768) //|| pixelRatio > 1
    if(bIsMobile){
        window.location.replace("http://warmandsoftware.com");
    }

    let queryString = window.location.search
    let params = new URLSearchParams(queryString)
    let perfMode = params.get('perfmode')

    // Calling the function to get the FPS
    const [performanceMode, setPerformanceMode] = useState(false)
    useEffect(() => {
        setTimeout(() => {
          let checkFPS = true
          let downScale = false
          if(checkFPS){
              getFPS().then(
                  fps => {  
                      console.log('fps: ' + parseFloat(fps))
                      if(parseFloat(fps) <= 20){
                          downScale = true
                          console.log('downscale: ' + downScale)
                      }
                      else { checkFPS = false }
                      setPerformanceMode((perfMode != null && perfMode.length > 0) || downScale ? true : false)
                      console.log('downScale: ' + downScale + '; perfmode?:' + performanceMode + '; checkFps?: ' + checkFPS)
                    }
                  )
          }
        }, 100)        
    }, [])

    let logConsole = params.get('log')
    const doLog = logConsole != null && logConsole.length > 0 ? true : false
    if(doLog)
      console.log('percentage: ' +  widthViewportPercent + '; leftWidth: ' + leftWidth + '; mousePosX: ' + mousePos.x + '; oneSide: ' + oneSideViewportPercent + '; fullWidth: ' + width)

    // const directFromLink = params.get('dblpoem')
    // const autoCloseSidebar = directFromLink != null && directFromLink.length > 0 ? false : true
    //   useEffect(() => {
    //     if(autoCloseSidebar){
    //       props.setSidebar()
    //     }
    //   }, [])
    //leftwidth = 960
    // console.log('mousepos: ' + JSON.stringify(mousePos) + '; leftWidth: ' + leftWidth + '; leftWidth: ' + leftWidth)

    const textAlignOffset = 389 // leftWidth / 2.5 //385 //should probably measure this. it's the inner left-view size, because we flipped textAlign the font hovers deceptively on the other side of the div
    const rightTextAlignOffset = leftWidth / 1.75
    const leftColor = '#CF423C', rightColor = '#FC7D49', touchingColor = '#ffe1e9'//'#7A1631' //backgroundColor = '#FFD462'
    const isCenter = mousePos.x >= leftWidth * 0.55 + (textAlignOffset / 2) && mousePos.x <= (leftWidth + leftWidth * 0.33) - (textAlignOffset/2)
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
    if(!isCenter && (overRightPane || overLeftPane)){
        setTimeout(() => 
        { 
            setShowHearts(false) 
        }, 10)
    } else { 
        clearTimeouts()
        setTimeout(() => { setShowRightAuthor(false)}, 10)
        setTimeout(() => { setShowLeftAuthor(false)}, 10)
        setTimeout(() => { setShowHearts(true)}, 500)
    }

    const t = true
    const { fontSizeNormal, fontSizeHover, fontSizeCenter, fontSizeUnderline, fFamilyCenter, fFamilyNormal, fWeightCenter, fWeightNormal, dropShadowPX,fColorLeft, fColorRight, fColorTouching, fBlurColor, fMinWidth, fCenterOffset, backgroundColor, heart1Color, heart2Color, noiseContrast, noiseBrightness, noisePosLeft, noiseFreq, noiseOctaveNum, viewboxW, viewboxH, bFollowCursorNoise, dropShadowColor, noiseRotate } = 
            useControls({ 'Text/Font': folder({fontSizeNormal: 0.8, fontSizeHover: 1.2, fontSizeCenter: 1.2, fontSizeUnderline: 16, fFamilyCenter: 'Syne', fFamilyNormal: 'Kanit', fWeightCenter: 500, fWeightNormal: 100, dropShadowPX: 6.5, dropShadowColor: '#f2baba',
            fColorLeft: leftColor, fColorRight: rightColor, fColorTouching: touchingColor, fBlurColor: 'white', fMinWidth: 550, fCenterOffset: 0, }), 'Colors': folder({backgroundColor: '#860b0b', heart1Color: '#7A1631', heart2Color: 'white'}), 'Noise': folder({noiseRotate: true, noiseContrast: 50, noiseBrightness: 35, noisePosLeft: 50, noiseFreq: isCenter ? 400 : 100, noiseOctaveNum: performanceMode ? 1 : 1, viewboxW: 800, viewboxH: 800, bFollowCursorNoise: t ? true : false})})
    const viewBox = `0 0 ${viewboxW} ${viewboxH}`;

    const noiseLogic = bFollowCursorNoise ? (isCenter ? 50 : (overLeftPane ? 25 : 75)) : noisePosLeft
    const noiseStyles = useSpring({
        position: 'absolute',
        zIndex: -5,
        marginTop: '-17%',
        filter: `contrast(${noiseContrast}%) brightness(${noiseBrightness}%)`,
        background: `radial-gradient(circle at ${noiseLogic}% ${isCenter ? 50 : 25}%, rgba(0,0,255,1), rgba(216,39,39,0))`,
    })
    const noiseStyles2 = useSpring({
        loop: { reverse: true },
        config: {
            duration: 3000, // 3250,
            easing: easings.easeInOutQuart,
          },
        from: { position: 'absolute', filter: `contrast(${noiseContrast}%) brightness(${noiseBrightness}%)`, background: `radial-gradient(circle at ${noiseLogic}% ${isCenter ? 50 : 25}%, rgba(0,0,255,1), rgba(216,39,39,0))`, rotateZ: 0, transform: 'scale(1.3)', top:'0%' },
        to: async next => {
          while (1) {
            // await next({ position: 'absolute', filter: `contrast(${noiseContrast}%) brightness(${10}%)`, background: `radial-gradient(circle at ${noiseLogic}% ${55}%, rgba(0,0,255,1), rgba(216,39,39,0))`, rotateZ: noiseRotate ? 180 : 0 })
            await next({ position: 'absolute', filter: `contrast(${noiseContrast}%) brightness(${40}%)`, background: `radial-gradient(circle at ${noiseLogic}% ${40}%, rgba(0,0,255,1), rgba(216,39,39,0))`, rotateZ: 0, transform: 'scale(1.1)',top:'0%' })
            await next({ position: 'absolute', filter: `contrast(${noiseContrast}%) brightness(${55}%)`, background: `radial-gradient(circle at ${noiseLogic}% ${25}%, rgba(0,0,255,1), rgba(216,39,39,0))`, rotateZ: noiseRotate ? 180 - 45: 0, transform: 'scale(0.40)', top:'-50%' })
            await next({ position: 'absolute', filter: `contrast(${noiseContrast}%) brightness(${75}%)`, background: `radial-gradient(circle at ${noiseLogic}% ${10}%, rgba(0,0,255,1), rgba(216,39,39,0))`, rotateZ: 0, transform: 'scale(1.2)', top:'0%' })
          }
        },
      })
    // const BackgroundStyles = useSpring({ backgroundColor: backgroundColor, overflow: 'hidden'})
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
    const offsetPercent = Math.floor((385 / leftWidth / 2) * 100)
    const floatLeftLogic = isCenter ? (22.5) :
        //if hovering left
        (overLeftPane ? 
            //don't mimic cursor until atleast 10% of margin, leave staticly center 
            ((widthViewportPercent <= 24 ? 8 : 
                    //else otherwise if we are greater than 75% of the side do not pull all the way, leave staticly
                    (widthViewportPercent >= 60 ? 60 :widthViewportPercent - offsetPercent))) 
        //mirror the above when hovering on the right
        : (widthViewportPercent >= 76 ? 42 : (widthViewportPercent / 2)))
    const sprConfig = config.default	
    const animationStylesLeft = useSpring({
        color: isCenter ? fColorTouching : (mousePos.x <= leftWidth ? fColorLeft : fBlurColor),
        left: `${floatLeftLogic}%`,
        fontSize: isCenter ? `${fontSizeCenter}vw` : (overLeftPane ? `${fontSizeHover}vw` : `${fontSizeNormal}vw`),
        fontFamily: isCenter ? `${fFamilyCenter}` : `${fFamilyNormal}`,
        fontWeight: isCenter ? fWeightCenter : fWeightNormal,
        zIndex: -5,
        position: 'absolute',
        textAlign: 'right', 
        filter: showHearts && isCenter ? `drop-shadow(${dropShadowPX}px ${dropShadowPX}px ${dropShadowPX}px ${dropShadowColor}) blur(0px)` : (overRightPane && !isCenter ? 'drop-shadow(0px 0px 0px transparent) blur(1.5px)' : 'drop-shadow(0px 0px 0px transparent) blur(0px)'),
        config: sprConfig
    })
    const floatRightLogic = isCenter ? 50 :
        (overRightPane ? 
            (widthViewportPercent >= 76 ? 68.5 : 
                (widthViewportPercent)) 
                : (widthViewportPercent <= 20 ? 42.5 : (widthViewportPercent >= 30 ? 55 : widthViewportPercent * 2)))
    const animationStylesRight = useSpring({
        color: isCenter ? fColorTouching : (mousePos.x >= leftWidth + leftWidth * 0.15 ? fColorRight : fBlurColor),
        left: `${floatRightLogic}%`,
        fontSize: isCenter ? `${fontSizeCenter}vw` : (overRightPane ? `${fontSizeHover}vw` : `${fontSizeNormal}vw`),
        fontFamily: isCenter ? `${fFamilyCenter}` : `${fFamilyNormal}`,
        fontWeight: isCenter ? fWeightCenter : fWeightNormal,
        zIndex: -5,
        position: 'absolute',
        // float: 'right',
        textAlign: 'left',
        // minWidth: `${fMinWidth}px`,
        filter: showHearts && isCenter ? `drop-shadow(${dropShadowPX}px ${dropShadowPX}px ${dropShadowPX}px ${dropShadowColor}) blur(0px)` : (overLeftPane && !isCenter ? 'drop-shadow(0px 0px 0px transparent) blur(1.5px)' : 'drop-shadow(0px 0px 0px transparent) blur(0px)'),
        config: sprConfig
    })
    const [on, toggle] = useState(true)
    const { x, c } = useSpring({
        from: { xy: [0, 0], c: 0 },
        x: on ? 1 : 0,
        c: on ? 1 : 0
    })
    const svgHeartStyles = useSpring({
        marginLeft: isCenter && showHearts ? '0vw' : (overLeftPane ? '-60vw' : '60vw'),
        left: '10%',
        opacity: isCenter && showHearts ? '100%' : '5%',
        background: 'red',
        config: config.wobbly
    })
    const svgHeartStyles2 = useSpring({
        marginLeft: isCenter && showHearts ? '9vw' : (overLeftPane ? '60vw' : '-60vw'),
        left: '10%',
        marginTop:  isCenter && showHearts ? '-20vh' : (overLeftPane ? '-20vh' : '0vh'),
        opacity: isCenter && showHearts ? '60%' : '3%',
        background: 'red',
        config: config.gentle
    })
    //change cursor to small circle svg or something goofy and nice
    return (
      <>
      <Leva 
        collapsed={true}
        hidden={doLog ? false : true}
      />
      {performanceMode ? <div className='pmDiv'>PERFORMANCE MODE<p>Low Frame-Rate Detected</p></div> : null}
      <div className={"dblPoemBackground"} //style={BackgroundStyles} 
      >
        <div className="noiseBackground">
        <a.svg viewBox={"0 0 60 60"} className='svgHeart' style={svgHeartStyles} xmlns="http://www.w3.org/2000/svg">
        <defs>
        <clipPath id="the-object">
            <path fill="currentColor" d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
                c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" width="100%" height="100%" >
            </path>
        </clipPath>
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={performanceMode ? 1 : 20}
              numOctaves={performanceMode ? 1 : 4}
              stitchTiles="stitch"
            />
          </filter>
          </defs>
        <g>
          <path clipPath="url(#the-object)" fill="red" d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
            c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" width="100%" height="100%" filter="url(#noiseFilter)" 
            />
        </g>
        </a.svg>

        <a.svg viewBox={overLeftPane ? "0 0 60 60" : "0 0 60 60"} className='svgHeart2' style={svgHeartStyles2} xmlns="http://www.w3.org/2000/svg">
        <defs>
        <clipPath id="the-object2">
            <path fill="currentColor" d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
                c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" width="100%" height="100%" >
            </path>
        </clipPath>
          <filter id="noiseFilter3">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={performanceMode ? 1 : 15}
              numOctaves={performanceMode ? 1 : 3}
              stitchTiles="stitch"
            />
          </filter>
          </defs>
        <g>
          <path clipPath="url(#the-object2)" fill="red" d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
            c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" width="100%" height="100%" filter="url(#noiseFilter3)" 
            />
        </g>
        </a.svg>

        <a.svg viewBox={viewBox} style={isCenter && !performanceMode ? noiseStyles2 : noiseStyles} className='noisebg2' xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter2">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={noiseFreq}
              numOctaves={performanceMode ? 1 : noiseOctaveNum}
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter2)" /> 
        </a.svg>
        </div>
        <div ref={measuredRef} id="leftSide" className={"left-view"}>
            <NewlineText aStyle={animationStylesLeft} text={text1.text.split('//n').join('\n').split('--').join(String.fromCharCode(8211))}
                 author={text1.author.split('//n').join('\n').split('--').join(String.fromCharCode(8211))} bStyle={AuthStyleLeft} />
        </div>
        <div ref={measuredRef2} className={"right-view"}>
            <NewlineText aClass={'rightText'} aStyle={animationStylesRight} text={text2.text.split('//n').join('\n').split('--').join(String.fromCharCode(8211))} 
                author={text2.author.split('//n').join('\n').split('--').join(String.fromCharCode(8211))} bStyle={AuthStyleRight}/>
        </div>
    </div>
    <div ref={logRef} className="log"></div>
    </>
      )
  }

  export default ResponsiveText