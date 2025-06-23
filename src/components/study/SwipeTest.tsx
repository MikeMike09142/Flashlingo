import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';

const SwipeTest: React.FC = () => {
  const [swipeResult, setSwipeResult] = useState<string>('No swipe yet');
  
  const [{ x, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }));

  const bind = useDrag(
    ({ down, movement: [mx, my], direction: [xDir, yDir], velocity: [vx, vy] }) => {
      const trigger = vx > 0.1;
      const verticalThreshold = Math.abs(my) < 150;
      const distanceThreshold = Math.abs(mx) > 80;
      
      const shouldTrigger = !down && verticalThreshold && (
        trigger || 
        distanceThreshold || 
        Math.abs(mx) > 120 || 
        Math.abs(mx) > 60
      );
      
      // Debug logging
      if (!down && Math.abs(mx) > 30) {
        console.log('Swipe Test Debug:', {
          velocity: vx,
          distance: Math.abs(mx),
          direction: xDir,
          vertical: Math.abs(my),
          trigger,
          distanceThreshold,
          shouldTrigger,
          verticalThreshold
        });
      }
      
      if (shouldTrigger) {
        const dir = xDir < 0 ? -1 : 1;
        
        if (dir === 1) {
          setSwipeResult('SWIPE RIGHT - I KNOW!');
          api.start({
            x: window.innerWidth,
            rotate: 20,
            scale: 0.8,
            config: { friction: 50, tension: 200 },
          });
        } else {
          setSwipeResult('SWIPE LEFT - I DON\'T KNOW!');
          api.start({
            x: -window.innerWidth,
            rotate: -20,
            scale: 0.8,
            config: { friction: 50, tension: 200 },
          });
        }
      } else {
        const xMovement = down ? mx : 0;
        const rotation = down ? mx / 20 : 0;
        const scaleValue = down ? 1 - Math.abs(mx) / 1000 : 1;
        
        api.start({ 
          x: xMovement, 
          rotate: rotation, 
          scale: scaleValue,
          config: { friction: 50, tension: 500 } 
        });
      }
    },
    { 
      filterTaps: true, 
      rubberband: true,
      bounds: { left: -300, right: 300 },
      axis: 'x',
      threshold: 10,
      delay: 0
    }
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Swipe Test</h2>
      <p className="mb-4 text-sm text-gray-600">Swipe left or right on the card below</p>
      
      <div className="max-w-md mx-auto relative">
        <animated.div
          {...bind()}
          style={{ x, rotate, scale }}
          className="bg-blue-500 text-white p-8 rounded-xl shadow-lg cursor-grab active:cursor-grabbing"
        >
          <h3 className="text-lg font-bold mb-2">Test Card</h3>
          <p>Swipe right for "I Know"</p>
          <p>Swipe left for "I Don't Know"</p>
        </animated.div>
      </div>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Result:</h3>
        <p>{swipeResult}</p>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Check browser console for debug information</p>
      </div>
    </div>
  );
};

export default SwipeTest; 