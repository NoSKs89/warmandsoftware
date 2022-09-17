import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

import * as THREE from 'three'
import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useTransition } from '@react-three/fiber'

//animate two rounds of several stones starting centered and spreading down and wide.
//then animate a confirm that talks about cookies.

const StealthRocks = (props) => {
    let [alreadyRendered, setAlreadyRendered] = useState(false)
    let [stones, addStone] = useState([])
    const mesh = useRef()
    let group = useRef()
    const GenerateStones = (width, renderer) => {
        //passing the renderer to grab width is so smart!
        // let circleWidth = Math.min( 550, renderer.domElement.width * 0.4 )
        // let circleWidth = Math.min(550, width * 0.4)
        let circleWidth = Math.min(550, width * 3)
        // let circleDepth = Math.min( 600, circleWidth * 0.85 )
        let circleDepth = Math.min( 600, width * 0.2 )
        let stoneSize = 1
        let num_stones = 3
        let random = function ( min, max ) {
            if ( ! max ) {
                return Math.random() * min
            }
            return ( Math.random() * ( max - min ) ) + min
        }
    
        for ( let a = 0; a < num_stones; a ++ ) {
            let points = []
            for ( let i = 0; i < 25; i ++ ) {
                let rx = Math.random() * ( stoneSize + stoneSize ) + - stoneSize
                let ry = ( Math.random() * ( stoneSize + stoneSize ) + - stoneSize ) * 2
                let rz = Math.random() * ( stoneSize + stoneSize ) + - stoneSize
                points.push( new THREE.Vector3( rx, ry, rz ) )
            }
    
            let geometry = new ConvexGeometry( points )
    
            let c = "rgb(75,75,75)"
            let material = new THREE.MeshPhongMaterial( { color: c, shininess: 100, specular: 0x1a1a1a, wireframeLinewidth: 2 } )
    
            let geomesh = new THREE.Mesh( geometry, material )
            geomesh.castShadow = true
    
            // let x = circleWidth * Math.cos( Math.PI / ( num_stones - 1 ) * a )
            let x = circleWidth * Math.cos( Math.PI / ( num_stones - 1 ) * (a) )
            let y = 0
            // let z = circleDepth * - 1 * Math.sin( Math.PI / ( num_stones - 1 ) * a )
            let z = circleDepth * - 1 * Math.sin( Math.PI / ( num_stones - 1 ) * a )
            geomesh.position.set( x, y, z )
    
            geomesh.counter = Math.random() * 100
            geomesh.rotationDirection = Math.sign( Math.random() * 2 - 1 ) * 0.002
            geomesh.options = {
                roughScale: random( 0.01, 0.05 ),
                fineScale: random( 0.05, 0.1 ),
                roughHeight: random( 25, 150 ),
                fineHeight: random( 12, 50 ),
                uvOffset: [ random( 999 ), random( 999 ) ],
                timeInc: random( 0.0008, 0.002 )
            }
            addStone(stones =>  [...stones, geomesh])
            setAlreadyRendered(true)
        }
    }
    //I feel like the below is an oxymoron but it's working?
    useEffect(() => {
        if(!alreadyRendered)
            GenerateStones(props.width)
    })
    // console.log('stones: ' + JSON.stringify(stones))


    let theta =0
    useFrame(() => {
        const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.1)))
        const s = Math.cos(THREE.Math.degToRad(theta * 2))
        group.current.rotation.set(r, r, r)
        group.current.scale.set(s, s, s)
    })

    return (
        <>
        <group ref={group}>
        {stones.map(item => (
            <mesh ref={mesh} geometry={item.geometry} position={item.position} key={stones.indexOf(item)} >
                <bufferGeometry attach={item.geometries}>
                        {/* <bufferAttribute
                        attachObject={["attributes", "position"]}
                        args={[f32array, 3]}
                        /> */}
                    </bufferGeometry>
                    <meshPhongMaterial
                        attach={item.materials}
                    />
            </mesh>
        ))} 
        </group>
        </>
    )
}


export default StealthRocks