import { useEffect, useRef } from 'react';

export default function useGameLoop(callback) {
  const frame = useRef();

  useEffect(() => {
    let mounted = true;

    const loop = () => {
      if (!mounted) return;

      callback?.();

      frame.current = requestAnimationFrame(loop);
    };

    frame.current = requestAnimationFrame(loop);

    return () => {
      mounted = false;
      cancelAnimationFrame(frame.current);
    };
  }, [callback]);
}