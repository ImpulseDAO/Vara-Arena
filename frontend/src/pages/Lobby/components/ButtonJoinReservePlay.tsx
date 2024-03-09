import "../styles.scss";

import React, { useCallback, useMemo } from "react";
import { useAlert, useSendMessage } from "@gear-js/react-hooks";
import { ProgramMetadata } from "@gear-js/api";
import { ARENA_PROGRAM_ID, ARENA_METADATA } from "consts";
import { useNavigate } from "react-router-dom";
import { Button, Text } from "@mantine/core";
import { MAX_GAS_LIMIT } from "consts";
import { useOnRegisterForBattle } from "pages/StartFight/hooks/useOnSubmit";
import { useMyHeroIsDead } from "app/api/mintState";

const JOIN_BUTTON_TEXT = "Join the battle";
const RESERVE_BUTTON_TEXT = "Reserve gas";
const PLAY_BUTTON_TEXT = "Start battle";

const RESERVATIONS_COUNT_FOR_4_PLAYERS = 2;

/**
 * "Smart" button. It can be in 3 states:
 * 1. Initial state. Button text is "Join the battle".
 * 2. Button text is "Reserve gas".
 * 3. Button text is "Play".
 */
export const ButtonsJoinReservePlay = ({
  hasPlayerJoined,
  lobbyId,
  players,
  playersNeeded,
  refreshState,
  gasReservedTimes,
  onGasReserved,
  onStartButtonSucess
}: {
  hasPlayerJoined: boolean;
  lobbyId?: string;
  players: Array<{
    id: string;
    // a lot of fields omitted
  }>;
  playersNeeded: number;
  refreshState: () => void;
  gasReservedTimes: number;
  onGasReserved?: (times: number) => void;
  onStartButtonSucess?: () => void;
}) => {
  const alert = useAlert();
  const navigate = useNavigate();
  const meta = useMemo(() => ProgramMetadata.from(ARENA_METADATA), []);
  const send = useSendMessage(ARENA_PROGRAM_ID, meta);

  const isUserHasPermissionToCancel = false;
  const isReservationsNeeded = playersNeeded === 4;

  const { handleGasReserved } = useGasReserved({ onGasReserved });
  const { isDead: isMyHeroDead, isFresh } = useMyHeroIsDead();

  const isJoinButtonVisible = !isMyHeroDead && !hasPlayerJoined && players.length < playersNeeded;
  const isJoinButtonDisabled = isMyHeroDead || isFresh;
  const isReserveButtonReadyToShow = isReservationsNeeded && gasReservedTimes < RESERVATIONS_COUNT_FOR_4_PLAYERS;
  const isReservationFullfilled = !isReservationsNeeded || gasReservedTimes === RESERVATIONS_COUNT_FOR_4_PLAYERS;
  const isStartButtonVisible = playersNeeded === players.length && isReservationFullfilled && hasPlayerJoined;

  const [isLoading, setIsLoading] = React.useState(false);

  const isPlayDisabled = hasPlayerJoined && playersNeeded > players.length;

  const reserveGas = React.useCallback(() => {
    return new Promise((resolve, reject) => {
      send({
        payload: {
          ReserveGas: {
            lobby_id: lobbyId
          }
        },
        gasLimit: MAX_GAS_LIMIT,
        onSuccess: () => {
          console.log("successfully reserved gas");
          resolve("successfully reserved gas");
          handleGasReserved();
        },
        onError: () => {
          console.log("error while reserving gas");
          reject("error while reserving gas");
        },
      });
    });
  }, [send, lobbyId, handleGasReserved]);

  const startBattle = React.useCallback(() => {
    return new Promise((resolve) => {
      send(
        {
          payload: {
            Play: {
              lobby_id: lobbyId
            },
          },
          gasLimit: MAX_GAS_LIMIT,
          onSuccess: () => {
            localStorage.setItem("players", JSON.stringify([]));
            console.log("successfully started the battle");
            resolve("successfully started the battle");
            onStartButtonSucess?.();
          },
          onError: () => console.log("error while starting the battle"),
        }
      );
    });
  }, [send, lobbyId, onStartButtonSucess]);

  const registerForBattle = useOnRegisterForBattle();


  const handleJoin = async () => {
    if (!hasPlayerJoined) {
      if (!lobbyId) {
        const message = "lobbyId is not defined";
        console.error(message);
        alert.error(message);
        return;
      }
      console.log('registerForBattle called with lobbyId: ', lobbyId);
      try {
        await registerForBattle({ lobbyId });
        refreshState();
      } catch (er) {
        console.error(er);
      } finally {
        setIsLoading(false);
      }
      return;
    }
  };

  const handleReserve = async () => {
    setIsLoading(true);
    try {
      await reserveGas();
    }
    catch (er) {
      console.error(er);
    }
    setIsLoading(false);
  };

  const handleStart = async () => {
    setIsLoading(true);

    if (!hasPlayerJoined) {
      const message = "You are not registered for the battle";
      console.error(message);
      alert.error(message);
      setIsLoading(false);
      return;
    }

    try {
      await startBattle();
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    send(
      {
        payload: {
          CleanState: null,
        },
        gasLimit: MAX_GAS_LIMIT,
        onSuccess: () => {
          console.log("CleanState message successfully sent");
          navigate("/arena");
        },
        onError: () => console.log("Error while cleaning the state"),
      }
    );
  };

  return (
    <>
      {/* "Join" button */}
      {
        isJoinButtonVisible ? (
          <Button
            className={["action_button", isJoinButtonDisabled && "disabled"]
              .filter(Boolean)
              .join(" ")}
            onClick={handleJoin}
            disabled={isJoinButtonDisabled}
            loading={isLoading}
          >
            {JOIN_BUTTON_TEXT}
          </Button>
        ) : null
      }

      {/* "Reserve gas" button */}
      {
        isReserveButtonReadyToShow ? (
          <Button
            className={["action_button"]
              .filter(Boolean)
              .join(" ")}
            onClick={handleReserve}
            loading={isLoading}
          >
            {RESERVE_BUTTON_TEXT}
          </Button>
        ) : null
      }

      {/* START button */}
      {
        isStartButtonVisible ? (
          <Button
            className={["action_button", isPlayDisabled && "disabled"].join(" ")}
            onClick={handleStart}
            loading={isLoading}
            disabled={isPlayDisabled}
          >
            {PLAY_BUTTON_TEXT}
          </Button>
        ) : null
      }
      {
        isReservationsNeeded && hasPlayerJoined
          ? (
            <Text size="xs" mt={3}>
              {`Gas reserved ${gasReservedTimes} time(s)`}
            </Text>
          )
          : null
      }
      {isUserHasPermissionToCancel ? (
        <Button className={"cancel_button"} onClick={handleCancel}>
          Cancel
        </Button>
      ) : null}
    </>
  );
};

const useGasReserved = ({
  onGasReserved,
}: {
  onGasReserved?: (times: number) => void;
}) => {
  const [gasReservedTimes, setGasReservedTimes] = React.useState(0);
  const onGasReservedRef = React.useRef(onGasReserved);
  onGasReservedRef.current = onGasReserved;
  const handleGasReserved = useCallback(() => {
    setGasReservedTimes((t) => {
      onGasReserved?.(t + 1);
      return t + 1;
    });
  }, [onGasReserved]);

  return {
    gasReservedTimes,
    handleGasReserved,
  };
};
