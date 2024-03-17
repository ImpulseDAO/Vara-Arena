import { RefObject, useLayoutEffect } from "react";

export const useClickOutside = (
  ref: RefObject<HTMLDivElement>,
  callback: VoidFunction
): void => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
  useLayoutEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};
