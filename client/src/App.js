import React, { useState, Fragment, useEffect, useRef, useContext, memo, createContext, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MenuFoldOutlined, MenuUnfoldOutlined, TwitterOutlined, SoundOutlined } from '@ant-design/icons'
import DatGui, { DatColor, DatNumber, DatSelect } from "react-dat-gui"
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette, SSAO } from "@react-three/postprocessing"
import { config } from 'react-spring'
//old version of react spring is "react-spring": "^9.2.4", but changing to 9.4.1 for 'easings'

import CollapsingTrail from './components/CollapsingTrail'
import StealthRocksMesh from './components/StealthRocks'
import Box from './components/Box'
import RepeatingText from './components/RepeatingText2'
import Sidebar from './components/Sidebar2'
import Pattern1 from './components/Pattern1'
import Fortune from './components/Fortune'
import Poem from './components/Poem'
import PositionRig from './components/PositionRig'
import Dolly from './components/DollyRig'
import ResetCamera from './components/ResetCamera'
import DeviceOrientatationCtrls from './components/DeviceOrientationCtrls'
import CenterNav from './components/CenterNav'
import Poems from './poems.json'
import SVGToggler from './components/SVGToggler'
import SVGWalker from './components/SVGWalker'
import HelperPlane2 from './components/HelperPlane'
import SVGCursor from './components/SVGCursor2'
import DoublePoem from './components/DoublePoem'
import InfoDiv from './components/InfoDiv'
import AboutMe from './components/AboutMe'
import ArtGallery from './components/PixiGallery'

import GridCell from './components/GridCell'
import data from './data'
import Grid from 'mauerwerk'

export default function App() {
  let bIsBrooke = document.URL.indexOf('brooke') > 0 
  let bIsDebug = document.URL.indexOf('localhost') > 0
  useEffect(() => {  
    console.log(bIsBrooke ? 'Welcome Lover' : 'Welcome Friend')
  }, [])

  let queryString = window.location.search
  let params = new URLSearchParams(queryString)
  let hidesidebar = params.get('hidesidebar')
  let activeComponents = params.getAll('active')

  //helpers
  const [opts, setOpts] = useState({
    posX: 0,
    posY: 0,
    posZ: 0,
    // scale: 0.1
    extraScale: 1,
    offset: 2
  })

  const [poem1Visible, setPoem1Visible] = useState(bIsBrooke || activeComponents.includes('poems'))
  const [boxesVisible, setBoxesVisible] = useState(activeComponents.includes('cubes'))
  const [repeatTextVisible, setRepeatTextVisible] = useState(!activeComponents.length)
  const [pattern1Visible, setPattern1Visible] = useState(activeComponents.includes('pattern1'))
  const [grid1Visible, setGrid1Visible] = useState(false)
  const [stealthRocksVisible, setStealthRocksVisible] = useState(false)
  const [isCameraLocked, lockCamera] = useState(true)
  const [svgWalkerVisible, setSVGWalkerVisible] = useState(activeComponents.includes('pawpads'))
  const [helperPlaneVisible, setHelperPlaneVisible] = useState(false)
  const [svgCursorVisible, setSVGCursorVisible] = useState(activeComponents.includes('svgcursor'))
  const [postProcessingVisible, setPostProcessingVisible] = useState(false)
  const [doublePoemVisible, setDoublePoemVisible] = useState(activeComponents.includes('dblpoem'))
  const [infoDivVisible, setInfoDivVisible] = useState(false)
  const [infoDivText, setInfoDivText] = useState('Lorem Ipsum Lorem Ipsum Lorem Ipsum LUL')
  const [artGalleryVisible, setArtGalleryVisible] = useState(false)
  const [activePoem, setActivePoem] = useState(Poems.length - 1)

  const [aboutMeVisible, setAboutMeVisible] = useState(false)
  const sidebarItemsArr = [
  {text: "Toggle Text", setVisible: setRepeatTextVisible, visible: repeatTextVisible, type: "feature", infoText: 'Repeating Text using useSpring Physics', infoTitle: 'Type Transformation'}, 
  {text: "Toggle Cubes", setVisible: setBoxesVisible, visible: boxesVisible, type: "feature", infoText: 'Basic Cubes with React Three Fiber', infoTitle: 'Basic Cubes'}, 
  {text: "Toggle Pattern1", setVisible: setPattern1Visible, visible: pattern1Visible, type: "feature", infoText: 'A plane with a sine wave moving through it', infoTitle: 'Pattern 1'},
  // {text: "PAW PADS", setVisible: setSVGWalkerVisible, visible: svgWalkerVisible, type: "feature", infoText: 'SVG stamp animation. Initially I wanted to move page content with the paw direction to emphasize the movement.', infoTitle: 'SVGs in Motion'},
  {text: "Toggle Poems", setVisible: setPoem1Visible, visible: poem1Visible, type: "feature", infoText: 'A Series of poems.', infoTitle: 'Poetry', lastUpdated: '8/26/22'},
  {text: "Toggle Art Gallery", setVisible: setArtGalleryVisible, visible: artGalleryVisible, type: "feature", infoText: 'Visual Art', infoTitle: 'Visual Arts', isNew: true},
  // {text: "About Me", setVisible: setAboutMeVisible, visible: aboutMeVisible, type: 'feature', infoText: 'About Me', infoTitle: 'About'}
  ]

  const [sidebarOpen, setSidebar] = useState(false)
  const [sideBarItems, setSidebarItems] = useState(sidebarItemsArr)

  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  let pixelRatio = Math.ceil(window.devicePixelRatio)
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }
  useEffect(() => {
          window.addEventListener('resize', handleWindowSizeChange);
          return () => {
              window.removeEventListener('resize', handleWindowSizeChange);
          }
  }, []);
  //const canvasStyles = pixelRatio > 1 ? { width: width * pixelRatio, height: height * pixelRatio, style: {width: `${width}px`, height: `${height}px`}  } :  { width: width, height: height }
  const canvasStyles = { width: width, height: height }
  let bIsMobile = (width <= 768) || (height >= 1300 && bIsBrooke) || (pixelRatio > 1 && width <= 1000) 
  let socialIconClass = bIsMobile ? "sidebarSocialMobile" : "sidebarSocial"

  if(!bIsMobile){
    sidebarItemsArr.push({text: "DOUBLE Poem", setVisible: setDoublePoemVisible, visible: doublePoemVisible, type: "feature", infoText: 'A component where both my Love and I wrote a poem and put together a design. It follows the cursor in certain places and triggers animations on some positions.', infoTitle: 'A Joint Poem'})
    //sidebarItemsArr.push({text: "Cursor Draft", setVisible: setSVGCursorVisible, visible: svgCursorVisible, type: "feature", infoText: 'The concept is someone has a logo/banner where you click it and it becomes the cursor until you make a selection.', infoTitle: 'Moveable Header Demo'})
  }
  if(bIsMobile){
    sidebarItemsArr.push({text: "Stealth Rocks", setVisible: setStealthRocksVisible, visible:stealthRocksVisible, type: "feature", infoText: ''})
  }
  if(bIsDebug){
    sidebarItemsArr.push({text: "Helper Plane", setVisible: setHelperPlaneVisible, visible: helperPlaneVisible, type: "feature", infoText: ''})
  }
  sidebarItemsArr.push({text: "buttonTexthandledInComponent", setVisible: lockCamera, visible: isCameraLocked, type: "setting", infoText: 'Allows the camera to move for canvas based components.', infoTitle: 'Locks Camera For Canvas Components'},  {text: "handledInComponent(effects)", setVisible: setPostProcessingVisible, visible:postProcessingVisible, type: "effects", infoText: 'Toggle a layer of effects for canvas based components.', infoTitle: 'Toggle Canvas Effects'})
  return (
    <>
    {/* take note that some of these are purposely outside the canvas element, where other components must be within it */}
    <Fragment>
      {/* Icon */}
      {sidebarOpen && bIsMobile ? <div style={{background: 'white', opacity:'80%', textAlign: 'right', width:'100%', position:'flex', height:'5%', paddingRight:'8px', alignContent:'right', justifyContent: 'right', verticalAlign:'middle', fontSize: '11px', float:'right'}}><p>More options available on desktop version!</p></div> : null}
      {!hidesidebar ? (sidebarOpen ? <MenuFoldOutlined className="toggleSidebarNoShadow" onClick={() => setSidebar(false)} /> : <MenuUnfoldOutlined className="toggleSidebar" onClick={() => setSidebar(true)}/>) : null}
      {!hidesidebar ? 
        <Sidebar
          show={sidebarOpen}
          autoClose={() => setSidebar(false)}
          items={sideBarItems}
          bIsMobile={bIsMobile}
          cameraLocked={isCameraLocked}
          effectActive={postProcessingVisible}
          setInfoDivText={setInfoDivText}
          key="sidebar"
        />
      : null}
      {!hidesidebar && sidebarOpen ? <><div className="sidebarSocialContainer"><TwitterOutlined className={socialIconClass} onClick={()=> window.open("https://twitter.com/smerickson89", "twitter")} /> <SoundOutlined className={socialIconClass} onClick={()=> window.open("https://soundcloud.com/smerickson89", "soundcloud")}/></div></>: null}
      {infoDivVisible ? <InfoDiv message={infoDivText} /> : null} 
    </Fragment>
    
    {/* Navigation for the poem page (outside of canvas) */}
    {poem1Visible ? <CenterNav show={true} bIsMobile={bIsMobile} items={Poems} activeMember={activePoem} setActive={setActivePoem}  /> : null}

    {doublePoemVisible ? <DoublePoem setSidebar={() => setSidebar(!sidebarOpen)} disableRepeatText={() => {
          if(repeatTextVisible){
            setRepeatTextVisible(!repeatTextVisible)
          }
        }}/> : null}
    {aboutMeVisible ? <AboutMe /> : null}

    {grid1Visible ? <Grid
          className="grid"
          // Arbitrary data, should contain keys, possibly heights, etc.
          data={data}
          // Key accessor, instructs grid on how to fet individual keys from the data set
          keys={d => d.name}
          // Can be a fixed value or an individual data accessor
          heights={d => d.height}
          // Number of columns
          columns={2}
          // Space between elements
          margin={70}
          // Removes the possibility to scroll away from a maximized element
          lockScroll={false}
          // Delay when active elements (blown up) are minimized again
          inactiveDelay={500}
          // Regular react-spring configs
          config={config.slow}>
          {(data, maximized, toggle) => (
            <GridCell {...data} maximized={maximized} toggle={toggle} />
          )}
        </Grid> : null}

    {repeatTextVisible ? <RepeatingText  text='Warm+SFT+' bSidebarOpen={sidebarOpen} bIsMobile={bIsMobile} /> : null}

    {/* {svgCursorVisible ?<SVGCursor color="teal" setSidebar={() => setSidebar(!sidebarOpen)} disableRepeatText={() => setRepeatTextVisible(!repeatTextVisible)} /> : null} */}

    <Canvas gl={{ antialias: true }} style={canvasStyles} camera={{position: [0, 0, 5], far: 40000}}   >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} intensity={0.5} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      {stealthRocksVisible ? <StealthRocksMesh width={1} /> : null} 
      {artGalleryVisible ? <Suspense fallback={<Box />}><ArtGallery /></Suspense> : null}

      {/* <Fortune /> */}
      {poem1Visible ? <Poem poems={Poems} bIsMobile={bIsMobile} activePoem={activePoem} disableRepeatText={() => 
        {
          if(repeatTextVisible){
            setRepeatTextVisible(!repeatTextVisible)
          }
        }}/> : null}
      {pattern1Visible ? <Pattern1 /> : null}

      {boxesVisible ? 
      <>
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} /> 
      </>
      : null}

      {/* create a map. within the map do another for loop... so for each row create a number of cubes based on columns */}
      {/* {helperPlaneVisible ? 
      <>
      {squarePositions.map((position, index) =>
        // <SingleSVG key={index} pos={position} scale={props.scl}  />
        <mesh position={position} scale={[1, 1, 1]}>
        <planeBufferGeometry args={[1, 1]}  />
        <meshBasicMaterial wireframe={index & 1 ? true : false} color={index & 1 ? "green" : "teal"} />
        </mesh>
       )}
      <HelperPlane2 />
      </>
      : null} */}
      {svgWalkerVisible ? 
        // <Suspense fallback={null}>
        <SVGWalker 
          pos={[opts.posX, opts.posY, opts.posZ]} 
          posX={opts.posX}
          posY={opts.posY}
          posZ={opts.posZ}
          scl={[opts.scale, opts.scale, opts.scale]} 
          count={6}
          isRandom={false}
        /> : null}
        {/* </Suspense>  */}
      <PositionRig reset={isCameraLocked}  />
      {/* <color attach="background" args={['#f0f0f0']} /> */}
      {postProcessingVisible ? 
      <>
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} opacity={3} />
        <Noise opacity={0.025} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        {/* <SSAO samples={31} radius={10} intensity={30} luminanceInfluence={0.1} color="red" /> */}
      </EffectComposer>
      </> : null}
    </Canvas>

    {/* <DatGui data={opts} onUpdate={setOpts}>
        <DatNumber path="posX" min={-15} max={15} step={0.01} />
        <DatNumber path="posY" min={-15} max={15} step={0.01} />
        <DatNumber path="posZ" min={-15} max={15} step={0.01} />
        <DatNumber path="scale" min={0} max={0.1} step={0.0001} />
        <DatNumber path="offset" min={0} max={10} step={0.0001} />
      </DatGui> */}
    </>
  )
}
