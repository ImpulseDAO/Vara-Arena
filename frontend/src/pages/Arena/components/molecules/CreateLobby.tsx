import { Select, Stack, Text } from "@mantine/core";
import { Panel } from "components/Panel";
import { FC, memo, useRef } from "react";
import { SwordsImage, TitleText } from "../atoms";
import { TheButton } from "components/TheButton";
import { useCreateLobby, useLobbies } from "app/api/lobbies";
import { useNavigate } from "react-router-dom";
import { routes } from "app/routes";
import { useAlert } from "@gear-js/react-hooks";
import { useMyCharacterFromContractState } from "app/api/mintState";

export const CreateLobby: FC = memo(() => {
  const alert = useAlert();
  const selectRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { data: myCharacterFromState } = useMyCharacterFromContractState();
  const { refetch: refetchLobbies } = useLobbies();
  const handleCreateLobby = useCreateLobby();

  if (!myCharacterFromState) {
    return (
      <Panel h={370} bg="black">
        <Stack align="center" justify="center" h="100%" gap={0}>
          <Text
            size="md"
            display={"flex"}
            ta="center"
            style={{ alignItems: "center" }}
            h={"100%"}
          >
            You don't have a character yet, create a character to play{" "}
          </Text>
          <TheButton
            w={"100%"}
            onClick={() => {
              navigate(routes.selectClass);
            }}
          >
            Create a character
          </TheButton>
        </Stack>
      </Panel>
    );
  }

  return (
    <Panel h={370} bg="black">
      <Stack align="center" h="100%" gap={0}>
        <SwordsImage />

        <TitleText>Create a lobby</TitleText>

        <Stack w="100%" mt="auto">
          <Select
            ref={selectRef}
            label="Choose number of players"
            styles={{
              input: {
                height: 44,
                fontSize: 16,
              },
              option: {
                color: "black",
                fontSize: 14,
              },
              section: { pointerEvents: "none" },
            }}
            labelProps={{
              c: "white",
              fz: "sm",
              pb: 4,
            }}
            data={[
              // can be only of type LobbyCapacity
              { value: "2", label: "2" },
              { value: "4", label: "4" },
            ]}
            defaultValue="4"
            rightSection={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            leftSection={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M16.6668 17.5V15.8333C16.6668 14.9493 16.3156 14.1014 15.6905 13.4763C15.0654 12.8512 14.2176 12.5 13.3335 12.5H6.66683C5.78277 12.5 4.93493 12.8512 4.30981 13.4763C3.68469 14.1014 3.3335 14.9493 3.3335 15.8333V17.5M13.3335 5.83333C13.3335 7.67428 11.8411 9.16667 10.0002 9.16667C8.15921 9.16667 6.66683 7.67428 6.66683 5.83333C6.66683 3.99238 8.15921 2.5 10.0002 2.5C11.8411 2.5 13.3335 3.99238 13.3335 5.83333Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <TheButton
            onClick={async () => {
              const capacity = parseInt(selectRef.current?.value ?? "");

              if (capacity !== 2 && capacity !== 4 && capacity !== 8) {
                alert.error("Invalid capacity");
                return;
              }

              handleCreateLobby({ capacity })
                .then(async (reply) => {
                  if (reply) {
                    const { lobbyId } = reply.LobbyCreated;
                    setTimeout(() => navigate(routes.lobby(lobbyId)), 800);
                  }
                  /**
                   * Refetch lobbies after successful promise resolution
                   */
                  await refetchLobbies();
                })
                .catch((error) => {
                  console.log("Lobby creation cancelled");
                });
            }}
          >
            Create
          </TheButton>
        </Stack>
      </Stack>
    </Panel>
  );
});
