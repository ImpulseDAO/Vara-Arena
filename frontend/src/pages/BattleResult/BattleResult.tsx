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
      <BattleResultData battleId={battleId}>

        {(battleLog) => (
          <BattleResult battleId={battleId} withPlayButton battleLog={battleLog} />
        )}
      </BattleResultData>
    </BattleBackgroundWrapper>
  );
};


/**
 * This is done to keep query logic in the component that is not unmounted on battle change
 * whereas the BattleResult component is unmounted and mounted again when clicking "Next battle" / "Prev battle"
 * 
 * Therefore the previous data is preserved and the UI doesn't flicker.
 */
export const BattleResultData = ({
  battleId,
  children,
}: {
  battleId: string;
  withPlayButton?: boolean;
  children: (data: ReturnType<typeof useBattleLogById>['data']) => JSX.Element;
}) => {
  const { data: battleLog } = useBattleLogById({ battleId });

  return children(battleLog);
};

export const BattleResult = ({
  battleId,
  setPlayButton,
  withPlayButton = false,
  battleLog
}: {
  battleLog: ReturnType<typeof useBattleLogById>['data'];
  battleId: string;
  setPlayButton?: (button: React.ReactNode) => void;
  withPlayButton?: boolean;
}) => {

  const isSuccess = battleLog != null;



  /**
   * Characters
   */
  const char1id = battleLog?.character1.character;
  const char2id = battleLog?.character2.character;

  const char1 = battleLog?.lobby.characters.find(char => char.character.id === char1id)?.character;
  const char2 = battleLog?.lobby.characters.find(char => char.character.id === char2id)?.character;
  const characters = [char1, char2];

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

  const logVisualized = visualizeBattleLog(turns ?? [], characters.filter(Boolean));

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
          pl="1rem"
          mah="75vh"
        >

          <Box pl="2rem">
            <p>{`Battle ID: ${battleId}`}</p>
            <Box component="p" mb="sm">{`Current turn: ${currentTurnIndex}`}
              <TextButton disabled={!canGoBack} onClick={() => setCurrentTurnIndex(currentTurnIndex - 1)}>Prev</TextButton>
              <TextButton disabled={!canGoNext} onClick={() => setCurrentTurnIndex(currentTurnIndex + 1)}>Next</TextButton>
            </Box>
          </Box>

          <Box component="ol"
            pl='xl'
            style={{
              overflowY: 'scroll',
            }}
          >
            {logVisualized.map((turnLogs, i) => {
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
                    '&::marker': { color: isInactive ? 'gray' : undefined }
                  }}>
                  <Box component="span" {...isInactive ? { sx: theme => ({ opacity: '0.4' }) } : {}}>
                    {turnLogs.map((line, i) => <p key={i}>{line}</p>)}
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

type AttackKind = "Quick" | "Precise" | "Heavy";

const spellnames = [
  'fireball',
  'waterRestoration',
  'earthCatapult',
  'waterBurst',
  'fireWall',
  'fireHaste',
  'earthSmites',
  'earthSkin',
  'chillingTouch'
] as const;

type Spell = typeof spellnames[number];

type Action = {
  move?: {
    position: number;
  };
  attack?: {
    kind: AttackKind;
    result: {
      damage?: number;
      miss?: any;
    };
  };
  rest?: {
    energy: number;
  };
  castSpell: {
    result: {
      [key in Spell]: key extends 'fireball' | 'waterBurst' ? { damage: number; }
      : key extends 'waterRestoration' ? { heal: number; }
      : key extends 'earthCatapult' ? { damage: number, enemyPosition: number; }
      : {}
    };
  };
  fireWall: {
    damage: number;
  };
  notEnoughEnergy: {};
  parry: {};
  guardbreak: {};
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
  color,
}: {
  charName: string;
  color: string;
}) => {
  return <Text component="span" color={color}>{charName}</Text>;
};

function visualizeBattleLog(battleLog: BattleStep[], characters: ({ name: string, id: string; })[]): React.ReactNode[][] {
  const results: React.ReactNode[][] = [];

  battleLog.forEach((step, index) => {
    const turnLogs: React.ReactNode[] = step.logs.map((log) => {
      const index = characters.findIndex(char => char.id === log.character);
      const charName = characters[index].name;

      try {
        const color = index === 0 ? 'coral' : 'cyan';
        return getLogEntryDescription(log, charName, color);
      } catch (error) {
        return <Text c="red">Error while parsing log entry</Text>;
      }
    });

    results.push(turnLogs);
  });

  return results;
}

//  isFirst ? 'red' : 'blue'
const getLogEntryDescription = (log: LogEntry, charName: string, color: string) => {

  switch (true) {
    case log.action.move != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> moves to position {log.action.move?.position}.
        </Text>
      );
    case log.action.attack != null:
      const { kind, result } = log.action.attack ?? { result: {} };
      return (
        <Text component="span">
          {
            'damage' in result ? (
              <><Name {...{ charName, color }} /> deals {result.damage} dmg using {kind?.toLowerCase()} attack</>
            ) : null
          }
          {
            'miss' in result ? (
              <><Name {...{ charName, color }} /> misses trying to use {kind?.toLowerCase()} attack.</>
            ) : null
          }
        </Text>
      );
    case log.action.rest != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> rests, gaining {log.action.rest?.energy} energy.
        </Text>
      );
    case log.action.castSpell != null:
      const spell = spellnames.find(spell => spell in log.action.castSpell?.result);
      if (!spell) return <Text component="span">Unknown spell</Text>;
      const details = log.action.castSpell?.result[spell] ?? {};

      return (
        <Text component="span">
          <Name {...{ charName, color }} /> casts {spell} spell.
          {'heal' in details ? ` ${details.heal} HP healed` : null}
          {'damage' in details ? ` ${details.damage} damage dealt` : null}
          {'enemyPosition' in details ? ` Enemy thrown to position ${details.enemyPosition}` : null}
        </Text>
      );
    case log.action.fireWall != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> gets {log.action.fireWall.damage} damage from firewall.
        </Text>
      );
    case log.action.notEnoughEnergy != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> doesn't have enough energy.
        </Text>
      );
    case log.action.parry != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> parries the attack.
        </Text>
      );
    case log.action.guardbreak != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> guardbreaks the attack.
        </Text>
      );
    default: {
      return <Text component="span">Unknown action</Text>;
    }
  }
};
