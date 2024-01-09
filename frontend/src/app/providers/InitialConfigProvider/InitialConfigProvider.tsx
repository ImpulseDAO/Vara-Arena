import { STRATEGY_CODE_ID_HARDCODED, OLD_STRATEGIES_CODE_IDS_HARDCODED } from "consts";
import { addCodeIdToLocalStorage } from "hooks/useUploadCode";
import { removeCodeIdFromLocalStorage } from "hooks/useUploadCode/useUploadCode";
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
    addCodeIdToLocalStorage(STRATEGY_CODE_ID_HARDCODED);
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
