import {createContext, useRef, useContext, useEffect} from 'react';
import {addEffect} from '@react-three/fiber';
import Lenis from '@studio-freight/lenis';

const scrollContext = createContext();
export const useScrollContext = () => useContext(scrollContext);

const scroll = {
  progress: 0,
};

export function Scroll({children}) {
  const content = useRef(null);
  const wrapper = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      wrapper: wrapper.current,
      content: content.current,
      lerp: 0.1,
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 1.5,
      infinite: true,
    });

    lenis.on('scroll', ({progress}) => {
      scroll.progress = progress;
    });
    const effectSub = addEffect((time) => lenis.raf(time));
    return () => {
      effectSub();
      lenis.destroy();
    };
  }, []);

  return (
    <div
      ref={wrapper}
      style={{
        position: 'absolute',
        zIndex: 100,
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        top: 0,
      }}
    >
      <div
        ref={content}
        style={{
          position: 'relative',
          minHeight: '400vh',
        }}
      >
        <div className="w-full h-full fixed top-0 left-0">
          <scrollContext.Provider value={scroll}>
            {children}
          </scrollContext.Provider>
        </div>
      </div>
    </div>
  );
}
