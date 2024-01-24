import { routes } from "app/routes";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const useBattleIndex = () => {
  const navigate = useNavigate();
  const { lobbyId, battleId } = useParams<{
    battleId?: string;
    lobbyId: string;
  }>();

  const curIdx = parseInt(battleId ?? "") || 0;

  const setCurIdx = useCallback(
    (idx: number | ((prev: number) => number)) => {
      if (typeof idx === "function") {
        const prev = parseInt(battleId ?? "0");
        idx = idx(prev);
      }

      if (!lobbyId) {
        console.error("lobbyId is not defined");
      } else {
        navigate(routes.tournamentResult({ lobbyId, battleId: `${idx}` }));
      }
    },
    [battleId, lobbyId, navigate]
  );

  return [curIdx, setCurIdx] as const;
};
