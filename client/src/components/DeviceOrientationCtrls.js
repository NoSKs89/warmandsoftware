import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'
import { DeviceOrientationControls } from '@react-three/drei'
// import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';
// extend({ DeviceOrientationControls })

const DeviceOrientatationCtrls = () => {
    const { camera, viewport } = useThree()
    console.log(camera)
    return (
    <>
        <DeviceOrientationControls camera={camera.current} />
    </>
    )
}

export default DeviceOrientatationCtrls

// const OrientationControls = props => {
//     const controlsRef = useRef();
//     const { camera } = useThree();
//     useFrame(({ gl, scene }) => {
//       controlsRef.current.update();
//       gl.render(scene, camera);
//     });
//     // props.active: true when the start button is pressed
//     useEffect(() => {
//       if (props.active) controlsRef.current.connect();
//     });
//     return <deviceOrientationControls ref={controlsRef} args={[camera]} />;
//   };

//   export default OrientationControls