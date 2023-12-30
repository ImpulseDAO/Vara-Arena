import { useMemo } from "react";
import "./styles.scss";
import ProgressIcon from "../../assets/svg/progress.svg";

import { useParams } from "react-router-dom";
import { ButtonJoinReservePlay } from "./components/ButtonJoinReservePlay";
import { useLobby } from "app/api/lobbies";
import { GasReserved } from "components/GasReserved/GasReserved";
import { Badge } from "@mantine/core";
import { useMyAccountId } from "hooks/hooks";
import { PlayersTable } from "./components/PlayersTable";

export const Lobby = () => {
  const myId = useMyAccountId();

  const { lobbyId } = useParams<{ lobbyId: string; }>();

  const { data: lobbyData, refetch: refetchLobbyQuery } = useLobby({ id: lobbyId ?? '' });
  const players = lobbyData?.lobbyById?.characters;

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
        level: character.character.attributes.level ?? 0,
      });
    }) ?? [];

    return {
      characters,
      hasPlayerJoined,
    };
  }, [myId, players]);

  const playersJoined = characters.length,
    playersSize = 4; // FIXME

  const gasNeeded = 2, // FIXME
    gasReserved = 1; // FIXME

  return (
    <div className="content_wrapper">
      <div className="modal_queue">

        <div className="modal_loader">
          <p className="modal_tille">Tournament participants</p>
          <img
            className={"modal_progress"}
            src={ProgressIcon}
            alt="ProgressIcon"
          />
          <p className="modal_info">Waiting players</p>

          <Badge c={'white'} sx={{ textTransform: 'none' }} mb="lg">
            {playersJoined} of {playersSize} players
          </Badge>

          <GasReserved
            mt="auto"
            mb="xs"
            {...{
              gasNeeded,
              gasReserved
            }} />
        </div>

        <div className="modal_table">
          <PlayersTable {...{ characters, hasPlayerJoined }} />
        </div>

        {
          players != null
            ? <ButtonJoinReservePlay {...{
              hasPlayerJoined, players, lobbyId,
              refreshState: () => {
                console.log('refreshState');
                refetchLobbyQuery();
              }
            }} />
            : null
        }

      </div>
    </div>
  );
};
