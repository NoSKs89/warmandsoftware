import React, { useEffect, useState, useMemo, useRef } from 'react'
import { animate, inView } from 'motion'
import { useTransition, useSpring, useChain, config, useSpringRef } from  '@react-spring/web'


import Poems from '../poems.js'
import { Global, Container, Item } from '../styles'

//https://codesandbox.io/s/2v716k56pr?file=/src/index.js based off this example
const DomPoems = (props) => {
    //if app state tells us to animate in the poem gallery
    useEffect(() => {
        if(props.showPoemMenu){
            animate('.poemContainer', { //change the color and scale it
                zIndex: [99],
                opacity: [0, 1],
                top: ['150%', '50%'],
                borderRadius: ['100%']
                // transform: ['scaleY(1) scaleX(1)', 'scaleY(6) scaleX(3)'],
              }, { duration: 2, delay: 0.75 })
              animate('.textContent', { //blur the other text that is visible
                filter: ['blur(2.5px)']
              }, { duration: 1.5, delay: 0.50 })
              setIsGalleryClickable(true)
        }
        else{
            animate('.poemContainer', { //change the color and scale it
                zIndex: [2],
                opacity: [1, 0],
                top: ['150%'],
                borderRadius: ['100%']
                // transform: ['scaleY(1) scaleX(1)', 'scaleY(6) scaleX(3)'],
              }, { duration: 2, delay: 0.25 })
              animate('.textContent', { //blur the other text that is visible
                filter: ['blur(0px)']
              }, { duration: 1.5, delay: 0 })
              document.body.classList.remove('unscrollable');
        }
    }, [props.showPoemMenu])

    const [textState, setTextState] = useState('OPEN GALLERY')
    const [galleryOpen, setGalleryOpen] = useState(false)
    const [isGalleryClickable, setIsGalleryClickable] = useState(true)
    const [activePoem, setActivePoem] = useState('')
    const [hoveredItem, setHoveredItem] = useState('')
    const springRef = useSpringRef()
    //why is there opacity?

    useEffect(() => {
        if(activePoem !== '')
            props.setSinglePoemIsActive(true)
        else
            props.setSinglePoemIsActive(false)
    }, [activePoem])

    const {size, opacity, ...rest } = useSpring({
        ref: springRef,
        config: config.stiff,
        from: { size: '20%', background: props.secondaryColor, borderRadius: '0%', opacity: 0 },
        to: { opacity: 1, size: galleryOpen ? (activePoem.length ? '98%' : '90%') : '20%', borderRadius: !galleryOpen ? '100%' : '0%' , background: galleryOpen ? 'linear-gradient(135deg, #003049 0%, #d62828 100%)' : 'linear-gradient(90deg, #d62828 0%, #003049 100%)' }
    })

    //item springs --- I may have combine springs? I may want to change the size property a third time to 95% if activePoem.length?
    const poemItemRef = useSpringRef()
    const { poemOpacity, poemSize } = useSpring({
        ref: poemItemRef,
        config: config.stiff,
        from: { poemOpacity: 0, poemSize: '20%' },
        to: { poemOpacity: 1, poemSize: activePoem.length ? '100%' : '20%' }
    })

    //useTransition data for each of the poem divs
    const transRef = useSpringRef()
    const transitions = useTransition(galleryOpen ? Poems : [], 
    {
      ref: transRef,
      unique: true,
      trail: 400 / Poems.length,
      from: { opacity: 0, transform: 'scale(0)' },
      enter: { opacity: 1, transform: 'scale(1)' },
      leave: { opacity: 0, transform: 'scale(0)' }
    })

    useChain(galleryOpen ? [springRef, transRef] : [transRef, springRef], [0, galleryOpen ? 0.3 : 0.6])
    const poemRef = useRef()

    //is there a way to detect a click outside of it as well? would be nice to close on click outside instead of only when scrollaway
    const onMenuClick = () => {
        if(!isGalleryClickable)
            return
        if(galleryOpen){
            setTimeout(() => {
                setTextState(textState === 'OPEN GALLERY' ? '' : 'OPEN GALLERY')
            }, 1500)
            setActivePoem('')
            document.body.classList.remove('unscrollable');
        }
        else{
            setTextState(textState === 'OPEN GALLERY' ? '' : 'OPEN GALLERY')
        }
        props.setBCanvasPointerEvents(true)
        setGalleryOpen((galleryOpen) => !galleryOpen)
    }

    const onItemClick = (str) => { //at this time it logs each name... so that's strange.
        // console.log(str)
        // window.scrollTo(0, 0)
        if(poemRef.current)
            poemRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        if(str !== activePoem){
            //animate the div bigger and text opacity [0, 1].. would be nicer in the spring
            setActivePoem(str)
            animate('h1', {
                textShadow: ['none', '5px 5px 5px #000']
              }, { duration: 1, delay: 0 })
            document.body.classList.add('unscrollable')
            document.body.classList.remove('scrollable')
            props.setCanvasZindex(100)
            props.setBCanvasPointerEvents(false)
        }
        else{
            setActivePoem('')
            animate('h1', {
                textShadow: ['5px 5px 5px #000', 'none']
              }, { duration: 1, delay: 0 })
            document.body.classList.add('scrollable')
            document.body.classList.remove('unscrollable')
            props.setCanvasZindex(0)
            props.setBCanvasPointerEvents(true)
        }
    }
    //I need to find a way to remove scroll events from base layers when clicked into new layers, will probably have to set onHover
    const onItemHover = (str) => {
        setIsGalleryClickable(false)
        setHoveredItem(str)
    }
    const onItemHoverExit = () => {
        setIsGalleryClickable(true)
        setHoveredItem('')
    }
    return (
        <>
      <Container className='poemContainer' style={{ ...rest, width: size, height: size, opacity: 0 }} onClick={() => onMenuClick()}>
        <div className='poemGalleryText' styles={{opacity: opacity, display: galleryOpen ? 'none' : 'block'}} >{textState}</div>
        {transitions((style, item, key, props) => {
            const textLines = item.text.split('\\n').join('\n').split('\n')
            const fontSizeFactor = (item.text.length / 100) - (textLines.length * 0.075) 
            return (
            <><div className={`pDiv${item.title}`} onClick={() => onItemClick(item.title)} onMouseEnter={() => onItemHover(item.title)} onMouseLeave={() => onItemHoverExit()}>
                    <Item className={activePoem === item.title ? (item.brief ? 'selectedPoemShort scrollable' : 'selectedPoemLong scrollable') : 'unscrollable'} key={key} style={{ ...props, background: item.css, transform: activePoem === item.title ? 'scale(1)' : (activePoem === '' ? 'scale(1)' : 'scale(0)' ) }}> 
                        <div style={{opacity: hoveredItem === item.title || activePoem === item.title ? 1 : 0.5}}>
                            <div style={{fontSize: activePoem !== item.title ? '3vh' : `${fontSizeFactor}vh`}} ref={poemRef}>
                            {activePoem === item.title ? (item.text
                                .split('\\n')
                                .join('\n')
                                .split('--')
                                .join(String.fromCharCode(8211))
                                .split('\n')
                                .map((text, index) => (
                                <React.Fragment key={index}>
                                    {text}
                                    <br />
                                </React.Fragment>
                                ))) : item.title}
                            </div>
                            {activePoem === item.title ?
                                <><div className='poemTitleL'>{item.title}</div>
                                <div className='poemTitleR'>{item.title}</div></>
                            : null}
                            </div></Item></div></> )
            })}
      </Container>
    </>
    )
}

export default DomPoems