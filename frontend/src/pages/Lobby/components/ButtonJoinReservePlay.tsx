import "../styles.scss";

import React, { useCallback, useMemo } from "react";
import { useAlert, useSendMessage } from "@gear-js/react-hooks";
import { ProgramMetadata } from "@gear-js/api";
import { ARENA_PROGRAM_ID, ARENA_METADATA } from "consts";
import { useNavigate } from "react-router-dom";
import { Button, Text } from "@mantine/core";
import { MAX_GAS_LIMIT } from "consts";
import { useOnRegisterForBattle } from "pages/StartFight/hooks/useOnSubmit";

// type States = "initial" | "reserved_once" | "reserved_twice" | "starting";

const JOIN_BUTTON_TEXT = "Join the battle";
const RESERVE_BUTTON_TEXT = "Reserve gas";
const PLAY_BUTTON_TEXT = "Start battle";

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
  onGasReserved?: (times: number) => void;
  onStartButtonSucess?: () => void;
}) => {
  const alert = useAlert();
  const navigate = useNavigate();
  const meta = useMemo(() => ProgramMetadata.from(ARENA_METADATA), []);
  const send = useSendMessage(ARENA_PROGRAM_ID, meta, { isMaxGasLimit: true });

  const isUserHasPermissionToCancel = false;

  const {
    gasReservedTimes,
    handleGasReserved,
  } = useGasReserved({ onGasReserved });

  const [isLoading, setIsLoading] = React.useState(false);

  const isDoubleReservationNeeded = playersNeeded > 2;

  const btnText = (() => {
    if (!hasPlayerJoined) return JOIN_BUTTON_TEXT;
    if (gasReservedTimes === 0) return RESERVE_BUTTON_TEXT;
    if (gasReservedTimes === 1) {
      if (isDoubleReservationNeeded) return RESERVE_BUTTON_TEXT;
      return PLAY_BUTTON_TEXT;
    }

    if (gasReservedTimes === 2) return PLAY_BUTTON_TEXT;
  })();

  const isPlayDisabled = hasPlayerJoined && playersNeeded > players.length;

  const reserveGas = React.useCallback(() => {
    return new Promise((resolve) => {
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
        onError: () => console.log("error while reserving gas"),
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


  const handleReserveOrStart = async () => {
    setIsLoading(true);

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
      } finally {
        setIsLoading(false);
      }
      return;
    }

    else if (gasReservedTimes === 0) {
      await reserveGas();
    } else if (gasReservedTimes === 1) {
      if (isDoubleReservationNeeded) {
        await reserveGas();
      } else {
        await startBattle();
      }
    } else if (gasReservedTimes === 2) {
      await startBattle();
    }

    setIsLoading(false);
  };

  const handleOnlyStart = async () => {
    setIsLoading(true);

    if (!hasPlayerJoined) {
      const message = "You are not registered for the battle";
      console.error(message);
      alert.error(message);
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
          console.log("successfully cleaned the state");
          navigate("/arena");
        },
        onError: () => console.log("error while cleaning the state"),
      }
    );
  };

  return (
    <>
      <Button
        className={["action_button", isPlayDisabled && "disabled"]
          .filter(Boolean)
          .join(" ")}
        onClick={handleReserveOrStart}
        disabled={isPlayDisabled}
        loading={isLoading}
      >
        {btnText}
      </Button>
      {/* Only START button */}
      <Button
        className={["action_button"].join(" ")}
        onClick={handleOnlyStart}
        loading={isLoading}
      >
        {'Start battle'}
      </Button>
      {
        hasPlayerJoined
          ? <Text size="xs" mt={3}>
            {`Gas reserved ${gasReservedTimes} time(s)`}
          </Text>
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
