import React, { useMemo } from "react";
import "./styles.scss";
import ProgressIcon from "../../assets/svg/progress.svg";

import { useNavigate, useParams } from "react-router-dom";
import { ButtonsJoinReservePlay } from "./components/ButtonJoinReservePlay";
import { useLobby } from "app/api/lobbies";
import { GasReserved } from "components/GasReserved/GasReserved";
import { Badge, Box, Stack, Text } from "@mantine/core";
import { useMyAccountId } from "hooks/hooks";
import { PlayersTable } from "./components/PlayersTable";
import { PLAYERS_TO_RESERVATIONS_NEEDED_MAP } from "consts";
import { TheButton } from "components/TheButton";
import { newRoutes } from "app/routes";

export const Lobby = () => {
  const navigate = useNavigate();
  const myId = useMyAccountId();

  const { lobbyId } = useParams<{ lobbyId: string; }>();
  const { data: lobbyData, refetch: refetchLobbyQuery } = useLobby({ id: lobbyId ?? '' });

  const lobbyInfo = lobbyData?.lobbyById;
  const players = lobbyInfo?.characters;
  const isFinished = lobbyInfo?.battleLogs?.length !== 0;
  const gasReservedTimes = lobbyInfo?.reservationsCount ?? 0;

  const { characters, hasPlayerJoined } = useMemo(() => {
    if (!players) {
      return {
        characters: [],
        hasPlayerJoined: false,
      };
    }

    let hasPlayerJoined = false;

    const characters = players.map((character) => {
      const isMyCharacter = character.character.owner === myId;
      // set isPlayerJoined to "true" if current player has joined
      hasPlayerJoined = hasPlayerJoined || isMyCharacter;

      return ({
        isMyCharacter,
        playerId: character.id,
        id: character.character.id,
        name: character.character.name,
        level: character.character.level ?? 0,
      });
    }) ?? [];

    return {
      characters,
      hasPlayerJoined,
    };
  }, [myId, players]);

  const playersJoined = characters.length,
    playersSize = lobbyInfo?.capacity;
  const isEnoughPlayers = playersJoined === (playersSize ?? 0);

  const gasNeeded = PLAYERS_TO_RESERVATIONS_NEEDED_MAP[playersSize ?? 0] ?? 0;

  const tier = String(lobbyInfo?.['tier']);
  const tierText = `Tier ${tier}`;

  return (
    <div className="content_wrapper">
      <div className="modal_queue">

        <div className="modal_loader">
          <p className="modal_tille">Tournament participants</p>
          <Stack align="center" pos="relative" w="100%">
            <AbsolutelyPositionedElements lobbyId={lobbyId} tierText={tierText} />
            {
              isEnoughPlayers
                ? isFinished
                  ? <Text className="modal_info" color="red" >Lobby ended</Text>
                  : <p className="modal_info">Ready to start</p>
                : <>
                  <img
                    className={"modal_progress"}
                    src={ProgressIcon}
                    alt="ProgressIcon"
                  />
                  <p className="modal_info">Waiting players</p>
                </>
            }
          </Stack>

          <Badge c={'white'} style={{ textTransform: 'none' }} mb="lg">
            {playersJoined} of {playersSize} players
          </Badge>

          {
            /**
             * Show "Gas reserved" widget only if gasNeeded is not 0
             */
            gasNeeded !== 0
              ? (<GasReserved
                mt="auto"
                mb="xs"
                {...{
                  gasNeeded,
                  gasReserved: gasReservedTimes
                }} />)
              : null
          }
        </div>

        <div className="modal_table">
          <PlayersTable {...{ characters, hasPlayerJoined }} />
        </div>

        {
          players != null && !isFinished
            ? (
              <ButtonsJoinReservePlay
                {...{
                  hasPlayerJoined,
                  players,
                  playersNeeded: playersSize ?? 0,
                  gasReservedTimes,
                  lobbyId,
                  refreshState: () => {
                    console.log('refreshState');
                    refetchLobbyQuery();
                  },
                  onGasReserved: (times: number) => { },
                  onStartButtonSucess: () => {
                    setTimeout(() => {
                      refetchLobbyQuery();
                      navigate(newRoutes.tournamentResult({ lobbyId: lobbyId ?? '' }));
                    }, 3000);
                  },
                }}
              />
            )
            : null
        }

        {
          isFinished
            ? (
              <TheButton
                mt="lg"
                w={200}
                onClick={() => lobbyId && navigate(newRoutes.tournamentResult({ lobbyId }))}
              >
                See results
              </TheButton>
            )
            : null
        }

      </div>
    </div>
  );
};

/**
 * Absolutely positioned elements
 */

const AbsolutelyPositionedElements = ({
  lobbyId,
  tierText,
}: {
  lobbyId?: string,
  tierText?: string,
}) => {
  const FROM_TOP = 10;
  const FROM_SIDE = 15;
  return (
    <>
      <Box pos="absolute"
        top={FROM_TOP}
        right={FROM_SIDE}
      >
        <Text fz={12} fw="600" color="white" bg={"rgba(0, 0, 0, 0.4)"}
          py={4}
          px={8}
          style={{
            borderRadius: 9999,
          }}
        >Lobby ID #{lobbyId}</Text>
      </Box>

      {!!tierText && tierText !== '' ? <Box pos="absolute"
        top={FROM_TOP}
        left={FROM_SIDE}
      >
        <Text fz={12} fw="600" color="white" bg={"rgba(0, 0, 0, 0.4)"}
          py={4}
          px={8}
          style={{
            borderRadius: 9999,
          }}
        >{tierText}</Text>
      </Box> : null}
    </>
  );
};
