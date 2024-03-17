import { useLayoutEffect, useState } from "react";
import { getDeviceType } from "../utils";

export const useDevice = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useLayoutEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return getDeviceType(width);
};
