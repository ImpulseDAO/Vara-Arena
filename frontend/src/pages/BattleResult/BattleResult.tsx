import { Anchor, Box, Flex, Stack, Text } from "@mantine/core";
import { CharInfo } from "pages/@shared/CharInfo";
import { Panel } from 'components/Panel';
import { StatBar } from "pages/@shared/StatBar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getShortIdString, getXpNeededForLvlUp } from "utils";
import { CharStats } from "pages/@shared/CharStats/CharStats";
import { getFullEnergy, getFullHp } from "consts";
import { useParams } from "react-router-dom";
import { useBattleLogById } from "app/api/battleLogs";
import { BattleBackgroundWrapper } from "./components/BackgroundWrapper";
import { BattleResultNotFound } from "./components/BattleResultNotFound";
import { BlackButton } from "./components/BlackButton";

const SIDE_PANEL_WIDTH = 375;
const MID_PANEL_WIDTH = 420;

export const BattleResultPage = () => {
  const { battleId } = useParams<{ battleId: string; }>();

  if (battleId == null) {
    return (
      <BattleBackgroundWrapper>
        <BattleResultNotFound />
      </BattleBackgroundWrapper>
    );
  }

  return (
    <BattleBackgroundWrapper>
      <BattleResult battleId={battleId} withPlayButton />
    </BattleBackgroundWrapper>
  );
};

export const BattleResult = ({
  battleId,
  setPlayButton,
  withPlayButton = false,
}: {
  battleId: string;
  setPlayButton?: (button: React.ReactNode) => void;
  withPlayButton?: boolean;
}) => {

  const { data: battleLog, isSuccess } = useBattleLogById({ battleId });

  console.log('battleLog', battleLog);


  /**
   * Characters
   */
  const char1id = battleLog?.character1.character;
  const char2id = battleLog?.character2.character;

  const char1 = battleLog?.lobby.characters.find(char => char.character.id === char1id)?.character;
  const char2 = battleLog?.lobby.characters.find(char => char.character.id === char2id)?.character;
  const names = [char1, char2].map(char => char?.name ?? '');

  /**
  * List items refs
  */

  const itemRefs = useRef<HTMLElement[]>([]);

  /**
   * Turns
   */
  const [currentTurnIndex, setCurrentTurnIndexRaw] = useState(0);
  const { turns } = battleLog ?? {};
  const currentTurn = turns?.[currentTurnIndex];
  const lastTurnIndex = (turns?.length ?? 0) - 1;
  const [canGoBack, canGoNext] = [currentTurnIndex > 0, currentTurnIndex < lastTurnIndex];

  const setCurrentTurnIndex = useCallback((newStateOfFunction: number | ((prev: number) => number)) => {

    return setCurrentTurnIndexRaw(
      prevState => {
        let newIdx = typeof newStateOfFunction === 'function' ? newStateOfFunction(prevState) : newStateOfFunction;

        if (newIdx % 7 !== 0 && (newIdx !== lastTurnIndex || newIdx !== 0)) {
          // do nothing
        }
        else if (newIdx >= 0 && itemRefs.current?.[newIdx]) {
          const weAreScrollingBack = newIdx < prevState;
          // scroll only to every 3rd or to the last

          const idxToScrollTo = weAreScrollingBack
            ? Math.max(newIdx - 10, 0)
            : Math.min(newIdx + 10, lastTurnIndex);


          itemRefs.current[idxToScrollTo]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }

        return newIdx;
      }
    );
  }, [lastTurnIndex]);

  /**
   * Playback
   */
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {

    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTurnIndex((prev) => {
          if (prev < lastTurnIndex) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 100);
      return () => clearInterval(interval);
    }

  }, [isPlaying, lastTurnIndex, setCurrentTurnIndex]);

  /**
   * 
   */

  const logVisualized = visualizeBattleLog(turns ?? [], names);

  /**
   * 
   */

  React.useEffect(() => {
    return () => setIsPlaying(false);
  }, []);

  const playButton = React.useMemo(() => {
    const playButton = <BlackButton
      onClick={() => {
        if (currentTurnIndex === lastTurnIndex) {
          setCurrentTurnIndex(0);
          itemRefs.current?.[0].scrollIntoView({
            behavior: 'auto',
            block: 'nearest'
          });
        }
        setIsPlaying(!isPlaying);
      }}
      rightIcon={
        isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M9 1.5C9 0.671573 8.32843 0 7.5 0V0C6.67157 0 6 0.671573 6 1.5V12.5C6 13.3284 6.67157 14 7.5 14V14C8.32843 14 9 13.3284 9 12.5V1.5Z" fill="white" />
            <path d="M3 1.5C3 0.671573 2.32843 0 1.5 0V0C0.671573 0 0 0.671573 0 1.5V12.5C0 13.3284 0.671573 14 1.5 14V14C2.32843 14 3 13.3284 3 12.5V1.5Z" fill="white" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 13 14" fill="none">
            <path d="M11.8684 8.13702C12.7105 7.63168 12.7105 6.36832 11.8684 5.86298L2.39474 0.177857C1.55263 -0.327487 0.5 0.304193 0.5 1.31488L0.499999 12.6851C0.499999 13.6958 1.55263 14.3275 2.39474 13.8221L11.8684 8.13702Z" fill="white" />
          </svg>
        )
      }
    >
      {isPlaying ? 'Pause' : 'Play'}
    </BlackButton >;

    setPlayButton?.(playButton);
    return playButton;
  }, [currentTurnIndex, isPlaying, lastTurnIndex, setCurrentTurnIndex, setPlayButton]);

  if (isSuccess && battleLog === null) {
    return <BattleResultNotFound />;
  }

  return (
    <>
      {withPlayButton ? <Box mb="md">
        {playButton}
      </Box> : null}

      <Flex gap='md'>
        <Panel w={SIDE_PANEL_WIDTH} >
          {currentTurn ? <CharPanel character={char1} charState={currentTurn?.character1 ?? undefined} /> : null}
        </Panel>
        <Panel
          w={MID_PANEL_WIDTH}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
          pl="2.5rem"
          mah="75vh"
        >

          <p>{`Battle ID: ${battleId}`}</p>
          <Box component="p" mb="sm">{`Current turn: ${currentTurnIndex}`}
            <TextButton disabled={!canGoBack} onClick={() => setCurrentTurnIndex(currentTurnIndex - 1)}>Prev</TextButton>
            <TextButton disabled={!canGoNext} onClick={() => setCurrentTurnIndex(currentTurnIndex + 1)}>Next</TextButton>
          </Box>

          <Box component="ol"
            style={{
              overflowY: 'scroll',
            }}
          >
            {logVisualized.map((text, i) => {
              if (i === 0) {
                return <div
                  key={i}
                  ref={(ref) => {
                    itemRefs.current[i] = ref as HTMLElement;
                  }}>

                </div>;
              }

              const isInactive = currentTurnIndex < i;

              return (
                <Box
                  ref={(ref) => {
                    itemRefs.current[i] = ref as HTMLElement;
                  }}
                  onClick={() => setCurrentTurnIndex(i)}
                  component="li"
                  key={i}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    cursor: 'pointer',
                  }}>
                  <Box component="span" {...isInactive ? { sx: theme => ({ opacity: '0.4' }) } : {}}>
                    {text.map((line, i) => <p key={i}>{line}</p>)}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Panel>



        <Panel w={SIDE_PANEL_WIDTH} >
          {currentTurn
            ? <CharPanel character={char2} charState={currentTurn?.character2 ?? undefined} />
            : null}
        </Panel>
      </Flex>
    </>
  );
};

const CharPanel = ({ character, charState }: { character: any; charState?: CharacterState; }) => {
  return (
    <Stack spacing={0}>
      <StatBar
        health={Math.ceil(charState?.hp ?? 0)} // mock
        healthMax={getFullHp(character.attributes.vitality)}
        energy={Math.ceil(charState?.energy ?? 0)} // mock
        energyMax={getFullEnergy(character.attributes.stamina)}
      />

      <CharInfo
        mt="lg"

        isMyCharacter={true}
        name={character.name}
        shortId={getShortIdString(character.id)}
        //
        exp={character.experience}
        maxExp={getXpNeededForLvlUp(character.level)}
        level={character.level}
      />

      <CharStats
        style={{
          justifySelf: 'end'
        }}
        character={character}
      />

    </Stack>
  );
};

const TextButton = ({
  disabled = false,
  onClick,
  children
}: {
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return <Anchor
    pl="sm"
    sx={{
      userSelect: 'none',
      ...disabled
        ? { color: 'gray', textDecoration: 'none', cursor: 'default', '&:hover': { textDecoration: 'none' } }
        : {}
    }}
    onClick={disabled ? undefined : onClick}
  >
    {children}
  </Anchor>;
};

/**
 * 
 */

type CharacterState = {
  energy: number;
  hp: number;
  position: number;
};

type Action = {
  move?: {
    position: number;
  };
  attack?: {
    kind: string;
    result: {
      miss?: any;
    };
  };
  rest?: {
    energy: number;
  };
};

type LogEntry = {
  action: Action;
  character: string;
};

type BattleStep = {
  character1?: CharacterState | null;
  character2?: CharacterState | null;
  logs: LogEntry[];
};

const Name = ({
  charName,
  isFirst,
}: {
  charName: string;
  isFirst: boolean;
}) => {
  return <Text component="span" color={isFirst ? 'red' : 'blue'}>{charName}</Text>;
};

function visualizeBattleLog(battleLog: BattleStep[], names: string[]): React.ReactNode[][] {
  const results: React.ReactNode[][] = [];

  battleLog.forEach((step, index) => {
    const nestedResults: React.ReactNode[] = [];
    step.logs.forEach((log, charIdx) => {
      const isFirst = charIdx === 0;
      const charName = names[charIdx];

      if (log.action.move) {
        nestedResults.push(
          <Text component="span">
            <Name {...{ charName, isFirst }} /> moves to position {log.action.move.position}.
          </Text>
        );
      } else if (log.action.attack) {
        nestedResults.push(
          <Text component="span">
            <Name {...{ charName, isFirst }} /> attacks with {log.action.attack.kind}.
          </Text>
        );
      } else if (log.action.rest) {
        nestedResults.push(
          <Text component="span">
            <Name {...{ charName, isFirst }} /> rests, gaining {log.action.rest.energy} energy.
          </Text>
        );
      }
    });
    results.push(nestedResults);
  });

  return results;
}
