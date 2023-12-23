import "../styles.scss";

import React, { useMemo } from "react";
import { useSendMessage } from "@gear-js/react-hooks";
import { ProgramMetadata } from "@gear-js/api";
import { ARENA_ID, METADATA } from "pages/StartFight/constants";
import { useNavigate } from "react-router-dom";
import { Button, Text } from "@mantine/core";

// type States = "initial" | "reserved_once" | "reserved_twice" | "starting";

export const PlayAndCancelButtons = ({
  isPlayDisabled = false,
  isDoubleReservationNeeded = false,
}: {
  isPlayDisabled?: boolean;
  isDoubleReservationNeeded?: boolean;
}) => {
  const navigate = useNavigate();
  const meta = useMemo(() => ProgramMetadata.from(METADATA), []);
  const send = useSendMessage(ARENA_ID, meta, { isMaxGasLimit: true });

  const isUserHasPermissionToCancel = false;

  const [gasReservedTimes, setGasReservedTimes] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const btnText = (() => {
    if (gasReservedTimes === 0) return "Reserve Gas";
    if (gasReservedTimes === 1) {
      if (isDoubleReservationNeeded) return "Reserve Gas";
      return "Start Battle";
    }

    if (gasReservedTimes === 2) return "Start Battle";
  })();

  const reserveGas = React.useCallback(() => {
    return new Promise((resolve) => {
      send({
        payload: { ReserveGas: null },
        gasLimit: Infinity,
        onSuccess: () => {
          console.log("successfully reserved gas");
          resolve("successfully reserved gas");
          setGasReservedTimes((t) => t + 1);
        },
        onError: () => console.log("error while reserving gas"),
      });
    });
  }, [send]);

  const startBattle = React.useCallback(() => {
    return new Promise((resolve) => {
      send(
        {
          payload: {
            Play: null,
          },
          gasLimit: Infinity,
          onSuccess: () => {
            localStorage.setItem("players", JSON.stringify([]));
            console.log("successfully started the battle");
          },
          onError: () => console.log("error while starting the battle"),
        }
      );
    });
  }, [send]);

  const handleStart = async () => {
    setIsLoading(true);

    if (gasReservedTimes === 0) {
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

  const handleCancel = () => {
    send(

      {
        payload: {
          CleanState: null,
        },
        gasLimit: Infinity,
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
        onClick={handleStart}
        disabled={isPlayDisabled}
        loading={isLoading}
      >
        {btnText}
      </Button>
      <Text size="xs" mt={3}>
        {`Gas reserved ${gasReservedTimes} time(s)`}
      </Text>
      {isUserHasPermissionToCancel ? (
        <Button className={"cancel_button"} onClick={handleCancel}>
          Cancel
        </Button>
      ) : null}
    </>
  );
};
