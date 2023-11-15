import React, { lazy, useState, Fragment, useEffect, useRef, useContext, memo, createContext, Suspense, useCallback, useMemo } from 'react'
import { animate, inView } from 'motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { animated, SpringValue, useSpring, useChain, useTransition, useSpringRef } from "@react-spring/web"
import { a, config, useSpring as canvasUseSpring } from '@react-spring/three'
import { Selection, Select, EffectComposer, Bloom, Noise, Vignette, SelectiveBloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useIdleTimer } from 'react-idle-timer'

import BabeAndI from './images/Photos/babeandi.jpg'
import MenuCanvasText from './components/MenuCanvasText'
import SocialFollow from './components/SocialFollow'
import Lines from './components/Lines'
import Spheres from './components/Spheres'
import SunMenu from './components/GalleryRemakeSun'
import GalleryRemakeBottom from './components/GalleryRemakeBottomDiv'
import MenuItem from 'antd/lib/menu/MenuItem'
import GalleryContent from './components/GalleryContent'
import DOMPoems from './components/PoemsDOM'
import MathLearning from './components/MathLearning'
import GlowingCanvas from './components/EffectCompositions/GlowingCanvas'
import { Effect } from 'postprocessing'

const TimeStickingComponent = ({ initialFormattedTime, everyOther }) => {
  const [stickyTime, setStickyTime] = useState(initialFormattedTime)
  return (
    <h4 className={everyOther ? 'read' : 'read2' }>{everyOther ? 'Read' : 'Seen'} {stickyTime}</h4>
  )
}

const PrintZIndex = () => {
  const elements = Array.from(document.querySelectorAll('*')) // Select all elements in the DOM and convert to an array
    const elementsWithZIndex = elements
      .map((element) => {
        const zIndex = window.getComputedStyle(element).getPropertyValue('z-index')
        const className = element.className
        const tagName = element.tagName
        return { element, zIndex, className, tagName }
      })
      .filter(({ zIndex }) => zIndex !== 'auto');
    // Sort the elements by z-index in descending order
    elementsWithZIndex.sort((a, b) => b.zIndex - a.zIndex)
    elementsWithZIndex.forEach(({ className, tagName, zIndex }) => {
      if (className) {
        console.log(`Element with class: ${className}, tag: ${tagName}, z-index: ${zIndex}`)
      } else {
        console.log(`Element with tag: ${tagName}, z-index: ${zIndex}`)
      }
    })
}

const ContentTextArray = [
  //The basis of perception, is participation. The creative interplay of our overlapping senses link us to an animate world. \\nWe must depart from our devices and heads and return to our senses -- in doing so realizing our connection with the living, dynamic world.
  "Hi. I'm a Midwest-based software developer, artist, sound designer and eclectic. \\nThis is me, with my fiance Brooke. <3 \\nFeel free to poke around; and be sure to find the galleries on the bottom of the art and poem menus. \\nI believe we should reclaim the terms 'amateur' and 'dilettante' from our consumerist society -- because interests and experiences that do not generate income are still enjoyable and valuable. \\nI enjoy hiking, reading, painting, writing, and making music. \\nMy favorite sounds are the fluttering of birch leaves and loon calls -- find them.\\n", //My patience is sparse for car and plane noise when I'm outdoors, Ask me about recording dolphins
  //art we are all travelers of a sensuous world.
  "Art is play, it is exploration, it is experimentation. It captures sensations, movements, emotions, in a given moment. \\nReaching through each person's filter, it affects their inner states, often unconsciously; thus, art can be incredibly therapeutic. \\nArt is inherently subjective; there is no standard for 'good' or 'bad' art, it either resonates in an individual or it does not. \\nFor me, it is a restless urge -- a drive to express myself every day.\\n",
  //poems
  "Poetry allows individuals to express their emotions and experiences in a structured, cathartic way: releasing stress, lowering cortisol levels, and promoting neuroplasticity. \\nPoetry mirrors the era of oral history -- where rhythm and meter were incorporated not only to aid memory, but infuse life into the tales.  In this way, oral history became a vibrant and communal experience spanning generations.\\nPoetry also spreads emotional resonance and cognitive stimulation. Metaphor meets us half way, it comes to us, stirring lonely souls, sparking empathy in the harshest minds. \\nThis resonance travels further when accompanied by rhythm.\\n",
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
  const [bUpArrowVisible, setUpArrowVisible] = useState(false)
  const [hideMenuItems, setHideMenuItems] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [showLines, setShowLines] = useState(true)
  const [showBottomMenu, setShowBottomMenu] = useState(false) //determines whether a div that transitions to art gallery on click is visible
  const [showGallery, setShowGallery] = useState(false) //determines if we should show the art gallery
  const [loadGallery, setLoadGallery] = useState(false) //state used to prevent hiccup when art gallery loads
  const [ArtGalleryOpen, setArtGalleryOpen] = useState(false)
  const [delayBottomNavClose, setDelayBottomNavClose] = useState(false)
  const [bottomMenuReady, setBottomMenuReady] = useState(currentItem === 'ART' && showBottomMenu)
  const [showPoemMenu, setShowPoemMenu] = useState(false)
  const [bResetSlowDown, setBResetSlowDown] = useState(false)
  const [firstExplosionComplete, setFirstExplosionComplete] = useState(false)
  const [singlePoemIsActive, setSinglePoemIsActive] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight)
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
  const pixelRatio = Math.ceil(window.devicePixelRatio)
  const bIsMobile = (canvasWidth <= 768) || (canvasHeight >= 1300) || (pixelRatio > 1 && canvasWidth <= 1000) 
  const [headerClassName, setHeaderClassName] = useState(!bIsMobile ? 'header' : 'headerMobile')
  useEffect(() => {
    setHeaderClassName(bIsMobile ? 'headerMobile' : 'header')
  }, [bIsMobile])
  // console.log('isMobile: ' + bIsMobile)
  //intro load animations
  useEffect(() => {
    animate(`.${headerClassName}`, {
      y: [-100, 0],
      opacity: ['0%', '100%'],
      background: 'transparent'
    }, { duration: 1, delay: 1.5 })
    animate('.social-container', {
      y: [100, 0],
      opacity: [1]
    }, { duration: 1, delay: 0.5 })
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

  const [idle, setIsIdle] = useState(false)
  const [idleCount, setIdleCount] = useState(0)
  const [idleRemaining, setIdleRemaining] = useState(0)
  const onIdle = () => {
      setIsIdle(true)
  }
  const onActive = () => {
    setIsIdle(false)
  }
  const onAction = () => {
    setIdleCount(idleCount + 1)
  }
  const { getRemainingTime, reset } = useIdleTimer({
    onIdle,
    onActive,
    onAction,
    timeout: 5_500,
    throttle: 500
  })
  //this block creates the idle interval 
  useEffect(() => {
    if(bIsMobile){
      if (currentItem !== 'blank') {
        animate(`.${headerClassName} h1`, {
          y: [-100],
          opacity: ['0%'],
        }, { duration: 1, delay: 0.15 })
        animate(`.${headerClassName} h6`, {
          y: [-100],
          opacity: ['0%'],
        }, { duration: 1, delay: 0.15 })
        animate('.social-container', {
          y: [100],
          opacity: [0]
        }, { duration: 1, delay: 0.15 })
        const interval = setInterval(() => {
          setIdleRemaining(Math.ceil(getRemainingTime() / 1000))
        }, 500)
        return () => {
          clearInterval(interval)
        }
      } else {
        // Clear the interval if currentItem is not 'blank'
        setIdleRemaining(0) // Set idleRemaining to 0 when not 'blank'
        animate(`.${headerClassName} h1`, {
          y: [-100, 0],
          opacity: ['0%', '100%'],
        }, { duration: 1, delay: 0.15 })
        animate(`.${headerClassName} h6`, {
          y: [-100, 0],
          opacity: ['0%', '100%'],
        }, { duration: 1, delay: 0 })
        animate('.social-container', {
          y: [100, 0],
          opacity: [1]
        }, { duration: 1, delay: 0.25 })
      }
    }
  }, [currentItem])
  useEffect(() => {
    if(bIsMobile){
      if(currentItem === 'blank'){
      }
      else{
        if(idle){
          animate(`.${headerClassName} h1`, {
            y: [-100, 0],
            opacity: ['0%', '100%'],
          }, { duration: 1, delay: 0.15 })
          animate(`.${headerClassName} h6`, {
            y: [-100, 0],
            opacity: ['0%', '100%'],
          }, { duration: 1, delay: 0 })
          animate(`.${headerClassName}`, {
            background: ['linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))','linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))']
          }, { duration: 1, delay: 0 })
          animate('.social-container', {
            y: [100, 0],
            opacity: [1]
          }, { duration: 1, delay: 0.25 })
        }
        else{
          animate(`.${headerClassName} h1`, {
            y: [0, -100],
            opacity: ['0%'],
          }, { duration: 1, delay: 0.15 })
          animate(`.${headerClassName} h6`, {
            y: [0, -100],
            opacity: ['0%'],
          }, { duration: 1, delay: 0.15 })
          animate(`.${headerClassName}`, {
            background: ['linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))', 'linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))']
          }, { duration: 0.5, delay: 0 })
          animate('.social-container', {
            y: [0, 100],
            opacity: [0]
          }, { duration: 1, delay: 0.15 })
        }
      }
    }
  }, [idle])

  //refs
  const scrollableContainerRef = useRef()
  const textContentRef = useSpringRef()
  const menuRef = useSpringRef()
  const bgColorRef = useSpringRef()
  const lightsRef = useRef()

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

  const ResetWindow = (className) => {
    // console.log('Resetting Scroll')
    if(className === undefined || className === '' || className === null){
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
    else{
      if(bIsMobile)
         alert('resetting window for class: ' + className)
      const targetDiv = document.getElementById(className)
      const targetDivPosition = targetDiv.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: targetDivPosition,
        behavior: 'smooth' // You can use 'auto' for instant scrolling
      })
    }
  }

  useEffect(() => {
    if(currentItem !== 'blank'){ //if a menu item is chosen
      // console.log('currentItem: ' + currentItem)
      // textContentRef.start()
      if(!bIsMobile){
        animate('.galleryToggleSun', {
          pointerEvents: 'none'
        }, { duration: 0 })
      }
      if(bIsMobile){
        animate('.cDiv', {
          touchAction: 'none'
        }, { duration: 0 })
        animate('.subContent', {
          pointerEvents: 'all'
        }, { duration: 0 })
        animate('.subContent2', {
          pointerEvents: 'all'
        }, { duration: 0 })
        animate('.scrollable-container', {
          pointerEvents: 'all'
        }, { duration: 0 })
      }
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
      if(!bIsMobile){
        animate('.galleryToggleSun', {
          pointerEvents: 'all'
        }, { duration: 0 })
      }
      if(bIsMobile){
        animate('.cDiv', {
          touchAction: 'none'
        }, { duration: 0 })
        animate('.subContent', {
          pointerEvents: 'none'
        }, { duration: 0 })
        animate('.subContent2', {
          pointerEvents: 'none'
        }, { duration: 0 })
        animate('.scrollable-container', {
          pointerEvents: 'none'
        }, { duration: 0 })
      }
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


  const animationEasing = { easing: ["ease-in", "ease-out"] }

  const handleTransitionsComplete = () => {
    // galleryToggle
    reset() //unfortunately, this is the generic for the idle timer library. reset the timer on transition so that it waits a bit after animation
    setUpArrowVisible(false)
    setFirstExplosionComplete(true)
    setIsAbsolute(false)
    window.scrollTo(0, 0)
    setBResetSlowDown(false)
    let delayFirstSubcontent2 = true
    inView('section.subContent', (info) => {
      animate(info.target.querySelector('i'), { opacity: 0 }, { duration: 1, delay: 0.75, ...animationEasing})
      animate(info.target.querySelector('p'), { opacity: 1 }, { duration: 1, delay: 2, ...animationEasing})
      animate(info.target, { boxShadow: "6px 9px 9px #000" }, { duration: 4, delay: 2.5 , ...animationEasing})
      return leaveViewport
    }, { amount: "all", once: "true" }) 
    inView('section.subContent2', (info) => {
      if(delayFirstSubcontent2){
        setTimeout(() => {
          animate(info.target.querySelector('p'), { opacity: 1 }, { duration: 1, delay: 2, ...animationEasing })
          animate(info.target.querySelector('i'), { opacity: 0 }, { duration: 1, delay: 0.75, ...animationEasing})
          animate(info.target, { boxShadow: "-6px 9px 9px #F5F5F5" }, { duration: 4, delay: 1.5, ...animationEasing })
          if(currentItem === 'ABOUT'){
            animate(info.target.querySelector('img'), { opacity: 1 }, { duration: 2, delay: 2, ...animationEasing })
            animate('.imgContainer', { opacity: 1, borderColor: 'white'}, {duration: 2, delay: 2.5, ...animationEasing })
          }
          delayFirstSubcontent2 = false
          return leaveViewport  
        }, 1500)
      }
      else {
          animate(info.target.querySelector('p'), { opacity: 1 }, { duration: 1, delay: 2, ...animationEasing })
          animate(info.target.querySelector('i'), { opacity: 0 }, { duration: 1, delay: 0.75, ...animationEasing})
          animate(info.target, { boxShadow: "-6px 9px 9px #F5F5F5" }, { duration: 4, delay: 1.5, ...animationEasing })
          animate(info.target.querySelector('img'), { opacity: 1 }, { duration: 1, delay: 2, ...animationEasing })
          return leaveViewport  
      }
    }, {  amount: "all", once: "true" })
    inView('section.readContainer', (info) => {
      animate(info.target.querySelector('h4'), { opacity: 1 }, { duration: 1.5, delay: Math.floor(Math.random() * 3) + 3, ...animationEasing })
      return leaveViewport
    }, {  amount: "all", once: "true" })
    if((currentItem !== 'blank')){
      inView('.pageEnd', () => { //when this invisible div is scrolled upon, toggle state to show art gallery or poem gallery.
        // console.log("pageEnd has entered the viewport")
        if((currentItem === 'ART') && !ArtGalleryOpen && !showGallery){
          setShowBottomMenu(true)
          return () => {
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
        if(currentItem === 'ABOUT' || currentItem === 'GOALS'){
          setTimeout(() => {
            setUpArrowVisible(true)
          }, 1500)
          return () => {
            setTimeout(() => {
              setUpArrowVisible(false)
            }, 1000)
          }
        }
        return null
      })
    }
    setIsMenuItemClickable(true) //after transition, re-enable click of menu items
    setBCanvasPointerEvents(true)
  }

  useEffect(() => {
    if(showBottomMenu){
      animate('.galleryToggle', { pointerEvents: 'all' }, { duration: 0, delay: 0 }) //pointerEvents: 'none' is the problem
    }
    else{
      animate('.galleryToggle', { pointerEvents: 'none' }, { duration: 0, delay: 0 }) //pointerEvents: 'none' is the problem
    }
  }, [showBottomMenu])

  const startTransition = () => {
    reset() //unfortunately, this is the generic for the idle timer library. reset the timer on transition so that it waits a bit after animation
    animate('.galleryToggle', { opacity: [1, 0], zIndex: 0 }, { duration: 2, delay: 0 }) //pointerEvents: 'none' is the problem
    setIsAbsolute(true)
    setShowBottomMenu(false)
    setShowPoemMenu(false)
    setUpArrowVisible(false)
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
      transform: bIsMobile ?  "translate3d(0,100%,0) scale(1)" : "translate3d(100%,0,0) scale(1)",
      backgroundColor: MenuItemArray[lastIndex].primaryColor,
      zIndex: 3,
    },
    enter: {
      opacity: 1,
      transform: bIsMobile ? "translate3d(0,0%,0) scale(1)" : "translate3d(0%,0,0) scale(1)",
      backgroundColor: MenuItemArray[currentIndex].primaryColor,
      zIndex: 3, // Ensure the new content appears on top
    },
    leave: {
      opacity: 0,
      transform: bIsMobile ?  "translate3d(0,100%,0) scale(1)" : "translate3d(-100%,0,0) scale(0.1)",
      backgroundColor: MenuItemArray[lastIndex].primaryColor,
      zIndex: 3, 
    },
    config: bIsMobile ? config.gentle : config.molasses,
    reset: false,  
    exitBeforeEnter: false,
    immediate: false,
    onRest: handleTransitionsComplete,
    onStart: startTransition,
  })

  const [hoverColor, setHoverColor] = useState('black')
  const { backgroundColor } = useSpring({
    // backgroundColor: hoverColor === 'black' ? (showGallery ? thisItem.primaryColor : thisItem.thirdColor) : hoverColor,
    // ref: bgColorRef,
    // config: hoverColor === 'black' ? config.molasses : config.gentle
    backgroundColor: showLines ? (showGallery ? thisItem.primaryColor : thisItem.thirdColor) : 'grey',
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
    pointerEvents: bCanvasPointerEvents ? 'auto' : 'none',
    overflow: 'hidden'
    // userSelect: 'none'
  }

  useEffect(() => {
    if(ArtGalleryOpen){
      setTimeout(() => {
        setDelayBottomNavClose(true)
        setTimeout(() => {
          setDelayBottomNavClose(false)
        }, 1000)
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

    if(currentItem === 'ABOUT' || currentItem === 'GOALS'){
      setUpArrowVisible(true)
    }
    else{
      setUpArrowVisible(false)
    }
  }, [showBottomMenu, currentItem, currentIndex])

  // useEffect(() => console.log(JSON.stringify(thisItem)), [thisItem])
  const [ellipsesColor, setEllipsesColor] = useState(thisItem.primaryColor)
  useEffect(() => {
    setTimeout(() => {
      setEllipsesColor(thisItem.primaryColor)
    }, 500)
  })
  const Ellipses = () => {
    return (<div className="typing-notification">
              <div className="circle-container">
                  <div style={{ '--bg-color': ellipsesColor }} className="circle circle1"></div>
                  <div style={{ '--bg-color': ellipsesColor }} className="circle circle2"></div>
                  <div style={{ '--bg-color': ellipsesColor }} className="circle circle3"></div>
              </div>
          </div>)
  }
  let firstSubContent2 = true
  const [renderImage, setRenderImage] = useState(currentItem === 'ABOUT' && firstSubContent2)
  useEffect(() =>{ 
    if(currentItem === 'ABOUT' && firstSubContent2){
      if(lastItem === 'blank'){
        setRenderImage(true)
      }
      else {setTimeout(() => { setRenderImage(true)}, 600)} 
    }  
    else{
      setTimeout(() => {
        setRenderImage(false)
      }, 600)
    }
  }, [currentItem])

  const mathOnClick = () => {
    setShowLines(!showLines)
  }

  //todo. 
  //find sfx library. make / record my own. recording voice noises like 'phewwwww', 'cutcha' https://theshubhagrwl.medium.com/you-might-not-need-a-sound-library-for-react-a265870dabda
  //test with hdmi toggled to ps4 (the width and height and scale is different)
  //fix colors with particles... I can't find a way to make it not re-render yet lerp the color....
  //add a 'hit me back' message with my email.
  //add a sphere behind the main menu items that opacity = 1 when hovering... it rotates?.. or two stars that orbit the text? Could also add to header?
  //it seems like we can click the art gallery menu div even if it's not visible.. remove click events.
  //add a cooler scroll effect
  //https://css-tricks.com/snippets/svg/curved-text-along-path/ curve don't stare at the sun
  //it would be cool to make the subContents springs as well so we could have them bounce on the transition
  //https://threejs-journey.com/lessons/post-processing-with-r3f postprocessing
  //have when resetSlowdown active lerp the colors to all red or white
  //add a little downward slope like a message icon?
  //make the subcontents springs and tile them in like we do for the poems.
  return (
    <>
    <div className='cDiv' style={{ width: '100%', height: '100%'}}>
    <Canvas className='menuOptions' gl={{ antialias: false }} dpr={[1, 1.5]} style={canvasStyles} camera={{ position: [0, 0, 5] }}>
    {MenuItemArray.slice(1).map((menuitem, index) => (
      <MenuCanvasText
        index={index}
        key={menuitem.name}
        text={menuitem.name}
        position={menuitem.defaultPOS}
        color={menuitem.primaryColor}
        secondaryColor={menuitem.thirdColor}
        ref={menuRef}
        isClicked={menuitem.isClicked}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
        isClickable={isMenuItemClickable}
        setHovered={setHovered}
        bIsMobile={bIsMobile}
        hideMenuItems={hideMenuItems}
        setHoverColor={setHoverColor}
      />
    ))}
      {!showLines ? <MathLearning /> : null}
    
    {/* <Noise opacity={0.02} /> */}
      {!showGallery && showLines ? (
        <Selection enabled={true}>
        <EffectComposer multisampling={0}>
        <SelectiveBloom mipmapBlur radius={currentItem == 'blank' ? 0.55 : 0.9} luminanceThreshold={0.2} intensity={currentItem == 'blank' ? 3 : 0.75} />
        </EffectComposer>
        <Select>
          <Lines bIsMobile={bIsMobile} singlePoemIsActive={singlePoemIsActive} active={delay} dash={bIsMobile ? 0.975 : 0.982} count={100} radius={0.95} hovered={!delay ? false : hovered} ResetSlowDown={bResetSlowDown} firstExplosionComplete={firstExplosionComplete} colors={['white','#d62828','#f77f00', '#003049']} />
         </Select></Selection> 
      ) : null}
      
      {loadGallery ?
          <Suspense fallback={null}>
          <GalleryContent bIsMobile={bIsMobile} showGallery={showGallery} /></Suspense>
        : null}
      {/* <fog attach="fog" args={['#17171b', 0, 5]} /> */}
    </Canvas></div>
    {bIsMobile ? null : <SunMenu finishColor={thisItem.secondaryColor} ready={currentIndex === 0 ? true : false} headerName={headerClassName} />}
    <div className='body' ref={scrollableContainerRef}>
        <animated.div className='bg' ref={bgColorRef} style={{ backgroundColor }}>
          <div onClick={() => setCurrentItem('blank')} className={headerClassName}>
            <h1>WARM+SOFTWARE</h1><h5>by Stephen Erickson</h5>
            <h6 className='mathToggle' onClick={() => mathOnClick()}>{bIsMobile ? 'MOBILE' : 'BETA'}</h6>
          </div>
          {bIsMobile ? <div className='mobileTopSection'></div> : null}
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
                      if (renderImage) {
                        firstSubContent2 = false
                      }
                      return (
                      <React.Fragment key={index}> 
                        <div>
                        <section className={renderImage && index > 0 && index < 2 ? 'subContent2 imgStyle' : (everyOther ? 'subContent sb1' : 'subContent2 sb2')} onClick={textOnClick}>{renderImage && index > 0 && index < 2 ? <div className='imgContainer'><img className='aboutPhoto' src={BabeAndI} alt="BabeAndI" /></div> : null}<div className='centered'><p className='hidden'>{line.split('--').join(String.fromCharCode(8211)) }</p><i><div className='ellipsesContainer'><Ellipses /></div></i></div></section>
                        <section className='readContainer'>
                        {index < MenuItemArray[MenuItemArray.findIndex(item => item.name === lastItem)].textContent.split("\\n").length - 1 && <><TimeStickingComponent initialFormattedTime={formattedTime} everyOther={everyOther} /><br /></> }</section>
                        </div>
                      </React.Fragment>
                    )})
                  )}
                  <div className='pageEnd'></div>
                  {bUpArrowVisible ? <span className='upArrow' onClick={() => ResetWindow()}>&#8593;</span> : null}
                </animated.div>
              )
            )}
            </div>
          </section>
      </animated.div>
    </div>
    {!delayBottomNavClose ? <GalleryRemakeBottom bIsMobile={bIsMobile} setArtGalleryOpen={setArtGalleryOpen} setCanvasZindex={setCanvasZindex} setShowGallery={setShowGallery} finishColor={thisItem.primaryColor} startColor={thisItem.secondaryColor} ready={bottomMenuReady ? true : false}/> : null}
    {currentItem === "POEMS" ? <DOMPoems setHideMenuItems={setHideMenuItems} setSinglePoemIsActive={setSinglePoemIsActive} showPoemMenu={showPoemMenu} primaryColor={thisItem.thirdColor} secondaryColor={thisItem.primaryColor} setCanvasZindex={setCanvasZindex} setBCanvasPointerEvents={setBCanvasPointerEvents} bIsMobile={bIsMobile} /> : null}
    <SocialFollow />
    </>
  )
}
