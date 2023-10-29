import React, { useEffect, useState } from 'react'
import { animate, inView } from 'motion'

import GalleryContent from '../components/GalleryContent'

//todo:
//currently many of the animate() functions below are based on html classes that are defined in the parent.
//---that is probably not good practice and I should pass a function and do them in the parent. but atm: lazy
function GalleryToggle(props) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const textShadowString = '5px 5px 5px #000'

  useEffect(() => {
    if(props.ready){
      animate('.galleryToggle', {
        y: ['-30%', '15%'],
        opacity: [0, 1]
      }, { duration: 2, delay: 2 })
      animate('.header h1', {
        textShadow: ['none', textShadowString]
      }, { duration: 2.5, delay: 2.5 })
      // animate('.textContent', {
      //   textShadow: ['5px 5px 5px #000', '5px 5px 5px #000']
      // }, { duration: 2, delay: 0.25 })
    }
    else{
      animate('.header h1', {
        textShadow: ['5px 5px 5px #000', 'none']
      }, { duration: 1, delay: 1 })
      animate('.galleryToggle', {
        y: ['15%', '-30%'],
        opacity: [1, 0]
      }, { duration: 1, delay: 0 })
    }
    
  }, [props.ready])

  const handleMouseEnter = () => {
    animate('.galleryToggle', {
        y: [0, 500],
      }, { duration: 2, delay: 1.5 })
  }

  const handleMouseLeave = () => {
    animate('.galleryToggle', {
        y: [500, 0],
      }, { duration: 2, delay: 1.5 })
  }

  const scale = hovered ? 5 : 1;
  const style = {
    transform: `scale(${scale})`,
  }

  const finishColor = props.finishColor ?? 'green'

  const onClick = () => {
    if(!clicked){
      animate('.galleryToggle', {
        top: ['0%', '50%'],
        left: ['5%', '50%']
      }, { duration: 2, delay: 0.25 })
      animate('.galleryToggle', {
        scale: [1, 18],
        backgroundColor: ['black', finishColor],
        zIndex: [9, 7],
        // rotate: [0, 60],
      }, { duration: 2, delay: 1.5 })
      animate('.header h1', {
        textShadow: [textShadowString, 'none']
      }, { duration: 1, delay: 2.5 })
      animate('.galleryContent', {
        opacity: [0, 1]
      }, { duration: 1, delay: 2.5 })
      animate('.About', {
        filter: ['blur(0px)', 'blur(2.5px)']
      }, { duration: 1.5, delay: 0.5 })
      setClicked(true)
    }
    else {
      animate('.galleryToggle', {
        scale: [18, 1],
        backgroundColor: [finishColor, 'black'],
        zIndex: [7, 9],
        // rotate: [60, 0], // Add this line to rotate by 60 degrees
      }, { duration: 2, delay: 0.25 })
      animate('.galleryToggle', {
        top: ['50%', '0%'],
        left: ['50%', '5%']
      }, { duration: 2, delay: 1.5 })
      animate('.header h1', {
        textShadow: ['none', textShadowString]
      }, { duration: 1, delay: 2.5 })
      animate('.galleryContent', {
        opacity: [1, 0]
      }, { duration: 1, delay: 0.25 })
      animate('.About', {
        filter: ['blur(2px)', 'blur(0px)']
      }, { duration: 3, delay: 0.5 })
      setClicked(false)
    }
    
  }

  return (
    <div
      className='galleryToggle'
      style={style}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
     {/* <svg height="100%" width="100%" viewBox="0 0 599 554" fill="none" xmlns="http://www.w3.org/2000/svg"></svg> */}
      <div className='clickMe'>CLICK ME</div>
      <div className='galleryContent' style={{opacity: 0}}>
        TEST<br />TEST<br />TEST<br />TEST<br />TEST<br />TEST<br />TEST<br />TEST<br />TEST<br />TEST
        </div>
    </div>
  );
}

export default GalleryToggle;
