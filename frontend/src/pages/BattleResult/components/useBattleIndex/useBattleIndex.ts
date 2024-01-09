import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useBattleIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const curIdx = getBattleIdx(searchParams);

  const setCurIdx = useCallback(
    (idx: number | ((prev: number) => number)) => {
      if (typeof idx === "function") {
        const prev = getBattleIdx(searchParams);
        idx = idx(prev) as number;
      }

      setSearchParams({ battleIdx: `${idx}` });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    const prev = getBattleIdx(searchParams);
    if (prev !== curIdx) {
      console.log("setting cur idx to", curIdx);
      setCurIdx(curIdx);
    }
  }, [curIdx, searchParams, setCurIdx]);

  return [curIdx, setCurIdx] as const;
};

const getBattleIdx = (searchParams: URLSearchParams) => {
  const battleIdx = searchParams.get("battleIdx");

  if (battleIdx) {
    return Number(battleIdx) || 0;
  }

  return 0;
};
