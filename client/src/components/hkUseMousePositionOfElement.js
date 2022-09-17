import { useState, useMemo } from "react";

//this detects the mouse position ON the element. not the viewport.

const useMousePosition = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const bind = useMemo(
    () => ({
      onMouseMove: (event) => {
        setX(event.nativeEvent.offsetX);
        setY(event.nativeEvent.offsetY);
      }
    }),
    []
  );

  console.log('in function: ' + x + ' ' + y)
  return [x, y, bind];
};

export default useMousePosition;
