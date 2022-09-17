import React, { useState, Fragment, useEffect } from 'react'
import { useTransition, useChain, animated, config, useSpringRef } from "react-spring";

const CenterNav = (props) => {
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
            transform: "translateX(-50px)"
          },
          enter: {
            opacity: 1,
            transform: "translateX(0)"
          },
          leave: {
            opacity: 0,
            transform: "translateX(25px)"
          },
          ref: itemsRef,
          config: config.wobbly,
          trail: 100,
          unique: true
    })

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
                <animated.div key={key} style={props2} className="centerNav">
                {trail((props3, item, key) => 
                    <animated.div key={item.text} style={props3} className={props.activeMember == items.indexOf(item) ? "centerNav__item_enabled" : "centerNav__item_disabled"} 
                      onClick={() => {
                        if(props.setActive === undefined || props.setActive === null){ console.log('No Function Found.') }
                        else{
                            props.setActive(items.indexOf(item))
                        }
                    }}>
                    {/* {item.title} */}
                    </animated.div>
                )}
            </animated.div> ) : null)
    )
}

export default CenterNav