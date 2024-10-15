"use client";

import { useEffect, useState } from "react";
import { THRESHOLD } from "./constants";

let prevScrollY = 0;
let prevScrollYBreakpoint = 0;

const useVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    prevScrollY = window.scrollY;
    if (prevScrollY > 0) {
      setIsVisible(false);
      prevScrollYBreakpoint = prevScrollY;
    }

    const scrollHandler = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY) {
        setIsVisible(false);
        prevScrollYBreakpoint = currentScrollY;
      } else if (prevScrollYBreakpoint - currentScrollY > THRESHOLD || currentScrollY === 0) {
        setIsVisible(true);
      }
      prevScrollY = currentScrollY;
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return isVisible;
};

export default useVisibility;
