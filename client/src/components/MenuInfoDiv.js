import React, { useState, useEffect, useRef } from "react"
import { useSpring, a } from 'react-spring'

//create a info button that has an on hover with info.
//have an 'x' in the hover div that will remove it entirely.
//have it be placed in main app and take text sent from children.

//'dom'ination

//add linkedin icon
//what if we move the entire div column to the right... then pull it up or down with the information.

const InfoDiv = (props) => {
    const [vis, setVisible] = useState(props.visible ?? false)
    const [hoverMessageVisible, setHoverMessageVisible] = useState(false)

    const [{ scl, backgroundColor, existingOpacity, newOpacity, fontSize }, set] = useSpring(() => (
        { scl: 1, 
          backgroundColor: props.color ?? "lightcoral",
          existingOpacity: 1,
          newOpacity: 0,
          fontSize: '0'
        }))
    return (
        <>
        <a.div 
            onMouseEnter={() => set({ scl: 12, backgroundColor: props.color2 ?? 'teal', existingOpacity: 0, newOpacity: 1, fontSize: '14px' })} 
            onMouseLeave={() => set({ scl: 1, backgroundColor: props.color ?? 'lightcoral', existingOpacity: 1, newOpacity: 0, fontSize: '0' })}
            className='infoDiv'
            // style={{ backgroundColor, transform: scl.interpolate(v => `translateY(${v}%`) }}  
            style={{ backgroundColor, transform: scl.interpolate(v => `scale(${v}`) }}  
            // style={{ backgroundColor }}  
            >
            <a.span style={{color: 'black', opacity: existingOpacity, 
                // filter: 'drop-shadow(2px 2px 2px teal)'
            }}>&nbsp;&nbsp;i</a.span>
        </a.div>
        <a.span //couldn't find a good way of resolving both the scaling of the text and also the zindex fighting of hover. this feels bad to do this way but?
            className='infoDivText' 
            style={{color: props.color ?? 'lightcoral', opacity: newOpacity}}
            onMouseEnter={() => set({ scl: 12, backgroundColor: props.color2 ?? 'teal', existingOpacity: 0, newOpacity: 1, fontSize: '14px' })}
        >
            {props.message ?? 'info button example lormme lorem lorem lorem'}
        </a.span>
        </>
    )
}

export default InfoDiv