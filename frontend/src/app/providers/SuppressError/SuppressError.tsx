import { useEffect } from "react";

const ERROR_TO_SUPPRESS = "Cannot use 'in' operator to search for 'spec'";

/**
 * There was annoying error react notification that was emerging constantly and was slowing down the development so I decided to suppress it.
 */
export const SuppressErrorProvider = ({ children }: { children: React.ReactNode; }) => {
  const IS_ENABLED = false;
  useSuppressError(ERROR_TO_SUPPRESS, IS_ENABLED);

  return <>{children}</>;
};


const useSuppressError = (errorText: string, enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    setTimeout(() => {
      const iframe = document.querySelector("#webpack-dev-server-client-overlay") as HTMLIFrameElement;
      const errorDivs = iframe?.contentDocument?.querySelector("#webpack-dev-server-client-overlay-div")?.children[2].children;

      if (errorDivs && errorDivs.length === 1) {
        const errorDiv = errorDivs[0] as HTMLDivElement;
        const elementsToCheck = Array.from(errorDiv.querySelectorAll('div, span'));

        const isFound = elementsToCheck.some((element) => element.textContent?.includes(errorText));

        if (isFound) {
          console.error("Removed ERROR notification iframe");
          iframe.remove();
        }
      }
    }, 100);
  }, [enabled, errorText]);
};
