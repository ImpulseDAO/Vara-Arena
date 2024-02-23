import { useLobbies } from "app/api/lobbies";
import { useMyAccountId } from "hooks/hooks";
import { memo, FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "app/routes";
import { PLAYERS_TO_RESERVATIONS_NEEDED_MAP } from "consts";
import { getCharacter } from "../../getCharacters.utls";
import { Card, GridColumn, SwordsImage, TitleText } from "../atoms";
import { HoverCard, Badge } from "@mantine/core";
import { PlayersTable } from "pages/@shared/PlayersTable";
import { getTier } from "pages/@shared/lib";
import { useMyCharacterFromContractState } from "app/api/mintState";

type LobbyListProps = {
  filters: string[];
  availableCheck: boolean;
  allOpenLobby: boolean;
};

export const LobbyList: FC<LobbyListProps> = memo(
  ({ filters, availableCheck, allOpenLobby }) => {
    const myAccountId = useMyAccountId();
    const navigate = useNavigate();
    const { data: myCharacterFromState } = useMyCharacterFromContractState();
    const { data: lobbiesData } = useLobbies();

    /**
     * Get handleJoinLobby
     */
    const handleJoinLobby = ({ lobbyId }: { lobbyId: string }) => {
      console.log("handleJoinLobby", lobbyId);

      navigate(routes.lobby(lobbyId));
    };

    const cards = useMemo(() => {
      if (!lobbiesData || !lobbiesData?.lobbies) return [];
      let lobbies = [...lobbiesData.lobbies];

      if (availableCheck) {
        if (!myCharacterFromState?.level) {
          return [];
        }
        lobbies = lobbies.filter(
          (lobby) => lobby.tier === getTier(myCharacterFromState.level)
        );
      }
      if (allOpenLobby) {
        lobbies = lobbies.filter((lobby) => lobby.battleLogs.length === 0);
      }

      return lobbies
        .sort((a, b) => parseInt(b.id) - parseInt(a.id))
        .filter(
          (lobby) => "tier" in lobby && filters.includes(`Tier ${lobby.tier}`)
        )
        .map((lobby) => {
          const isMyCharacterInLobby = lobby.characters.some(
            (character) => character.character.owner === myAccountId
          );

          return {
            tierText: "tier" in lobby ? `Tier ${lobby.tier}` : "",
            lobbyId: lobby.id,
            players: lobby.characters.map((character) => character.character),
            playersSize: lobby.capacity,
            playersJoined: lobby.characters.length,
            gasNeeded: PLAYERS_TO_RESERVATIONS_NEEDED_MAP[lobby.capacity],
            gasReserved: lobby.reservationsCount,
            isFinished: lobby.battleLogs.length > 0,
            isMyCharacterInLobby,
          };
        });
    }, [
      lobbiesData,
      myAccountId,
      filters,
      availableCheck,
      myCharacterFromState,
      allOpenLobby,
    ]);

    return cards.map((card, index) => {
      const characters =
        card.players.map((character) => {
          const isMyCharacter = character.owner === myAccountId;

          return getCharacter({ character, isMyCharacter });
        }) ?? [];

      return (
        <GridColumn key={`${index} - ${card.lobbyId}`}>
          <Card
            imageComponent={() => <SwordsImage />}
            isFinished={card.isFinished}
            tierTextComponent={() => (
              <TitleText mb="sm">{card.tierText}</TitleText>
            )}
            lobbyId={card.lobbyId}
            gasNeeded={card.gasNeeded}
            gasReserved={card.gasReserved}
            onJoin={() => handleJoinLobby({ lobbyId: card.lobbyId })}
            playersBadge={
              <HoverCard
                position="top"
                transitionProps={{
                  duration: 250,
                  transition: "fade",
                }}
                styles={{
                  dropdown: {
                    padding: 0,
                    backgroundColor: "transparent",
                    border: "none",
                    borderTop: "2px solid white",
                    transformOrigin: "bottom center",
                    transform: "scale(0.73)",
                  },
                }}
                radius={0}
              >
                <HoverCard.Target>
                  <Badge
                    c={"white"}
                    style={{ textTransform: "none", cursor: "pointer" }}
                    color={card.isMyCharacterInLobby ? "green.7" : "primary"}
                  >
                    {card.playersJoined} of {card.playersSize} players
                  </Badge>
                </HoverCard.Target>
                <HoverCard.Dropdown bg="rgb(0,0,0,.6)">
                  <PlayersTable characters={characters} />
                </HoverCard.Dropdown>
              </HoverCard>
            }
            isHighlighted={card.isMyCharacterInLobby}
          />
        </GridColumn>
      );
    });
  }
);
