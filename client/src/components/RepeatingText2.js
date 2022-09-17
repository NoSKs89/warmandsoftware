import React, { useEffect, useState } from "react"
import { a, useSpring, easings } from "react-spring"
// import WebFont from 'webfontloader'
import { folder, useControls, Leva } from 'leva'

const cursiveFontArray = ['Dancing Script', 'Lobster', 'Mea Culpa', 'Marck Script', 'Dancing Script', 'Ole', 'Love Light', 'Mr De Haviland', 'Twinkle Star', 'Engagement', 'Birthstone Bounce', 'Fleur De Leah',
'Lovers Quarrel', 'Bonheur Royale','Molle', 'Ruthie']
const getRandom = () => {
    return Math.floor(Math.random() * cursiveFontArray.length)
}
const randomNoRepeats = (array) => {
    let copy = array.slice(0);
  return function() {
    if (copy.length < 1) { copy = array.slice(0); }
    let index = Math.floor(Math.random() * copy.length);
    let item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}
const rndChooser = randomNoRepeats(cursiveFontArray)

let offSetMultiplier = 1
const RepeatingText = (props) => {
    const doRestChanges = () => {
        console.log(offSetMultiplier)
        offSetMultiplier++
    }
    const niceSet1 = ['Engagement', 'Lobster', 'Mea Culpa', 'Birthstone Bounce', 'Marck Script']
    const theseRandoms = [rndChooser(), rndChooser(), rndChooser(), rndChooser(), rndChooser()]
    const {
        doInterpolation, fInterpolation, fMass, fTension, fFriction, duration, endDelay,
        fontFamily0, fontFamily1, fontFamily2, fontFamily3, fontFamily4,
        bgColor0, bgColor1, bgColor2, bgColor3, bgColor4,
        fColor0, fColor1, fColor2, fColor3, fColor4,
        fMargin0, fMargin1, fMargin2, fMargin3, fMargin4,
        letterSpacing0, letterSpacing1, letterSpacing2, letterSpacing3, letterSpacing4, 
        lineHeight0, lineHeight1, lineHeight2, lineHeight3, lineHeight4,
        fontWeight0, fontWeight1, fontWeight2, fontWeight3, fontWeight4,
        fontSlant0, fontSlant1, fontSlant2, fontSlant3, fontSlant4  
         } = 
            useControls({ 
                'Settings': folder({doInterpolation: true, fInterpolation: 2, fMass: 4, fTension: 170, fFriction: 15, duration: 1500, endDelay: 1500}),
                'FontFamily0': folder({fontFamily0: theseRandoms[0], bgColor0: 'black', fColor0: '#C2C2B4', fMargin0: 0, letterSpacing0: '-0.08em', lineHeight0: '0.75em', fontWeight0: 900, fontSlant0: '0em'}), 
                'FontFamily1': folder({ fontFamily1: theseRandoms[1], bgColor1: '#11054e', fColor1: '#EB826B', fMargin1: 0 , letterSpacing1: '0.01em', lineHeight1: '0.90em', fontWeight1: 900, fontSlant1: '0em' }), //11054e 3c1be5
                'FontFamily2': folder({ fontFamily2: theseRandoms[2], bgColor2: 'teal', fColor2:  '#D9E3DA', fMargin2: 0, letterSpacing2: '0.15em', lineHeight2: '1.35em', fontWeight2: 900, fontSlant2: '0em'}), //letterSpacing2: '-0.03em', lineHeight2: '0.75em'
                'FontFamily3': folder({ fontFamily3: theseRandoms[3], bgColor3: 'magenta', fColor3: '#3D837B', fMargin3: 0, letterSpacing3: '-0.08em', lineHeight3: '0.95em', fontWeight3: 900, fontSlant3: '0em'}),
                'FontFamily4': folder({ fontFamily4: theseRandoms[4], bgColor4: 'black', fColor4: '#c1a2a2', fMargin4: 0, letterSpacing4: '0.0em', lineHeight4: '1.5em', fontWeight4: 1900, fontSlant4: '20em'})})


    const fontSize = props.bIsMobile ? 120 : 190
    //animation settings
    let { interpolation, ...config } = {
        interpolation: fInterpolation * offSetMultiplier,
        mass: fMass,
        tension: fTension,
        friction: fFriction,
        duration: !props.bIsMobile ? duration: 1650,
        easing: easings.easeInOutSine
    }
    let [{ s }] = useSpring({ s: interpolation, config }, [interpolation, config])

    const animationArray = {
        loop: true,
        config: {...config, bounce: true, immediate: true},
        delay: endDelay, //time between reset
        onRest: () => {
            doRestChanges()
        },
        immediate: true,
        to: [
            //swap from warm to soft attributes starting with warm
            {
                color: fColor1,
                fontSize: fontSize * 0.7,
                letterSpacing: letterSpacing1,
                lineHeight: lineHeight1,
                fontStyle: "italic",
                fontWeight: 900,
                fontSlant: fontSlant1,
                willChange: "transform",
                transform:  `translate3d(${100 * 1 + 0.5 * (50 * 8)}px,0,0)`,
                fontFamily: fontFamily1,
                backgroundColor: bgColor1,
                margin: fMargin1,
                opacity: '100%'
            },
            {
                color: fColor2,
                fontSize: fontSize,
                letterSpacing: letterSpacing2,
                lineHeight: lineHeight2,
                fontStyle: "normal",
                fontWeight: 200,
                fontSlant: fontSlant2,
                willChange: "transform",
                transform:  `translate3d(${100 * -1 + -1 * (50 * -4)}px,0,0)`,
                fontFamily: fontFamily2,
                backgroundColor: bgColor2,
                margin: fMargin2
            },
            {
                color: fColor3,
                fontSize: fontSize,
                letterSpacing: letterSpacing3,
                lineHeight: lineHeight3,
                fontStyle: "italic",
                fontWeight: 700,
                fontSlant: fontSlant3,
                willChange: "transform",
                transform:  `translate3d(${100 * -1 + -1 * (50 * -12)}px,0,0)`,
                fontFamily: fontFamily3,
                backgroundColor: bgColor3,
                margin: fMargin3
            },
            {
                color: fColor4,
                fontSize: !props.bIsMobile ? fontSize * 1.2 : fontSize * 0.8,
                letterSpacing: !props.bIsMobile ? letterSpacing4 : "0.12em",
                lineHeight: !props.bIsMobile ? lineHeight4 : '0.85em',
                fontStyle: "normal",
                fontWeight: 400,
                fontSlant: fontSlant4,
                willChange: "transform",
                transform:  `translate3d(${100 * 1 + 1 * (50 * 9)}px,0,0)`,
                fontFamily: fontFamily4,
                backgroundColor: bgColor4,
                margin: fMargin4
            }
        ],
        from: {
            color: fColor0,
            fontSize: fontSize * 1.2,
            letterSpacing: letterSpacing0,
            lineHeight: lineHeight0,
            fontStyle: "italic",
            fontWeight: 900,
            fontSlant: fontSlant0,
            willChange: "transform",
            transform:  `translate3d(${100 * 1 + 1 * (50 * 1)}px,0,0)`,
            fontFamily: fontFamily0,
            backgroundColor: bgColor0,
            margin: fMargin0
        }
    }

    const [styles, api] = useSpring(() => (animationArray))
    //console.log(JSON.stringify(styles))
    
    if(props.bSidebarOpen){
        api.stop()
        // setDoInterpolation(false)
    }
    else{
        api.start(animationArray)
        // setDoInterpolation(true)

    }

    return (
        //inherits 
        <>
        <Leva 
            collapsed={true}
            hidden={!props.bIsMobile ? false : true}
        />
        <a.div className="center" style={{backgroundColor: styles.backgroundColor, zIndex: '0'}}>
        <a.div className="repeatText">
            <div className="title" >
            {/* QTY OF LINES 
                _ is often used as a throwaway variable. In other words, just ignore it. */}
            {[...Array(15)].map((_, j) => (
                <a.div
                key={j}
                style={doInterpolation ? {
                    willChange: "transform",
                    transform: s.to((s) => {
                    //if i is even reverse it with translate3d
                    const dir = j % 2 ? 1 : -1
                    return `translate3d(${100 * dir + s * (50 * dir)}px,0,0)`
                    }),
                } : {}}
                >
                {[...Array(5)].map((_, i) => (
                    <a.span key={i} style={{
                        color: styles.color,
                        fontSize: styles.fontSize,
                        letterSpacing: styles.letterSpacing,
                        lineHeight: styles.lineHeight,
                        fontStyle: styles.fontStyle,
                        fontWeight: styles.fontWeight,
                        fontSlant: styles.fontSlant,
                        willChange: styles.willChange,
                        transform:  styles.transform,
                        fontFamily: styles.fontFamily,
                        margin: styles.margin,
                        backgroundColor: 'transparent'
                    }} onClick={() => {doRestChanges()}}
                    >
                        {props.text}
                    </a.span>
                ))}
                </a.div>
            ))}
            </div>
        </a.div>
        </a.div>
        </>
    )
}

export default RepeatingText