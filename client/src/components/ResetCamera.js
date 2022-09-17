import React, { useMemo, useRef } from 'react'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'

const ResetCamera = ({mouse}) => {
    const { camera, viewport } = useThree()
    const doReset = () => {
        camera.position.x = 0
        camera.position.y = 0
        camera.lookAt(0, 0, 0)
        return null
    }
}

export default ResetCamera