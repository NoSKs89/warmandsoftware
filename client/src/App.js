import React, { lazy, useState, Fragment, useEffect, useRef, useContext, memo, createContext, Suspense, useCallback, useMemo } from 'react'
import { animate, inView } from 'motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { animated, SpringValue, useSpring, useChain, useTransition, useSpringRef } from "@react-spring/web"
import { a, config, useSpring as canvasUseSpring } from '@react-spring/three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import MenuCanvasText from './components/MenuCanvasText'
import SocialFollow from './components/SocialFollow'
import Lines from './components/Lines'
import Spheres from './components/Spheres'
import SunMenu from './components/GalleryRemakeSun'
import GalleryRemakeBottom from './components/GalleryRemakeBottomDiv'
import MenuItem from 'antd/lib/menu/MenuItem'
import GalleryContent from './components/GalleryContent'
// const GalleryContent = lazy(() => import('./components/GalleryContent'))
import DOMPoems from './components/PoemsDOM'
import GlowingCanvas from './components/EffectCompositions/GlowingCanvas'

const TimeStickingComponent = ({ initialFormattedTime, everyOther }) => {
  const [stickyTime, setStickyTime] = useState(initialFormattedTime)
  return (
    <h4 className={everyOther ? 'read' : 'read2' }>{everyOther ? 'Read' : 'Seen'} {stickyTime}</h4>
  )
}

const ContentTextArray = [
  //about //we contain multitudes. //My favorite voice is the gentle applause of birch trees, their lanky bodies swaying as leaves catch the wind. 
  //The basis of perception, is participation. The creative interplay of our overlapping senses link us to an animate world. \\nWe must depart from our devices and heads and return to our senses -- in doing so realizing our connection with the living, dynamic world.
  "Hi. I'm a Midwest-based software developer, artist, sound designer and eclectic. \\nI believe we should reclaim the terms 'amateur' and 'dilettante' from our consumerist society -- because interests and experiences that do not generate income are still enjoyable and valuable. \\nI enjoy hiking, reading, painting, writing, and making music. \\nMy favorite sounds are the fluttering of birch leaves and loon calls -- find them.\\n", //My patience is sparse for car and plane noise when I'm outdoors, Ask me about recording dolphins
  //art we are all travelers of a sensuous world.
  "Art is play, it is exploration, it is experimentation. It captures sensations, movements, emotions, in a given moment. \\nReaching through each person's filter, it affects their inner states, often unconsciously; thus, art can be incredibly therapeutic. \\nArt is inherently subjective; there is no standard for 'good' or 'bad' art, it either resonates in an individual or it does not. \\nFor me, it is a restless urge -- a drive to express myself every day.\\n",
  //poems
  "Poetry allows individuals to express their emotions and experiences in a structured, cathartic way: releasing stress, lowering cortisol levels, and promoting neuroplasticity. \\nPoetry mirrors the era of oral history -- where rhythm and meter were incorporated not only to aid memory, but infuse life into the tales.  In this way, oral history became a vibrant and communal experience spanning generations.\\nPoetry also spreads emotional resonance and cognitive stimulation. Metaphor meets us half way, it comes to us, stirring lonely souls, sparking empathy in the harshest minds. \\nThe resonance of words travels farther when accompanied by a beat.\\n",
  //goals //my secondary goal is to understand how to use less energy and be more efficient within my current profession
  "To be humbled and hungry to learn more of this unquantifiable existence. \\nWorried by the state of the world in the wake of consumerism. I believe that change is attainable, but only once we stop letting corporations control and influence from the shadows. \\nI'm working towards developing an informational platform: to raise awareness and share truth. \\nWe must realize that the planet and the life inhabiting it are an extension of our own bodies -- that the narrative for a thousand years of human exceptionalism has pushed our psyches further away from our own bodily senses, and one another. \\nAre we bound to a future of sitting idly in our own bubbles, hating the unfamiliar? \\nWe must come to understand that we are not separate. Not separate from our planet, our neighbors, our senses. \\nWhere we focus grows, and our attention is victim to the influence of endless agendas and actors. \\nI hope to use my skills to create a platform, founded in truth and compassion, that attempts to nudge us away from this.\\n"
]

const MenuItemArray = [
  { name: 'blank' , defaultPOS: [0,0,0], primaryColor: 'whitesmoke', secondaryColor: '#BBDEFB', thirdColor: 'black', textContent: 'blank \\n testetestektjlkjasldkfjlskdjflksdjflksdjflksjdflksjdf \\n lkjas;dlkfj;alskdjfjkasdfjklsdjf' },
  { name: 'GOALS', defaultPOS: [9, -2, 0], primaryColor: '#023E8A', secondaryColor: '#0077B6', thirdColor: '#03045E', textContent: ContentTextArray[3] },
  { name: 'POEMS', defaultPOS: [9, -1, 0], primaryColor: '#d62828', secondaryColor: '#f77f00', thirdColor: '#003049', textContent: ContentTextArray[2] },
  { name: 'ART', defaultPOS: [9, 0, 0], primaryColor: '#2f3e46', secondaryColor: '#52796f', thirdColor: '#84a98c', textContent: ContentTextArray[1] },
  { name: 'ABOUT', defaultPOS: [9, 1, 0], primaryColor: '#ff9505', secondaryColor: '#ffb627', thirdColor: '#cc5803', textContent: ContentTextArray[0] }
]

export default function App() {
  //intro load animations
  useEffect(() => {
    animate('.header', {
      y: [-100, 0],
      opacity: [0, 1]
    }, { duration: 1, delay: 1.5 })
    animate('.social-container', {
      y: [100, 0],
      opacity: [0, 1]
    }, { duration: 1, delay: 1.5 })
    animate('section.About', {
      y: [-100, 0],
      opacity: [0, 1]
    }, { duration: 1, delay: 0.5 })
    animate('.menuOptions', {
      top: ['-50%', '0%'],
      left: ['-50%', '0%'],
      opacity: [0, 1]
    }, { duration: 1, delay: 0.5 })
  }, [])

  //states
  const [canvasZindex, setCanvasZindex] = useState('0')
  const [bCanvasPointerEvents, setBCanvasPointerEvents] = useState(true)
  const [currentItem, setCurrentItem] = useState('blank') //handle main menu state
  const [lastItem, setLastItem] = useState('blank')//handle main menu state
  const lastIndex = MenuItemArray.findIndex(item => item.name === lastItem)
  const currentIndex = MenuItemArray.findIndex(item => item.name === currentItem)
  const [delay, setDelay] = useState(currentItem === 'blank') //state to delay the zIndex zooming of the background
  let everyOther = false //this is used to iterate on newlines if generated text
  const thisItem = useMemo(() => {
    // console.log('changing thisItem: ' +  JSON.stringify(MenuItemArray[MenuItemArray.findIndex(item => item.name === currentItem)]))
    return MenuItemArray[MenuItemArray.findIndex(item => item.name === currentItem)]
  }, [currentItem]) 
  const [isMenuItemClickable, setIsMenuItemClickable] = useState(true) //used to remove the other menu items during transitions
  const [isAbsolute, setIsAbsolute] = useState(true) //ok this is dumb, but the transitions only show when absolute, yet I want it to be relative to expand the viewport.... so
  
  const [hovered, setHovered] = useState(false)
  const [showBottomMenu, setShowBottomMenu] = useState(false) //determines whether a div that transitions to art gallery on click is visible
  const [showGallery, setShowGallery] = useState(false) //determines if we should show the art gallery
  const [loadGallery, setLoadGallery] = useState(false) //state used to prevent hiccup when art gallery loads
  const [ArtGalleryOpen, setArtGalleryOpen] = useState(false)
  const [delayBottomNavClose, setDelayBottomNavClose] = useState(false)
  const [bottomMenuReady, setBottomMenuReady] = useState(currentItem === 'ART' && showBottomMenu)
  const [showPoemMenu, setShowPoemMenu] = useState(false)
  const [bResetSlowDown, setBResetSlowDown] = useState(false)
  const [firstExplosionComplete, setFirstExplosionComplete] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight)
  const [singlePoemIsActive, setSinglePoemIsActive] = useState(false)
  const handleWindowSizeChange = () => {
    setCanvasWidth(window.innerWidth)
    setCanvasHeight(window.innerHeight)
  }
  useEffect(() => {
          window.addEventListener('resize', handleWindowSizeChange)
          return () => {
              window.removeEventListener('resize', handleWindowSizeChange)
          }
  }, [])

  //refs
  const scrollableContainerRef = useRef()
  const textContentRef = useSpringRef()
  const menuRef = useSpringRef()
  const bgColorRef = useSpringRef()

  //used to delay the art gallery load so it doesn't hiccup...//todo: make it NOT hiccup D:
  useEffect(() => {
    setTimeout(() => {
      setLoadGallery(true)
    }, 5000)
  }, [])

  //this is used to delay the positioning of the lines from zooming
  useEffect(() => {
    if(showGallery)
      setDelay(true)
      setBottomMenuReady(false)
  }, [showGallery])

  const ResetWindow = () => {
    window.scrollTo(0, 0)
    // setShowBottomMenu(false)
  }

  useEffect(() => {
    if(currentItem !== 'blank'){ //if a menu item is chosen
      // console.log('currentItem: ' + currentItem)
      // textContentRef.start()
      setTimeout(() => {
        setLastItem(currentItem)
      }, 1200)
      if(lastItem === 'blank'){
        animate('.scrollable-container', {
          opacity: [1]
        }, { duration: 1, delay: 1.5 })
      }
    }
    else { //if no main menu item selected
      setFirstExplosionComplete(false)
      // textContentRef.delete() 
      setShowBottomMenu(false) //if no menu, we should never see the art gallery menu
      setShowGallery(false) //we should therefore not see the gallery itself either
      setTimeout(() => {
        //change state of last item
        setLastItem(currentItem)
      }, 1600)
      //fade away the text replica div
      animate('.scrollable-container', {
        opacity: [1, 0]
      }, { duration: 1.1 })
      animate('.About', { 
        opacity: [1]
      }, { duration: 0 })
    }
    setCanvasZindex('0')
  }, [currentItem])
  const leaveViewport = () => {}



  const handleTransitionsComplete = () => {
    setFirstExplosionComplete(true)
    setIsAbsolute(false)
    window.scrollTo(0, 0)
    setBResetSlowDown(false)
    let delayFirstSubcontent2 = true
    inView('section.subContent', (info) => {
      animate(info.target.querySelector('i'), { opacity: 0 }, { duration: 1, delay: 0.75})
      animate(info.target.querySelector('p'), { opacity: 1 }, { duration: 1, delay: 2})
      animate(info.target, { boxShadow: "6px 9px 9px #000" }, { duration: 4, delay: 2.5 })
      return leaveViewport
    }, { amount: "all", once: "true" }) 
    inView('section.subContent2', (info) => {
      if(delayFirstSubcontent2){
        setTimeout(() => {
          animate(info.target.querySelector('p'), { opacity: 1 }, { duration: 1, delay: 2 })
          animate(info.target.querySelector('i'), { opacity: 0 }, { duration: 1, delay: 0.75})
          animate(info.target, { boxShadow: "-6px 9px 9px #F5F5F5" }, { duration: 4, delay: 1.5 })
          delayFirstSubcontent2 = false
          return leaveViewport  
        }, 3000)
      }
      else {
          animate(info.target.querySelector('p'), { opacity: 1 }, { duration: 1, delay: 2 })
          animate(info.target.querySelector('i'), { opacity: 0 }, { duration: 1, delay: 0.75})
          animate(info.target, { boxShadow: "-6px 9px 9px #F5F5F5" }, { duration: 4, delay: 1.5 })
          return leaveViewport  
      }
      
    }, {  amount: "all", once: "true" })
    inView('section.readContainer', (info) => {
      animate(info.target.querySelector('h4'), { opacity: 1 }, { duration: 1.5, delay: Math.floor(Math.random() * 3) + 3 })
      return leaveViewport
    }, {  amount: "all", once: "true" })
    if((currentItem === 'ART' || currentItem === 'POEMS') && !ArtGalleryOpen && !showGallery){
      inView('.pageEnd', () => { //when this invisible div is scrolled upon, toggle state to show art gallery or poem gallery.
        // console.log("pageEnd has entered the viewport")
        if((currentItem === 'ART') && !ArtGalleryOpen && !showGallery){
          setShowBottomMenu(true)
          return () => {
            // console.log('Scrolling away from pageEnd. ShowGallery: ' + showGallery + '; ArtGalleryOpen: ' + ArtGalleryOpen)
            if(!showGallery && !ArtGalleryOpen && !showBottomMenu)
              setShowBottomMenu(false) //this hides it when we scroll away -- but currently it also it is causing the onclick issue.
          }
        }
        if(currentItem === 'POEMS'){
          setShowPoemMenu(true)
          return () => {
            setShowPoemMenu(false)
            setBCanvasPointerEvents(true)
          }
        }
        return null
      })
    }
    setIsMenuItemClickable(true) //after transition, re-enable click of menu items
    // setCanvasZindex(0)
  }

  const startTransition = () => {
    setIsAbsolute(true)
    setShowBottomMenu(false)
    setShowGallery(false)
    setArtGalleryOpen(false)
    setBottomMenuReady(false)
    setBResetSlowDown(true)
    document.body.classList.add('scrollable')
    document.body.classList.remove('unscrollable')
    try{
      ResetWindow()
    }catch(e){}
    setIsMenuItemClickable(false)
  }

  //use to set the timestamps
  const [formattedTime, setFormattedTime] = useState('')
  useEffect(() => {
    const updateTime = () => {
      const currentTime = new Date()
      const hours = currentTime.getHours()
      const minutes = currentTime.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      // Convert hours from 24-hour format to 12-hour format
      const formattedHours = hours % 12 || 12
      // Add leading zero to minutes if less than 10
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
      // Combine the formatted time components
      const formattedTimeString = `${formattedHours}:${formattedMinutes} ${ampm}`
      setFormattedTime(formattedTimeString)
    }
    // Update the time initially and then every minute
    updateTime()
    const intervalId = setInterval(updateTime, 60000)
    // Clear the interval on component unmount
    return () => clearInterval(intervalId)
  }, [currentItem])

  //https://www.react-spring.dev/docs/advanced/events
  const contentTransitions = useTransition(currentItem, {
    ref: textContentRef,
    keys: currentItem,
    from: {
      opacity: 0,
      transform: "translate3d(100%,0,0) scale(1)",
      backgroundColor: MenuItemArray[lastIndex].primaryColor,
      zIndex: 3,
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%,0,0) scale(1)",
      backgroundColor: MenuItemArray[currentIndex].primaryColor,
      zIndex: 3, // Ensure the new content appears on top
    },
    leave: {
      opacity: 0,
      transform: "translate3d(-100%,0,0) scale(0.1)",
      backgroundColor: MenuItemArray[lastIndex].primaryColor,
      zIndex: 3, 
    },
    config: config.molasses,
    reset: false,  
    exitBeforeEnter: false,
    immediate: false,
    onRest: handleTransitionsComplete,
    onStart: startTransition,
  })

  const { backgroundColor } = useSpring({
    backgroundColor: showGallery ? thisItem.primaryColor : thisItem.thirdColor,
    ref: bgColorRef,
    config: config.molasses
  })

  //this orders the animation of the springs and usetransition
  useChain([menuRef, textContentRef, bgColorRef], [0, 0.6, lastItem === 'blank' || currentItem === 'blank' ? 0.75 : 1.9]) //quick explosive color transitions between no selection, but slower when lerping between items
  const textOnClick = () => {
    // console.log('Clicked')
  }
  useEffect(() => {
    setTimeout(() => {
      setDelay(currentItem === 'blank')
    }, 800)
  }, [currentItem])

  const canvasStyles = {
    width: canvasWidth,
    height: canvasHeight,
    position: 'fixed',
    zIndex: canvasZindex,
    background: 'transparent',
    pointerEvents: bCanvasPointerEvents ? 'auto' : 'none'
  }

  useEffect(() => {
    if(ArtGalleryOpen){
      setTimeout(() => {
        setDelayBottomNavClose(true)
        setDelayBottomNavClose(false)
        setBottomMenuReady(false)
      }, 2500)
      animate('.About', {
        opacity: [1, 0]
      }, { duration: 1.1 })
      ResetWindow()
    }
    else{
      animate('.About', {
        opacity: [0,1],
        zIndex: [12]
      }, { duration: 1.1 })
    }
  },[ArtGalleryOpen])
  useEffect(() => {
    if (currentItem === 'ART' && showBottomMenu) {
      setBottomMenuReady(true)
    } else {
      setBottomMenuReady(false)
    }
  }, [showBottomMenu, currentItem, currentIndex])

  // useEffect(() => console.log(JSON.stringify(thisItem)), [thisItem])
  const [elipsesColor, setElipsesColor] = useState(thisItem.primaryColor)
  useEffect(() => {
    setTimeout(() => {
      setElipsesColor(thisItem.primaryColor)
    }, 500)
  })
  const Elipses = () => {
    return (<div class="typing-notification">
              <div class="circle-container">
                  <div style={{ '--bg-color': elipsesColor }} class="circle circle1"></div>
                  <div style={{ '--bg-color': elipsesColor }} class="circle circle2"></div>
                  <div style={{ '--bg-color': elipsesColor }} class="circle circle3"></div>
              </div>
          </div>)
  }
  //todo. 
  //find sfx library. make / record my own. recording voice noises like 'phewwwww', 'cutcha' https://theshubhagrwl.medium.com/you-might-not-need-a-sound-library-for-react-a265870dabda
  //----every other text thing should make a shimmer and the final one loaded should be different
  //do a spell check!!
  //test with hdmi toggled to ps4 (the width and height and scale is different)
  //fix colors with particles... I can't find a way to make it not re-render yet lerp the color....
  //add a 'hit me back' message with my email.
  //add the titles to the art gallery.
  //add a sphere behind the main menu items that opacity = 1 when hovering... it rotates?.. or two stars that orbit the text? Could also add to header?
  //color of the lines should shift, it's only changing on when first rendered.
  //move stars on hover 4 menu
  //it seems like we can click the art gallery menu div even if it's not visible.. remove click events.
  //add a cooler scroll effect
  //slow motion state for lines chugs quite a bit.
  //I think the zindex is fading back automatically on first menu item click for lines still...
  //create a blinking arrow or something to guide users to the end of the scroll
  //https://css-tricks.com/snippets/svg/curved-text-along-path/ curve don't stare at the sun
  return (
    <>
    <div style={{ width: '100%', height: '100%'}}>
    <Canvas className='menuOptions' gl={{ antialias: true }} style={canvasStyles} camera={{ position: [0, 0, 5], far: 10000 }}>
    {MenuItemArray.slice(1).map((menuitem, index) => (
      <MenuCanvasText
        index={index}
        key={menuitem.name}
        text={menuitem.name}
        position={menuitem.defaultPOS}
        color={thisItem.primaryColor}
        secondaryColor={thisItem.secondaryColor}
        ref={menuRef}
        isClicked={menuitem.isClicked}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
        isClickable={isMenuItemClickable}
        setHovered={setHovered}
      />
    ))}
      {!showGallery ? (
        <Lines singlePoemIsActive={singlePoemIsActive} active={delay} dash={0.99} count={100} radius={1} hovered={!delay ? false : hovered} ResetSlowDown={bResetSlowDown} firstExplosionComplete={firstExplosionComplete} colors={['white', thisItem.primaryColor, thisItem.secondaryColor, thisItem.thirdColor]} />
      ) : null}
      {loadGallery ? <Suspense fallback={null}>
          <GalleryContent showGallery={showGallery} />
        </Suspense> 
        : null}
    </Canvas></div>
    <SunMenu finishColor={thisItem.secondaryColor} ready={currentIndex === 0 ? true : false} />
    <div className='body' ref={scrollableContainerRef}>
        <animated.div className='bg' ref={bgColorRef} style={{ backgroundColor }}>
          <div className='header'>
            <h1>WARM+SOFTWARE</h1>
            <h6>BETA</h6>
          </div>
          <section className='About' style={{overflow: isAbsolute ? 'hidden !important' : 'auto'}}>
            <div className='scrollable-container'>
            {contentTransitions((style, item) =>
              (
                <animated.div
                  className='textContent'
                  ref={textContentRef}
                  style={{ ...style, position: isAbsolute ? 'absolute' : 'relative', top: 0, left: 0 }}
                >
                  {(
                    //we create a new div for each time the text hits an \\n 
                    //every other has different css
                    //we also have a 'Read receipt' message that fades in as well.
                    MenuItemArray[MenuItemArray.findIndex(item => item.name === lastItem)].textContent.split('\\n').map((line, index) => {
                      everyOther = !everyOther
                      if (line.trim() === "") {
                        everyOther = false
                        return null
                      }
                      return (
                      <React.Fragment key={index}>
                        <div>
                        <section className={everyOther ? 'subContent' : 'subContent2'} onClick={textOnClick}><p className='hidden'>{line.split('--').join(String.fromCharCode(8211)) }</p><i><Elipses /></i></section>
                        <section className='readContainer'>
                        {index < MenuItemArray[MenuItemArray.findIndex(item => item.name === lastItem)].textContent.split("\\n").length - 1 && <><TimeStickingComponent initialFormattedTime={formattedTime} everyOther={everyOther} /><br /></> }</section>
                        </div>
                      </React.Fragment>
                    ) })
                  )}
                  <div className='pageEnd'></div>
                </animated.div>
              )
            )}
            </div>
          </section>
      </animated.div>
      
    </div>
    {!delayBottomNavClose ? <GalleryRemakeBottom setArtGalleryOpen={setArtGalleryOpen} setCanvasZindex={setCanvasZindex} setShowGallery={setShowGallery} finishColor={thisItem.primaryColor} startColor={thisItem.secondaryColor} ready={bottomMenuReady ? true : false}/> : null}
    {currentItem === "POEMS" ? <DOMPoems setSinglePoemIsActive={setSinglePoemIsActive} showPoemMenu={showPoemMenu} primaryColor={thisItem.thirdColor} secondaryColor={thisItem.primaryColor} setCanvasZindex={setCanvasZindex} setBCanvasPointerEvents={setBCanvasPointerEvents} /> : null}
    
    <SocialFollow />
    </>
  )
}
