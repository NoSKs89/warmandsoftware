import * as THREE from 'three'
import { useMemo, useRef, useState, useEffect } from 'react'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import { act } from 'react-dom/test-utils'

extend({ MeshLineGeometry, MeshLineMaterial })

const lerp = (x, y, a) => {
  const r = (1 - a) * x + a * y 
  return Math.abs(x - y) < 0.001 ? y : r
}

function Lines({ dash, active, count, colors, radius = 50, rand = THREE.MathUtils.randFloatSpread }) {
  const lines = useMemo(() => {
    return Array.from({ length: count }, () => {
      const pos = new THREE.Vector3(rand(radius), rand(radius), rand(radius))
      const points = Array.from({ length: 10 }, () => pos.add(new THREE.Vector3(rand(radius), rand(radius), rand(radius))).clone())
      const curve = new THREE.CatmullRomCurve3(points).getPoints(300)
      return {
        color: colors[parseInt(colors.length * Math.random())],
        width: Math.max(radius / 100, (radius / 50) * Math.random()),
        speed: Math.max(0.1, 1 * Math.random()),
        curve: curve.flatMap((point) => point.toArray())
      }
    })
  }, [count, radius]) //removing colors stops the re-render but then won't change color

  return lines.map((props, index) => <Fatline key={index} dash={dash} active={active} {...props} />)
}

function Fatline({ curve, width, color, speed, dash, active }) {
  const { viewport, camera } = useThree();

  const ref = useRef();
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  useFrame(({ mouse }, delta) => {
    // Calculate the distance between the mesh and the cursor
    const distanceToCursor = () => {
      const cursorX = (mouse.x * viewport.width) / 2;
      const cursorY = (mouse.y * viewport.height) / 2;
      return Math.sqrt(
        Math.pow(cursorX - ref.current.position.x, 2) +
        Math.pow(cursorY - ref.current.position.y, 2)
      );
    };
    camera.updateProjectionMatrix();
    ref.current.material.dashOffset -= (delta * speed) / 10;

    const lerpSpeed = 0.025;
    ref.current.position.z = active
      ? MathUtils.lerp(ref.current.position.z, 0, lerpSpeed)
      : MathUtils.lerp(ref.current.position.z, 4, lerpSpeed * 2.9);

    const distance = distanceToCursor();
    if (distance < 10) { // Adjust the distance threshold as needed
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      setTargetPosition({ x, y });
    }

    // Smoothly move the mesh towards the target position
    ref.current.position.y = lerp(ref.current.position.y, targetPosition.y, lerpSpeed * 0.5);
    ref.current.position.x = lerp(ref.current.position.x, targetPosition.x, lerpSpeed);
  });

  return (
    <mesh ref={ref}>
      <meshLineGeometry points={curve} />
      <meshLineMaterial transparent lineWidth={width} color={color} depthWrite={false} dashArray={0.25} dashRatio={dash} toneMapped={false} />
    </mesh>
  );
}

export default Lines