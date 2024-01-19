import styles from './BattleResult.module.css';
//
import clsx from "clsx";
import { Box, Flex, Text, Tooltip } from "@mantine/core";
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

              <Tooltip label={(
                <Text size="13px">
                  You can user keyboard arrows <br />to navigate through the log
                </Text>
              )}>
                <Box component='span' ml="md">
                  <svg
                    width="30"
                    height="20"
                    style={{ transform: 'translateY(2px)' }}
                    viewBox="0 0 96 64"
                    fill="rgb(210, 210, 210)"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M82.6 42.8984C82.1 42.3984 81.2 42.3984 80.7 42.8984C80.2 43.3984 80.2 44.2984 80.7 44.7984L82.9 46.9984H73.8C73.1 46.9984 72.5 47.5984 72.5 48.2984C72.5 48.9984 73.1 49.5984 73.8 49.5984H82.9L80.7 51.7984C80.2 52.2984 80.2 53.1984 80.7 53.6984C81 53.9984 81.3 54.0984 81.6 54.0984C81.9 54.0984 82.3 53.9984 82.5 53.6984L86.9 49.2984C87.4 48.7984 87.4 47.8984 86.9 47.3984L82.6 42.8984Z" />
                    <path d="M87.7004 33.1992H72.2004C68.2004 33.1992 64.9004 36.4992 64.9004 40.4992V55.9992C64.9004 59.9992 68.2004 63.2992 72.2004 63.2992H87.8004C91.8004 63.2992 95.1004 59.9992 95.1004 55.9992V40.4992C95.0004 36.4992 91.7004 33.1992 87.7004 33.1992ZM92.3004 55.9992C92.3004 58.4992 90.2004 60.5992 87.7004 60.5992H72.2004C69.7004 60.5992 67.6004 58.4992 67.6004 55.9992V40.4992C67.6004 37.9992 69.7004 35.8992 72.2004 35.8992H87.8004C90.3004 35.8992 92.4004 37.9992 92.4004 40.4992V55.9992H92.3004Z" />
                    <path d="M51.0002 48.9988L48.8002 51.1988V42.0988C48.8002 41.3988 48.2002 40.7988 47.5002 40.7988C46.8002 40.7988 46.2002 41.3988 46.2002 42.0988V51.1988L44.0002 48.9988C43.5002 48.4988 42.6002 48.4988 42.1002 48.9988C41.8002 49.2988 41.7002 49.5988 41.7002 49.8988C41.7002 50.1988 41.8002 50.5988 42.1002 50.7988L46.5002 55.1988C47.0002 55.6988 47.9002 55.6988 48.4002 55.1988L52.8002 50.7988C53.3002 50.2988 53.3002 49.3988 52.8002 48.8988C52.4002 48.4988 51.5002 48.4988 51.0002 48.9988Z" />
                    <path d="M55.3004 33.1992H39.7004C35.7004 33.1992 32.4004 36.4992 32.4004 40.4992V55.9992C32.4004 59.9992 35.7004 63.2992 39.7004 63.2992H55.3004C59.3004 63.2992 62.6004 59.9992 62.6004 55.9992V40.4992C62.5004 36.4992 59.3004 33.1992 55.3004 33.1992ZM59.9004 55.9992C59.9004 58.4992 57.8004 60.5992 55.3004 60.5992H39.7004C37.2004 60.5992 35.1004 58.4992 35.1004 55.9992V40.4992C35.1004 37.9992 37.2004 35.8992 39.7004 35.8992H55.3004C57.8004 35.8992 59.9004 37.9992 59.9004 40.4992V55.9992Z" />
                    <path d="M48.3996 8.69922C47.8996 8.19922 46.9996 8.19922 46.4996 8.69922L42.0996 13.0992C41.5996 13.5992 41.5996 14.4992 42.0996 14.9992C42.5996 15.4992 43.4996 15.4992 43.9996 14.9992L46.1996 12.7992V21.8992C46.1996 22.5992 46.7996 23.1992 47.4996 23.1992C48.1996 23.1992 48.7996 22.5992 48.7996 21.8992V12.7992L50.9996 14.9992C51.4996 15.4992 52.3996 15.4992 52.8996 14.9992C53.1996 14.6992 53.2996 14.3992 53.2996 14.0992C53.2996 13.7992 53.1996 13.3992 52.8996 13.1992L48.3996 8.69922Z" />
                    <path d="M55.3004 0.699219H39.7004C35.7004 0.699219 32.4004 3.99922 32.4004 7.99922V23.5992C32.4004 27.5992 35.7004 30.8992 39.7004 30.8992H55.3004C59.3004 30.8992 62.6004 27.5992 62.6004 23.5992V7.99922C62.5004 3.99922 59.3004 0.699219 55.3004 0.699219ZM59.9004 23.4992C59.9004 25.9992 57.8004 28.0992 55.3004 28.0992H39.7004C37.2004 28.0992 35.1004 25.9992 35.1004 23.4992V7.99922C35.1004 5.49922 37.2004 3.39922 39.7004 3.39922H55.3004C57.8004 3.39922 59.9004 5.49922 59.9004 7.99922V23.4992Z" />
                    <path d="M21.1996 46.8984H12.0996L14.2996 44.6984C14.7996 44.1984 14.7996 43.2984 14.2996 42.7984C13.9996 42.4984 13.6996 42.3984 13.3996 42.3984C13.0996 42.3984 12.6996 42.4984 12.4996 42.7984L8.09961 47.1984C7.59961 47.6984 7.59961 48.5984 8.09961 49.0984L12.4996 53.4984C12.9996 53.9984 13.8996 53.9984 14.3996 53.4984C14.8996 52.9984 14.8996 52.0984 14.3996 51.5984L12.1996 49.3984H21.2996C21.9996 49.3984 22.5996 48.7984 22.5996 48.0984C22.5996 47.3984 21.8996 46.8984 21.1996 46.8984Z" />
                    <path d="M22.8 33.1992H7.3C3.3 33.1992 0 36.4992 0 40.4992V55.9992C0 59.9992 3.3 63.2992 7.3 63.2992H22.9C26.9 63.2992 30.2 59.9992 30.2 55.9992V40.4992C30.1 36.4992 26.8 33.1992 22.8 33.1992ZM27.4 55.9992C27.4 58.4992 25.3 60.5992 22.8 60.5992H7.3C4.8 60.5992 2.7 58.4992 2.7 55.9992V40.4992C2.7 37.9992 4.8 35.8992 7.3 35.8992H22.9C25.4 35.8992 27.5 37.9992 27.5 40.4992V55.9992H27.4Z" />
                  </svg>
                </Box>
              </Tooltip>

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
