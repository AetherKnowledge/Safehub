import { useEffect, useRef } from "react";

const usePrevious = <T>(value: T) => {
  const ref = useRef<T | undefined>(undefined); // allow undefined

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
