import { Flex } from "@mantine/core";
import { useParams } from "react-router-dom";
import { BattleBackgroundWrapper } from "./components/BackgroundWrapper";
import { BattleResultNotFound } from "./components/BattleResultNotFound";
import { useBattleLogsByLobbyId } from "app/api/battleLogs";
import React from "react";
import { BattleResult, BattleResultData } from "./BattleResult";
import { BlackButton } from "./components/BlackButton";

export const TournamentResultPage = () => {
  const { lobbyId } = useParams<{ lobbyId: string; }>();

  if (!lobbyId) {
    return <BattleBackgroundWrapper>
      <BattleResultNotFound />
    </BattleBackgroundWrapper>;
  }

  return <TournamentResultPageContent {...{ lobbyId }} />;
};

export const TournamentResultPageContent = ({
  lobbyId,
}: {
  lobbyId: string;
}) => {
  const [PlayButton, setPlayButton] = React.useState<React.ReactNode | null>(null);

  const { data: battleLogs } = useBattleLogsByLobbyId({ lobbyId });

  const [curIdx, setCurIdx] = React.useState(0);

  const maxIdx = (battleLogs?.length ?? 0) - 1;
  const curBattleId = battleLogs?.[curIdx].id;
  const isMultipleBattles = maxIdx > 0;


  return (
    <BattleBackgroundWrapper>
      <Flex gap="sm" my="md" >
        {isMultipleBattles ? <BlackButton
          onClick={() => setCurIdx(prev => Math.max(0, prev - 1))}
          size="sm"
          disabled={curIdx === 0}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M1.5 0C0.671573 0 0 0.671573 0 1.5V12.5C0 13.3284 0.671573 14 1.5 14C2.32843 14 3 13.3284 3 12.5V7.00065C3.00021 7.44261 3.21073 7.88448 3.63158 8.13702L13.1053 13.8221C13.9474 14.3275 15 13.6958 15 12.6851L15 1.31488C15 0.304194 13.9474 -0.327487 13.1053 0.177857L3.63158 5.86298C3.21073 6.11553 3.00021 6.55739 3 6.99935V1.5C3 0.671573 2.32843 0 1.5 0Z"
                fill="currentColor" />
            </svg>
          }
        >
          Previous battle
        </BlackButton> : null}

        {PlayButton}

        {isMultipleBattles ? <BlackButton
          onClick={() => setCurIdx(prev => Math.min(maxIdx, prev + 1))}
          size="sm"
          disabled={curIdx === maxIdx}
          rightIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M13.5 0C14.3284 0 15 0.671573 15 1.5V12.5C15 13.3284 14.3284 14 13.5 14C12.6716 14 12 13.3284 12 12.5V7.00065C11.9998 7.44261 11.7893 7.88448 11.3684 8.13702L1.89474 13.8221C1.05263 14.3275 -9.53674e-07 13.6958 -9.53674e-07 12.6851L0 1.31488C0 0.304194 1.05263 -0.327487 1.89474 0.177857L11.3684 5.86298C11.7893 6.11553 11.9998 6.55739 12 6.99935V1.5C12 0.671573 12.6716 0 13.5 0Z"
                fill="currentColor" />
            </svg>
          }
        >
          Next battle
        </BlackButton> : null}
      </Flex>


      {curBattleId ? (
        <BattleResultData battleId={curBattleId}>
          {(battleLog) => (
            <BattleResult battleLog={battleLog} key={curBattleId} battleId={curBattleId} setPlayButton={setPlayButton} />
          )}
        </BattleResultData>) : null}
    </BattleBackgroundWrapper>
  );

};

