import React, { useEffect, useState } from 'react'
import { animate, inView } from 'motion'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faSun } from '@fortawesome/free-solid-svg-icons'

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
        top: ['-4.5%', '50%'],
        left: ['3.5%', '50%']
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
        top: ['50%', '-4.5%'],
        left: ['50%', '3.5%']
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
     <svg height="100%" width="100%" viewBox="0 0 599 554" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M537 268.5C537 416.788 416.788 537 268.5 537C120.212 537 0 416.788 0 268.5C0 120.212 120.212 0 268.5 0C416.788 0 537 120.212 537 268.5Z" fill="black"/>
      <path d="M51.2036 341.862C47.0705 309.142 79.5778 283.999 110.208 296.225L211.196 336.533C250.093 352.059 294.468 343.557 324.872 314.753L408.994 235.058C496.613 152.051 635.483 247.28 589.621 358.922L538.213 484.068C512.968 545.523 440.082 571.619 381.568 540.152L73.6525 374.568C61.3215 367.937 52.9582 355.753 51.2036 341.862Z" fill="#D9D9D9"/>
      </svg>
      <div className='clickMe'>CLICK ME</div>
      <div className='galleryContent' style={{opacity: 0}}>
        TEST<br />TEST<br />TEST<br />TEST<br />TEST<br />TEST<br />TEST<br />TEST<br />TEST<br />TEST
        {/* <GalleryContent /> */}
        </div>
    </div>
  );
}

export default GalleryToggle;
