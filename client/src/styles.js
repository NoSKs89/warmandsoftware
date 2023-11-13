import { animated } from 'react-spring'
import styled, { createGlobalStyle } from 'styled-components'

const Global = createGlobalStyle`
  * {
    // box-sizing: border-box;
  }

//   html,
//   body,
//   #root {
//     position: absolute;
//     left: 0;
//     top: 0;
//     margin: 0;
//     padding: 0;
//     height: 100%;
//     width: 100%;
//     overflow: hidden;
//     user-select: none;
//     background: lightblue;
//     padding: 20px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     z-index: 15;
//   }
`

const Container = styled(animated.div)`
  position: fixed;
  top: 150%;
  left: 50%;
  transform: translate(-50%, -50%); //makes top/left actually the centerpoint of the div instead of the top left corner
  display: grid;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
  grid-gap: 25px;
  padding: 25px;
  background: #003049;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.05);
  will-change: width, height;
  border: 0.125vw solid white;
  color: 'white';
  animation: blackGlow 2s infinite; 
`
const Item = styled(animated.div)`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 5px;
  will-change: transform, opacity;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ContainerMobile = styled(animated.div)`
  position: fixed;
  top: 150%;
  left: 50%;
  transform: translate(-50%, -50%); //makes top/left actually the centerpoint of the div instead of the top left corner
  display: grid;
  grid-template-columns: repeat(2, minmax(100px, 1fr));
  grid-gap: 20px;
  padding: 20px;
  background: #003049;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.05);
  will-change: width, height;
  border: 0.125vw solid white;
  color: 'white';
  animation: blackGlow 2s infinite; 
`

const ItemMobile = styled(animated.div)`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 5px;
  will-change: transform, opacity;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`

export { Global, Container, ContainerMobile, Item, ItemMobile }
