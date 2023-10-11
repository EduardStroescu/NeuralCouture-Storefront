import {useState, useEffect} from 'react';

export const useContainerWidth = (containerRef) => {
  const [widths, setWidths] = useState({
    offsetWidth: 0,
    scrollWidth: 0,
  });

  useEffect(() => {
    const getWidth = () => ({
      offsetWidth: containerRef.current.offsetWidth,
      scrollWidth: containerRef.current.scrollWidth,
    });

    const handleResize = () => {
      setWidths(getWidth());
    };

    if (containerRef.current) {
      setWidths(getWidth());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef]);

  return widths;
};
