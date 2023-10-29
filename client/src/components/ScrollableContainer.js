import React, { useRef, useEffect } from 'react';

const ScrollableContainer = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      // Calculate the width of the scrollbar
      const scrollbarWidth = container.offsetWidth - container.clientWidth;

      // Set the container's padding to hide the scrollbar
      container.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // Cleanup: Remove the padding
      if (container) {
        container.style.paddingRight = '';
      }
    };
  }, []);

  return (
    <div className="scrollable-container" ref={containerRef}>
      <div className="scrollable-content">{children}</div>
    </div>
  );
};

export default ScrollableContainer;
