import { useEffect, useRef } from "react";

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => { });

  // Garde la dernière version du callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Lance ou stoppe l'interval
  useEffect(() => {
    if (delay === null) return;

    // Appelle le callback immédiatement
    savedCallback.current();

    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
}
