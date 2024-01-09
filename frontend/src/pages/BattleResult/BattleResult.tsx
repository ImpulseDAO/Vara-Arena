import styles from './BattleResult.module.css';
//
import clsx from "clsx";
import { Box, Flex, Text } from "@mantine/core";
import { Panel } from 'components/Panel';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useBattleLogById } from "app/api/battleLogs";
import { BattleBackgroundWrapper } from "./components/BackgroundWrapper";
import { BattleResultNotFound } from "./components/BattleResultNotFound";
import { BlackButton } from "./components/BlackButton";
import { useHotkeys } from '@mantine/hooks';
import { TextButton } from './components/TextButton';
import { visualizeBattleLog } from './components/visualizeBattleLog';
import { CharPanel } from './components/CharPanel';

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

/**
 * Battle Result
 */

const SIDE_PANEL_WIDTH = 375;
const MID_PANEL_WIDTH = 420;

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
  * ( used for scrolling to them )
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

  useHotkeys([
    ['ArrowUp', () => canGoBack && setCurrentTurnIndex(currentTurnIndex - 1)],
    ['ArrowLeft', () => canGoBack && setCurrentTurnIndex(currentTurnIndex - 1)],
    ['ArrowDown', () => canGoNext && setCurrentTurnIndex(currentTurnIndex + 1)],
    ['ArrowRight', () => canGoNext && setCurrentTurnIndex(currentTurnIndex + 1)],
    ['Space', () => playButtonRef.current?.click()]
  ]);

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


  React.useEffect(() => {
    // stop playing when unmounting
    return () => setIsPlaying(false);
  }, []);

  /**
   * Visualize battle log
   */
  const logVisualized = visualizeBattleLog(turns ?? [], characters.filter(Boolean));

  /**
   *  Play Button functionality
   */
  const playButtonRef = useRef<React.ElementRef<'button'>>(null);

  const playButton = React.useMemo(() => {
    const playButton = <BlackButton
      w="95px"
      buttonRef={playButtonRef}
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
      rightSection={
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

  /**
   * Fallback
   */
  if (isSuccess && battleLog === null) {
    return <BattleResultNotFound />;
  }

  /**
   * Render
   */
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
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          pl="1rem"
          mah="75vh"
        >

          <Box pl="2rem">
            <p>{`Battle ID: ${battleId}`}</p>
            <Box component="p" mb="sm">
              <Text component='span' display="inline-block" w="125px">Current turn: {currentTurnIndex}</Text>
              <TextButton disabled={!canGoBack} onClick={() => setCurrentTurnIndex(currentTurnIndex - 1)}>Prev</TextButton>
              <TextButton disabled={!canGoNext} onClick={() => setCurrentTurnIndex(currentTurnIndex + 1)}>Next</TextButton>

            </Box>
          </Box>

          <Box component="ol"
            pl='xl'
            start={0}
            style={{
              overflowY: 'scroll',
            }}
          >
            {logVisualized.map((turnLogs, i) => {

              const isInactive = currentTurnIndex < i;

              return (
                <Box
                  ref={(ref) => {
                    itemRefs.current[i] = ref as HTMLElement;
                  }}
                  onClick={() => setCurrentTurnIndex(i)}
                  component="li"
                  key={i}
                  className={clsx(styles.element, isInactive ? styles.inactive : null)}
                >
                  <Box component="span" {...isInactive ? { style: theme => ({ opacity: '0.4' }) } : {}}>
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
