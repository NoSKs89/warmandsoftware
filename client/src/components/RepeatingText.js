import React, { useEffect } from "react"
import { a, useSpring } from "react-spring"
// import WebFont from 'webfontloader'

let offset = false 

const RepeatingText = (props) => {
    const fontSize = props.bIsMobile ? 80 : 190
    const type = {
        color: "#e85858",
        fontSize: 190,
        letterSpacing: "-0.08em",
        lineHeight: "0.75em",
        fontStyle: "italic",
        fontWeight: 900,
        fontSlant: 0,
    }
    //animation settings
    let { interpolation, ...config } = {
        interpolation: 2,
        mass: 4,
        tension: 170,
        // friction: 35,
        friction: 15,
    }
    let [{ s }] = useSpring({ s: interpolation, config }, [interpolation, config])

    const animationArray = {
        loop: true,
        config: {...config, bounce: true},
        to: [
            //swap from warm to soft attributes starting with warm
            {
                color: '#EB826B',
                fontSize: fontSize,
                letterSpacing: "0.01em",
                lineHeight: "0.90em",
                fontStyle: "italic",
                fontWeight: 900,
                fontSlant: 0,
                willChange: "transform",
                transform:  `translate3d(${100 * 1 + 0.5 * (50 * 1)}px,0,0)`,
                fontFamily: 'Abel'
            },
            {
                color: '#D9E3DA',
                fontSize: fontSize,
                letterSpacing: "-0.03em",
                lineHeight: "0.75em",
                fontStyle: "normal",
                fontWeight: 200,
                fontSlant: 0,
                willChange: "transform",
                transform:  `translate3d(${100 * -1 + -1 * (50 * -4)}px,0,0)`,
                fontFamily: 'Cabin'
            },
            {
                color: '#3D837B',
                fontSize: fontSize,
                letterSpacing: "-0.08em",
                lineHeight: "0.95em",
                fontStyle: "italic",
                fontWeight: 700,
                fontSlant: 0,
                willChange: "transform",
                transform:  `translate3d(${100 * -1 + -1 * (50 * -12)}px,0,0)`,
                fontFamily: 'Oxygen'
            },
            {
                color: '#C2C2B4',
                fontSize: fontSize * 1.2,
                letterSpacing: "-0.12em",
                lineHeight: "0.65em",
                fontStyle: "normal",
                fontWeight: 400,
                fontSlant: 0,
                willChange: "transform",
                transform:  `translate3d(${100 * 1 + 1 * (50 * 10)}px,0,0)`,
                fontFamily: 'Quicksand'
            }
        ],
        from: {
            color: '#C2C2B4',
            fontSize: fontSize * 1.2,
            letterSpacing: "-0.08em",
            lineHeight: "0.75em",
            fontStyle: "italic",
            fontWeight: 900,
            fontSlant: 0,
            willChange: "transform",
            transform:  `translate3d(${100 * 1 + 1 * (50 * 1)}px,0,0)`,
            fontFamily: 'Cabin'
        }
    }

    const [styles, api] = useSpring(() => (animationArray))
    if(props.bSidebarOpen){
        api.stop()
        // offset = true
    }
    else{
        api.start(animationArray)
        // offset = false
    }

    return (
        //inherits 
        <div className="center">
        <a.div className="repeatText">
            <div className="title" >
            {/* QTY OF LINES 
                _ is often used as a throwaway variable. In other words, just ignore it. */}
            {[...Array(15)].map((_, j) => (
                
                <a.div
                key={j}
                style={offset ? {
                    willChange: "transform",
                    transform: s.to((s) => {
                    //if i is even reverse it with translate3d
                    const dir = j % 2 ? 1 : -1
                    return `translate3d(${100 * dir + s * (50 * dir)}px,0,0)`
                    }),
                } : {}}
                >
                {[...Array(5)].map((_, i) => (
                    <a.span key={i} style={styles}
                    >
                        {props.text}
                    </a.span>
                ))}
                </a.div>
            ))}
            </div>
        </a.div>
        </div>
    )
}

export default RepeatingText