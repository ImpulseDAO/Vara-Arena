import { Box, Stack, Text } from "@mantine/core";
import { GasReserved } from "components/GasReserved/GasReserved";
import { Panel } from "components/Panel";
import { TheButton } from "components/TheButton";
import { ReactElement } from "react";

export const Card = ({
  isFinished,
  tierTextComponent,
  lobbyId,
  gasNeeded,
  gasReserved,
  onJoin,
  isHighlighted,
  playersBadge,
  imageComponent,
}: {
  imageComponent: () => ReactElement;
  isFinished?: boolean;
  tierTextComponent: () => ReactElement;
  lobbyId: string;
  gasNeeded: number;
  gasReserved: number;
  onJoin: () => void;
  isHighlighted: boolean;
  playersBadge?: React.ReactNode;
}) => {
  return (
    <Panel
      h={370}
      pos="relative"
      style={{
        boxShadow: isHighlighted
          ? `0px 0px 8px 5px var(--mantine-color-green-7)`
          : "none",
      }}
    >
      {/* Lobby ID - absolutely positioned*/}
      <Box pos="absolute" top={10} right={10}>
        <Text
          fz={12}
          fw="600"
          color="white"
          bg={"rgba(0, 0, 0, 0.4)"}
          py={4}
          px={8}
          style={{
            borderRadius: 9999,
          }}
        >
          Lobby ID #{lobbyId}
        </Text>
      </Box>

      {/* Centered Content */}
      <Stack align="center" h="100%" gap={0}>
        {imageComponent()}
        {tierTextComponent()}

        {playersBadge}

        <Box mt="auto" mb="lg">
          {isFinished ? (
            <Text c="red" fw={600}>
              Lobby ended
            </Text>
          ) : gasNeeded > 0 ? (
            <GasReserved {...{ gasNeeded, gasReserved }} />
          ) : null}
        </Box>

        <TheButton
          onClick={() => {
            setTimeout(onJoin, 200);
          }}
          w="100%"
        >
          Open the Lobby
        </TheButton>
      </Stack>
    </Panel>
  );
};
