// import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'
// import React, { useState, Fragment, useEffect } from 'react'

// const MasterCanvas = (props) => {
//     const { camera, viewport } = useThree()
//     const [width, setWidth] = useState(window.innerWidth)
//     const [height, setHeight] = useState(window.innerHeight)
//     const handleWindowSizeChange = () => {
//       setWidth(window.innerWidth)
//       setHeight(window.innerHeight)
//     }
//     useEffect(() => {
//             window.addEventListener('resize', handleWindowSizeChange);
//             return () => {
//                 window.removeEventListener('resize', handleWindowSizeChange);
//             }
//     }, []);
//     const canvasStyles = { width: width, height: height }
//     const ResetCamera = () => {
//         camera.position.x = 0
//         camera.position.y = 0
//         camera.lookAt(0, 0, 0)
//         return null
//     }

//     return (<Canvas style={canvasStyles}></Canvas>)
// }

// export default MasterCanvas


//R3F HOOKS CAN ONLY BE USED WITH IIIIIIN THE CANVAS COMPONENT. SO NOT WITH A CANVAS COMPONENT