import { HARDCODED_CHARACTERS } from "consts";
import React from "react";

export const useCodeAndProgramIDs = () => {
  const [strategyCodeIds, setStrategyCodeIds] = React.useState<string[]>(
    getCodeIdsFromLocalStorage()
  );
  const [strategyProgramIds, setStrategyProgramIds] = React.useState<string[]>(
    getProgramIdsFromLocalStorage()
  );
  const updateCodeAndProgramIds = () => {
    setStrategyCodeIds(getCodeIdsFromLocalStorage());
    setStrategyProgramIds(getProgramIdsFromLocalStorage());
  };

  const selectData = React.useMemo(() => {
    const codeIds = strategyCodeIds.map((codeId, index) => {
      const strategy = HARDCODED_CHARACTERS.find(
        (char) => char.codeId === codeId
      );

      const title = strategy?.name ?? `Strategy ${index + 1}`;

      return {
        value: codeId,
        label: `${title}: ${codeId.substring(0, 6)}...${codeId.substring(
          codeId.length - 4
        )}`,
      };
    });

    const programIds = strategyProgramIds.map((programId, index) => {
      return {
        value: programId,
        label: `Program ${index + 1}: ${programId.substring(0, 8)}...`,
      };
    });

    return [...codeIds, ...programIds];
  }, [strategyCodeIds, strategyProgramIds]);

  const getType = (id: string | null) => {
    if (!id) return;
    if (strategyCodeIds.includes(id)) {
      return "code";
    } else if (strategyProgramIds.includes(id)) {
      return "program";
    } else {
      return;
    }
  };

  return {
    update: updateCodeAndProgramIds,
    selectData,
    getType,
  };
};

/**
 *  LocalStorage
 */

const UPLOADED_CODE_IDS_ARRAY = "uploadedCodeIdsArray";
const UPLOADED_PROGRAM_IDS_ARRAY = "uploadedProgramIdsArray";

/**
 * GENERIC
 */

export const addIdToLocalStorage = (
  idOrIds: string | string[],
  localStorageKey: string
) => {
  const ids = typeof idOrIds === "string" ? [idOrIds] : idOrIds;

  const arrayOfCodeIds = JSON.parse(
    localStorage.getItem(localStorageKey) || "[]"
  ) as string[];

  const uniqueSet = new Set(arrayOfCodeIds);
  ids.forEach((id) => uniqueSet.add(id));

  localStorage.setItem(localStorageKey, JSON.stringify(Array.from(uniqueSet)));
};

export const removeIdFromLocalStorage = (
  codeIdOrProgramId: string,
  localStorageKey: string
) => {
  const newValue = getCodeIdsFromLocalStorage();

  localStorage.setItem(
    localStorageKey,
    JSON.stringify(newValue.filter((id) => id !== codeIdOrProgramId))
  );

  return newValue;
};

export const getIdsFromLocalStorage = (localStorageKey: string): string[] => {
  return (
    (JSON.parse(localStorage.getItem(localStorageKey) || "[]") as []) ?? []
  );
};

/**
 * CODE IDS
 */

export const addCodeIdToLocalStorage = (codeIdOrCodeIds: string | string[]) =>
  addIdToLocalStorage(codeIdOrCodeIds, UPLOADED_CODE_IDS_ARRAY);
export const removeCodeIdFromLocalStorage = (codeId: string) =>
  removeIdFromLocalStorage(codeId, UPLOADED_CODE_IDS_ARRAY);
export const getCodeIdsFromLocalStorage = () =>
  getIdsFromLocalStorage(UPLOADED_CODE_IDS_ARRAY);

/**
 * PROGRAM IDS
 */

export const addProgramIdToLocalStorage = (programId: string) =>
  addIdToLocalStorage(programId, UPLOADED_PROGRAM_IDS_ARRAY);
export const removeProgramIdFromLocalStorage = (programId: string) =>
  removeIdFromLocalStorage(programId, UPLOADED_PROGRAM_IDS_ARRAY);
export const getProgramIdsFromLocalStorage = () =>
  getIdsFromLocalStorage(UPLOADED_PROGRAM_IDS_ARRAY);
