import React, { useEffect, useState } from 'react'
import { animate, inView } from 'motion'
import { useSpring, a, config } from  "@react-spring/web"
import GalleryContent from '../components/GalleryContent'

//todo:
//currently many of the animate() functions below are based on html classes that are defined in the parent.
//---that is probably not good practice and I should pass a function and do them in the parent. but atm: lazy
function GalleryToggle(props) {
  const [isHoverable, setHoverable] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [isClickable, setIsClickable] = useState(true)
  const [clicked, setClicked] = useState(false)
  const [textState, setTextState] = useState('SHOW GALLERY')
  const doOpenAnimation = () => {
    animate('.galleryToggle', { //animate it upward to the middle
      bottom: ['-20%', '50%'],
    }, { duration: 2, delay: 0.25 })
    animate('.galleryToggle', { //change the color and scale it
      backgroundColor: [props.startColor, finishColor],
      zIndex: [9, 7],
      transform: ['scaleY(1) scaleX(1)', 'scaleY(6) scaleX(3)'],
    }, { duration: 2, delay: 1.5 })
    animate('.textContent', { //blur the other text that is visible
      filter: ['blur(2.5px)']
    }, { duration: 1.5, delay: 0 })
  }

  // const doCloseAnimation = () => {
  //   console.log('performing toggle close animation')
  //   animate('.galleryToggle', { //downscale, zindex and color
  //     backgroundColor: [finishColor, props.startColor],
  //     zIndex: [7, 9],
  //     transform: ['scaleY(6) scaleX(3)', 'scaleY(1) scaleX(1)'],
  //   }, { duration: 2, delay: 0.25 })
  //   animate('.galleryToggle', { //position back to its 'peaking' spot
  //     bottom: ['50%', '-20%'],
  //     opacity: [0]
  //   }, { duration: 1, delay: 1 })
  //   animate('.textContent', { //disable blur on the other text
  //     filter: ['blur(0px)'],
  //   }, { duration: 3, delay: 0 })
  //   setTextState('') //in case they open the art gallery menu again, reset the state
  // }

  // const resetState = (doAnimations) => {
  //   if(doAnimations){
  //     doCloseAnimation()
  //   }
  //   // setTimeout(() => {
  //     console.log('setting hovereable to true.')
  //     setHoverable(true) //allow hover events again
  //     // setClicked(false) //set to no longer clicked
  //     setTextState('SHOW GALLERY') //in case they open the art gallery menu again, reset the state
  //     setHovered(false) //in case it still thinks the cursor is on it
  //   // }, 2400)
  // }

  const onClick = () => {
    //if we click it and it was not already clicked
    if(!clicked){
      setTextState('') //remove text
      setClicked(true) //set this component to realize it has now been clicked.
      setHoverable(false) //remove the ability to hover
      doOpenAnimation()
      setTimeout(() => {
        props.setCanvasZindex('13') //bring the canvas in front of the html body after a short delay
        props.setShowGallery(true) //tell app.js to enable the art gallery after a short delay
      }, 850)
      animate('.menuOptions', { //fade the canvas from 0 to 1 -- is this necessary?
        opacity: [0, 1]
      }, { duration: 6, delay: 3 })
      props.setArtGalleryOpen(true) //tell app that the gallery should be open
      document.body.classList.add('unscrollable')
      document.body.classList.remove('scrollable')
    }
    // else //if we were already clicked and the gallery should be active disable things.
    // {
    //   resetState(true)
    // }
  }

  useEffect(() => {
    // console.log('props.ready = ' + props.ready + '; clicked = ' + clicked)
    if(props.ready){
      animate('.galleryToggle', {
        bottom: ['0%', '-20%'],
        opacity: [0, 1],
        height: ['0%', '35%'],
        transform: ['scaleY(1) scaleX(1)'],
        zIndex: [11]
      }, { duration: 1, delay: 0 })
    }
    else{
      //if we haven't clicked the new menu unhide it
      if(!clicked){
        animate('.galleryToggle', {
          bottom: ['-20%', '0%'],
          opacity: [0],
          height: ['35%', '0%'],
        }, { duration: 1, delay: 0 })
      }
      else{
        // animate('.galleryToggle', {
        //   pointerEvents: 'none',
        // }, { duration: 0, delay: 0 })
        console.log('clicked: ' + clicked)
        // animate('.galleryToggle', {
        //   bottom: ['-20%', '0%'],
        //   opacity: [0],
        //   height: ['35%', '0%'],
        //   zIndex: [11, 0]
        // }, { duration: 1, delay: 0 })
      }
    }
  }, [props.ready])

  const handleMouseEnter = () => {
    if(isHoverable){
      setHovered(true)
      setTextState('DO IT!')
      animate('.textContent', {
        filter: [ 'blur(2px)']
      }, { duration: 1, delay: 0 })
    }
  }
  const handleMouseLeave = () => {
    if(isHoverable){
      setHovered(false)
      setTextState('SHOW GALLERY')
      animate('.textContent', {
        filter: ['blur(0px)']
      }, { duration: 1, delay: 0 })
    }
  }
  const finishColor = props.finishColor ?? 'green'
  const { height, width, left, opacity } = useSpring({
    height: isHoverable && hovered ? '40%' : '35%',
    width: isHoverable && hovered ? '75%' : '50%',
    left: isHoverable && hovered ? '10%' : '25%',
    opacity : isHoverable && hovered ? 1 : 0.5,
    config: config.molasses
  })
  return (
    <><div className='hideOverflowInner'>
    <a.div
      className={hovered ? 'galleryToggle hoverPointer' : 'galleryToggle'}
      style={{ height: height, width: width, left: left, backgroundColor: props.startColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
     <a.div className='textState' style={{ opacity: opacity }}>{textState}</a.div>
    </a.div></div></>
  )
}

export default GalleryToggle
