import { useEffect } from "react";

const ERROR_TO_SUPPRESS = "Cannot use 'in' operator to search for 'spec'";

export const SuppressErrorProvider = ({ children }: { children: React.ReactNode; }) => {
  useEffect(() => {
    setTimeout(() => {
      const iframe = document.querySelector("#webpack-dev-server-client-overlay") as HTMLIFrameElement;
      const errorDivs = iframe?.contentDocument?.querySelector("#webpack-dev-server-client-overlay-div").children[2].children;

      if (errorDivs && errorDivs.length === 1) {
        const errorDiv = errorDivs[0] as HTMLDivElement;
        const elementsToCheck = Array.from(errorDiv.querySelectorAll('div, span'));

        const isFound = elementsToCheck.some((element) => element.textContent?.includes(ERROR_TO_SUPPRESS));

        if (isFound) {
          console.error("Removed ERROR notification iframe");
          iframe.remove();
        }
      }
    }, 100);
  }, []);

  return <>{children}</>;
};
