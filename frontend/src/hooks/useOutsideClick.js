import { useEffect, useRef } from "react";

// this is given with setOption(false) we will just execute it in handleClickOutside
const useOutsideClick = (stateFunction) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!stateFunction) return;

    const handleClickOutside = (e) => {
      if (ref?.current && ref.current.contains(e.target)) {
        stateFunction(false); //this will execute and setOption(false) is called and it triggers the parent state div
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    //whenever the state changes call this hook again
  }, [stateFunction]);

  return ref;
};

export { useOutsideClick};
