import React, { useEffect, useState } from 'react'
import { animate, inView } from 'motion'

import GalleryContent from '../components/GalleryContent'

//todo:
//currently many of the animate() functions below are based on html classes that are defined in the parent.
//---that is probably not good practice and I should pass a function and do them in the parent. but atm: lazy
//format book recs & favs
//special thanks: Paul Hersh drcma, fiance Brooke,

function GalleryToggle(props) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const textShadowString = '5px 5px 5px #000'
  const headerName = props.headerName
  useEffect(() => {
    if(props.ready){
      animate('.galleryToggleSun', {
        y: ['-30%', '15%'],
        opacity: [0, 1]
      }, { duration: 2, delay: 2 })
      animate(`.${headerName} h1`, {
        textShadow: ['none', textShadowString]
      }, { duration: 2.5, delay: 2.5 })
      // animate('.textContent', {
      //   textShadow: ['5px 5px 5px #000', '5px 5px 5px #000']
      // }, { duration: 2, delay: 0.25 })
    }
    else{
      animate(`.${headerName} h1`, {
        textShadow: ['5px 5px 5px #000', 'none']
      }, { duration: 1, delay: 1 })
      animate('.galleryToggleSun', {
        y: ['15%', '-30%'],
        opacity: [1, 0]
      }, { duration: 1, delay: 0 })
    }
    
  }, [props.ready])

  const handleMouseEnter = () => {
    setHovered(true)
  }

  const handleMouseLeave = () => {
    setHovered(false)
  }

  const scale = 1;
  const style = {
    transform: `scale(${scale})`,
  }

  const finishColor = props.finishColor ?? 'green'

  const onClick = () => {
    if(!clicked){
      animate('.galleryToggleSun', {
        top: ['0%', '50%'],
        left: ['5%', '50%']
      }, { duration: 2, delay: 0.25 })
      animate('.galleryToggleSun', {
        scale: [1, 18],
        backgroundColor: ['black', finishColor],
        zIndex: [9, 7],
        // rotate: [0, 60],
      }, { duration: 2, delay: 1.5 })
      animate(`.${headerName} h1`, {
        textShadow: [textShadowString, 'none']
      }, { duration: 1, delay: 2.5 })
      animate('.galleryContentSun', {
        opacity: [0, 1]
      }, { duration: 1, delay: 2.5 })
      animate('.About', {
        filter: ['blur(0px)', 'blur(2.5px)']
      }, { duration: 1.5, delay: 0.5 })
      setClicked(true)
    }
    else {
      animate('.galleryToggleSun', {
        scale: [18, 1],
        backgroundColor: [finishColor, 'black'],
        zIndex: [7, 9],
        // rotate: [60, 0], // Add this line to rotate by 60 degrees
      }, { duration: 2, delay: 0.25 })
      animate('.galleryToggleSun', {
        top: ['50%', '0%'],
        left: ['50%', '5%']
      }, { duration: 2, delay: 1.5 })
      animate(`.${headerName} h1`, {
        textShadow: ['none', textShadowString]
      }, { duration: 1, delay: 2.5 })
      animate('.galleryContentSun', {
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
      className={hovered ? 'galleryToggleSun hoverPointer' : 'galleryToggleSun'}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
     {/* <svg height="100%" width="100%" viewBox="0 0 599 554" fill="none" xmlns="http://www.w3.org/2000/svg"></svg> */}
      <div className='clickMe'>CLICK ME</div>
      <div className='galleryContentSun' style={{opacity: 0}}>
      <div className='verticalText'>
        DON'T
        STARE
        AT
        THE
        SUN
      </div>
      <div className='horizontalText bookItems'>
        <h5>BOOK RECS:</h5>
        <p>THINK LIKE A MONK<br />FLOW<br />ECCLESIASTES<br />ALL WE CAN SAVE<br />THE CREATIVE ACT: A WAY OF BEING<br />PETROCHEMICAL AMERICA<br />AS LONG AS GRASS GROWS<br />CONSUMED<br />CASTE<br />THE ART OF INSUBORDINATION<br />NUDGE<br />ATOMIC HABITS</p>
      </div>
      <div className='horizontalText'>
        <h5>SPECIAL THANKS:</h5>
        <p>Brooke <i> my muse and love</i><br /><br />Parents and Family <i>for their endless support</i><br /><br />Paul Hensch (drcmda) <i>from whom I'm learning much at distance</i><a target="_blank" href="https://codesandbox.io/u/drcmda">....Here</a><br /> <br /></p>
      </div>
        </div>
    </div>
  );
}

export default GalleryToggle;
