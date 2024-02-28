import { HARDCODED_CHARACTERS, OLD_STRATEGIES_CODE_IDS_HARDCODED } from "consts";
import { addCodeIdToLocalStorage, removeCodeIdFromLocalStorage } from "hooks/useCodeAndProgramIDs";
import { useEffect } from "react";

export const InitialConfigProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  useHardcodedStrategy();

  return <>{children}</>;
};

/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * Hardcoded Strategy
 */

const useHardcodedStrategy = (callback?: () => unknown) => {
  /**
   * Add hardcoded strategy to local storage
   */
  useEffect(() => {
    const codeIdsToBeAdded = HARDCODED_CHARACTERS.map(({ codeId }) => codeId);
    addCodeIdToLocalStorage(codeIdsToBeAdded);
    callback?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Remove old hardcoded strategies from local storage
   */
  useEffect(() => {
    OLD_STRATEGIES_CODE_IDS_HARDCODED.forEach((codeId) => {
      removeCodeIdFromLocalStorage(codeId);
    });
  }, []);
};
