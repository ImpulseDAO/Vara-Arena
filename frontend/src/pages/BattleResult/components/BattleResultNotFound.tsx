import { Stack } from "@mantine/core";
import { newRoutes } from "app/routes";
import { Panel } from "components/Panel";
import { TheButton } from "components/TheButton";
import { useNavigate } from "react-router-dom";

export const BattleResultNotFound = () => {
  const navigate = useNavigate();
  return (
    <Panel my="auto">
      <Stack>
        Battle ID not provided

        <TheButton onClick={() => navigate(newRoutes.arena)} >
          Go to arena
        </TheButton>
      </Stack>
    </Panel >
  );
};
