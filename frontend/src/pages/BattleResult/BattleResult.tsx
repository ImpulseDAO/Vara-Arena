import { Anchor, BackgroundImage, Box, Button, Flex, LoadingOverlay, Stack, Text } from "@mantine/core";
import BattleBackground from 'assets/images/battle.png';
import { CharInfo } from "pages/@shared/CharInfo";

import { Panel } from 'components/Panel';
import { StatBar } from "pages/@shared/StatBar";
import { useEffect, useState } from "react";
import { getShortIdString, getXpNeededForLvlUp } from "utils";
import { CharStats } from "pages/@shared/CharStats/CharStats";
import { getFullEnergy, getFullHp } from "consts";
import { useParams } from "react-router-dom";
import { useBattleLogById } from "app/api/battleLogs";

const SIDE_PANEL_WIDTH = 375;
const MID_PANEL_WIDTH = 420;

export const BattleResult = () => {
  const { battleId } = useParams<{ battleId: string; }>();
  const { data: battleLog } = useBattleLogById({ battleId });

  /**
   * Characters
   */
  const char1 = battleLog?.lobby.characters[0].character;
  const char2 = battleLog?.lobby.characters[1].character;

  /**
   * Turns
   */
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const { turns } = battleLog ?? {};
  const currentTurn = turns?.[currentTurnIndex];

  /**
   * Playback
   */
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {

    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTurnIndex((prev) => {
          if (prev + 1 < (turns?.length ?? 0)) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 100);
      return () => clearInterval(interval);
    }

  }, [isPlaying, turns?.length]);

  console.log('battleLog', battleLog);
  console.log('turns', turns);

  const names = [0, 1].map(idx => battleLog?.lobby.characters[idx].character.name ?? (idx === 0 ? 'first' : 'second'));
  const logVisualized = visualizeBattleLog(turns ?? [], names);
  console.log('logVisualized', logVisualized);

  if (!char1 || !char2) {
    return <LoadingOverlay visible />;
  }

  return (
    <BackgroundImage src={BattleBackground} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'start',

      paddingBlock: '2rem'
    }}>
      <Flex mb="md">
        <Button
          h={44}
          style={{
            display: "inline-flex",
            padding: "10px 16px",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            //
            borderRadius: "8px",
            background: "#000"
          }}
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        >
          <Flex gap="xs" align={'center'}>
            {
              isPlaying ? (
                <>
                  Pause
                  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
                    <path d="M9 1.5C9 0.671573 8.32843 0 7.5 0V0C6.67157 0 6 0.671573 6 1.5V12.5C6 13.3284 6.67157 14 7.5 14V14C8.32843 14 9 13.3284 9 12.5V1.5Z" fill="white" />
                    <path d="M3 1.5C3 0.671573 2.32843 0 1.5 0V0C0.671573 0 0 0.671573 0 1.5V12.5C0 13.3284 0.671573 14 1.5 14V14C2.32843 14 3 13.3284 3 12.5V1.5Z" fill="white" />
                  </svg>
                </>
              )
                : (
                  <>
                    Play
                    <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 13 14" fill="none">
                      <path d="M11.8684 8.13702C12.7105 7.63168 12.7105 6.36832 11.8684 5.86298L2.39474 0.177857C1.55263 -0.327487 0.5 0.304193 0.5 1.31488L0.499999 12.6851C0.499999 13.6958 1.55263 14.3275 2.39474 13.8221L11.8684 8.13702Z" fill="white" />
                    </svg>
                  </>
                )}
          </Flex>
        </Button>
      </Flex>

      <Flex gap='md'>
        <Panel w={SIDE_PANEL_WIDTH} >
          {currentTurn ? <CharPanel character={char1} charState={currentTurn.character1 ?? undefined} /> : null}
        </Panel>
        <Panel
          w={MID_PANEL_WIDTH}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          pl="2.5rem"
        >

          <p>{`Battle ID: ${battleId}`}</p>
          <Box component="p" mb="sm">{`Current turn: ${currentTurnIndex}`}
            {currentTurnIndex > 0 ? <Anchor pl="sm" style={{ userSelect: 'none' }} onClick={() => setCurrentTurnIndex(currentTurnIndex - 1)}>Prev</Anchor> : null}
            {currentTurnIndex + 1 < (turns?.length ?? 0) ? <Anchor pl="sm" style={{ userSelect: 'none' }} onClick={() => setCurrentTurnIndex(currentTurnIndex + 1)}>Next</Anchor> : null}
          </Box>

          <ol>
            {logVisualized.map((text, i) => {
              if (i === 0) {
                return null;
              }

              const isInactive = currentTurnIndex < i;

              return (
                <Box
                  onClick={() => setCurrentTurnIndex(i)}
                  component="li"
                  key={i}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    cursor: 'pointer',
                    backgroundColor: i % 2 === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  }}>
                  <Box component="span" {...isInactive ? { sx: theme => ({ color: 'rgba(255, 255, 255, 0.3)' }) } : {}}>
                    {text.map((line, i) => <p key={i}>{line}</p>)}
                  </Box>
                </Box>
              );
            })}
          </ol>

          {/* <Box component="pre" sx={{
            maxWidth: '400px',
            overflowX: 'scroll'
          }}>
            {JSON.stringify(battleLog, null, 2)}
          </Box> */}
        </Panel>



        <Panel w={SIDE_PANEL_WIDTH} >
          {currentTurn
            ? <CharPanel character={char2} charState={currentTurn.character2 ?? undefined} />
            : null}
        </Panel>
      </Flex>
    </BackgroundImage >
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
          <Text>
            <Name {...{ charName, isFirst }} /> moves to position {log.action.move.position}.
          </Text>
        );
      } else if (log.action.attack) {
        nestedResults.push(
          <Text>
            <Name {...{ charName, isFirst }} /> attacks with {log.action.attack.kind}.
          </Text>
        );
      } else if (log.action.rest) {
        nestedResults.push(
          <Text>
            <Name {...{ charName, isFirst }} /> rests, gaining {log.action.rest.energy} energy.
          </Text>
        );
      }
    });
    results.push(nestedResults);
  });

  return results;
}
