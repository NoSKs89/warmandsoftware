import React, { useState, Fragment, useEffect, useRef } from 'react'
import { useTransition, useChain, animated, config, useSpringRef, useSpring } from "react-spring";

const clearTimeouts = () => {
    var max = setTimeout(function(){ /* Empty function */ },1);
    for (var i = 1; i <= max ; i++) {
        window.clearInterval(i);
        window.clearTimeout(i);
        if(window.mozCancelAnimationFrame)window.mozCancelAnimationFrame(i); // Firefox
    }
}

const Sidebar1 = (props) => {
    const [cameraLockedText, setCameraLockText] = useState(!props.cameraLocked ? "Camera Unlocked" : "Camera Locked")
    const [effectOffText, setEffectText] = useState(!props.effectActive ? "Effects Off" : "Effects On")
    const sidebarRef = useSpringRef()
    const transition = useTransition(props.show, {
        from: {
            transform: "translateX(-100%)"
          },
          enter: {
            transform: "translateX(0%)"
          },
          leave: {
            transform: "translateY(-100%)"
          },
          unique: true,
          config: config.gentle,
          ref: sidebarRef
    })

    const items = props.items ?? ["Toggle Text", "Toggle Cubes", "Toggle Pattern 1", "Things3"]
    const itemsRef = useSpringRef()
    const trail = useTransition(props.show ? items : [], 
        {
        from: {
            opacity: 0,
            transform: "translateY(50px)"
          },
          enter: {
            opacity: 1,
            transform: "translateY(0)"
          },
          leave: {
            opacity: 0,
            transform: "translateY(-25px)"
          },
          ref: itemsRef,
          config: config.wobbly,
          trail: 100,
          unique: true
    })

    const [hoveredItem, setHoveredItem] = useState('-1')
    // console.log(hoveredItem != -1 ? hoveredItem : '-1')

    const [toggleInfo, setToggleInfo] = useState(false)

    const hoveredItemSpring = useSpring({
        transform: toggleInfo ? 'translateX(25%)' : 'translateX(0%)',
        opacity: toggleInfo ? '100%' : '0%',
        config: config.gentle	
    })

    const componentRef = useRef()
    // if(componentRef.current){
    //     console.log(componentRef.current)
    // }

    // Set the execution order of previously defined animation-hooks, 
    // where one animation starts after the other in sequence. 
    // You need to collect refs off the animations you want to chain, which blocks the animation from starting on its own. The order can be changed in subsequent render passes.
    useChain(
        //essentially if it's visible, do sidebar then the items, if it's not, do items then sidebar
        props.show ? [sidebarRef, itemsRef] : [itemsRef, sidebarRef],
        props.show ? [0, 0.25] : [0, 0.3]
      )
      
      return (
        transition((props2, item, key) => 
            item ? (
                <animated.div key={key} style={props2} className="sidebar">

                {trail((props3, item, key) => 
                    <animated.div key={item.text} style={props3} className={item.type === "feature" ? "sidebar__item" : (item.type === "setting" ? (props.cameraLocked ? "sidebar__setting_disabled" : "sidebar__setting_enabled") : item.type === "effects" ? (!props.effectActive ? "sidebar__setting_disabled" : "sidebar__setting_enabled") : "sidebar__item") } 
                    ref={componentRef}  
                    onClick={() => {
                        //enable && disable component
                        if(item.setVisible === undefined || item.setVisible === null){ console.log('No Function Found.') }
                        else{
                          item.setVisible(!item.visible)
                          item.visible = !item.visible
                        }
                        //enable && disable effects/camera
                        if(item.type === "setting"){
                          setCameraLockText(props.cameraLocked ? "Camera Unlocked" : "Camera Locked")
                        }
                        if(item.type === "effects"){
                          setEffectText(!props.effectActive ? "Effects On" : "Effects Off")
                        }
                        //enable && disable info Div
                        let itemText = item.infoText ?? ''
                        if(itemText.length){
                          props.setInfoDivText(itemText)
                        }
                        else{
                          props.setInfoDivText('')
                        }
                        if(props.bIsMobile){
                          props.autoClose(false)
                        }
                        // setHoveredItem('-1')
                    }}
                    onMouseEnter={() => {
                        // console.log(props3)
                        setTimeout(() => { setToggleInfo(true) }, 500)
                        setHoveredItem(item.text)
                      }}
                    onMouseLeave={() => {
                        // clearTimeouts()
                        setToggleInfo(false)
                        setHoveredItem('-1')
                    }}
                    >
                    {/* {item.type === "setting" ? cameraLockedText : item.text} */}
                    {item.type === "setting" ? cameraLockedText : (item.type === "effects" ? effectOffText : item.text)}
                    {item.isNew != null ? <div className='menu_item_new'>NEW!</div> : null}
                    {item.lastUpdated != null ? <div className='menu_item_updated'>Updated:<div style={{fontSize: '1.25vh'}}>{item.lastUpdated}</div></div> : null}
                    {/* {item.text === hoveredItem ? <animated.div className='navMoreInfoDiv' style={item.text === hoveredItem ? hoveredItemSpring : nonHoveredItemSpring}><h1 className='navMoreInfoDiv'>{item.text}</h1>{item.infoText}</animated.div> : null} */}
                    {item.text === hoveredItem && item.infoText !== '' ? <animated.div className='navMoreInfoDiv' 
                        style={hoveredItemSpring}>
                    <div className='navInfoTitle'>{item.infoTitle}</div>{item.infoText}</animated.div> : null}
                    </animated.div>
                )}
            </animated.div> ) : null)
    )
}

export default Sidebar1