import "../styles.scss";
import { Button } from "components/Button";

import { useMemo } from "react";
import { useSendMessage } from "@gear-js/react-hooks";
import { getProgramMetadata } from "@gear-js/api";
import { ARENA_ID, METADATA } from "pages/StartFight/constants";
import { useNavigate } from "react-router-dom";

export const PlayAndCancelButtons = ({
  isPlayDisabled = false,
}: {
  isPlayDisabled?: boolean;
}) => {
  const navigate = useNavigate();
  const meta = useMemo(() => getProgramMetadata(METADATA), []);
  const send = useSendMessage(ARENA_ID, meta);

  const handleStart = () => {
    console.log("Start the battle");
    send(
      {
        ReserveGas: null,
      },
      {
        onSuccess: () => console.log("successfully reserved gas"),
        onError: () => console.log("error while reserving gas"),
      }
    );

    const WAIT_DURATION_MS = 3000;
    setTimeout(() => {
      console.log("Wait for 3 seconds");
      send(
        {
          Play: null,
        },
        {
          onSuccess: () => console.log("successfully started the battle"),
          onError: () => console.log("error while starting the battle"),
        }
      );
    }, WAIT_DURATION_MS);
  };

  const handleCancel = () => {
    send(
      {
        CleanState: null,
      },
      {
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
        className={"start_button"}
        onClick={handleStart}
        disabled={isPlayDisabled}
      >
        Start battle
      </Button>
      <Button className={"cancel_button"} onClick={handleCancel}>
        Cancel
      </Button>
    </>
  );
};
