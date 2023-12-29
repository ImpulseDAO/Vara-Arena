import { Title, Box, BackgroundImage, Grid, Image, Select, Stack, Badge, TitleProps, Text } from "@mantine/core";
import ArenaPng from "assets/images/arena.png";
import StartFightPng from "assets/images/startFightScreen.png";
import { TheButton } from "components/new/TheButton";
import { Panel } from "components/new/Panel";
import { useCreateLobby, useLobbies } from "app/api/lobbies";
import { useNavigate } from "react-router-dom";
import { newRoutes } from "app/routes";
import { useMemo, useRef } from "react";
import { GasReserved } from "components/GasReserved/GasReserved";

export const BattlesList = () => {
  const navigate = useNavigate();
  const selectRef = useRef<HTMLInputElement | null>(null);

  const { data: lobbiesData } = useLobbies();

  const cards = useMemo(() => {
    if (!lobbiesData) return [];

    return lobbiesData?.lobbies.map(lobby => {
      return {
        tier: 'tier' in lobby ? lobby.tier as string : 'UNSET',
        lobbyId: lobby.id,
        playersSize: "HARDCODED",
        playersJoined: lobby.characters.length,
        gasNeeded: 0,
        gasReserved: 0
      };
    });
  }, [lobbiesData]);

  /**
   * Get handleJoinLobby
   */
  const handleJoinLobby = ({ lobbyId }: {
    lobbyId: string;
  }) => {
    console.log('handleJoinLobby', lobbyId);

    navigate(newRoutes.lobby(lobbyId));
  };

  /**
   * 
   */

  const handleCreateLobby = useCreateLobby();

  return (
    <BackgroundImage
      src={StartFightPng}
      pb={100}
    >
      <Grid m={'lg'} gutter={'md'}
        mx="auto"
        sx={{
          maxWidth: "min(1300px, 90%)"
        }}
      >
        <GridColumn >
          <Panel
            h={370}
            bg="black"
          >
            <Stack align="center" h="100%" spacing={0}>
              <Swords />

              <TitleText>Create a lobby</TitleText>

              <Stack w="100%" mt="auto" >
                <Select
                  ref={selectRef}
                  label="Choose number of players"
                  styles={{
                    input: {
                      height: 44,
                      fontSize: 16
                    },
                    rightSection: { pointerEvents: 'none' }
                  }}
                  labelProps={{
                    c: 'white',
                    fz: "sm",
                    pb: 4
                  }}
                  data={[
                    { value: '2', label: '2', },
                    { value: '4', label: '4' },
                    { value: '8', label: '8' },
                  ]}
                  defaultValue="4"
                  rightSection={
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.6668 17.5V15.8333C16.6668 14.9493 16.3156 14.1014 15.6905 13.4763C15.0654 12.8512 14.2176 12.5 13.3335 12.5H6.66683C5.78277 12.5 4.93493 12.8512 4.30981 13.4763C3.68469 14.1014 3.3335 14.9493 3.3335 15.8333V17.5M13.3335 5.83333C13.3335 7.67428 11.8411 9.16667 10.0002 9.16667C8.15921 9.16667 6.66683 7.67428 6.66683 5.83333C6.66683 3.99238 8.15921 2.5 10.0002 2.5C11.8411 2.5 13.3335 3.99238 13.3335 5.83333Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                />
                <TheButton onClick={() => {
                  const capacity = parseInt(selectRef.current?.value ?? '');

                  if (isNaN(capacity)) return;

                  handleCreateLobby({ capacity });
                }}  >
                  Create
                </TheButton>
              </Stack>
            </Stack>
          </Panel>
        </GridColumn>

        {cards.map((card, index) => (
          <GridColumn key={`${index} - ${card.lobbyId}`}>
            <Card
              tier={card.tier}
              lobbyId={card.lobbyId}
              playersSize={card.playersSize}
              playersJoined={card.playersJoined}
              gasNeeded={card.gasNeeded}
              gasReserved={card.gasReserved}
              onJoin={() => {
                console.log('onJoin');
                handleJoinLobby({ lobbyId: card.lobbyId });
              }}
            />
          </GridColumn>
        ))}
      </Grid>
    </BackgroundImage >
  );
};

const Swords = () => <Image maw={105} src={ArenaPng} mb={14} />;
const TitleText = ({ children, ...titleProps }: TitleProps) => <Title order={2} c={'white'} {...titleProps} >{children}</Title>;

const GridColumn = ({ children }) => {
  return (
    <Grid.Col xs={12} sm={6} md={4}>
      {children}
    </Grid.Col>
  );
};

const Card = ({
  tier,
  lobbyId,
  playersSize,
  playersJoined,
  gasNeeded,
  gasReserved,
  onJoin
}: {
  tier: string,
  lobbyId: string,
  playersSize: number | string,
  playersJoined: number,
  gasNeeded: number,
  gasReserved: number,
  onJoin: () => void,
}) => {
  return (
    <Panel h={370} pos="relative" >
      {/* Battle ID - absolutely positioned*/}
      <Box pos="absolute"
        top={10}
        right={10}
      >
        <Text fz={12} fw="600" color="white" bg={"rgba(0, 0, 0, 0.4)"}
          py={4}
          px={8}
          sx={{
            borderRadius: 9999,
          }}
        >Battle ID #{lobbyId}</Text>
      </Box>

      {/* Centered Content */}
      <Stack align="center" h="100%" spacing={0}>
        <Swords />

        <TitleText mb="sm">Tier {tier}</TitleText>

        <Badge c={'white'} sx={{ textTransform: 'none' }}>
          {playersJoined} of {playersSize} players
        </Badge>

        <GasReserved
          mt="auto"
          mb="lg"
          {...{
            gasNeeded,
            gasReserved
          }} />

        <TheButton onClick={() => {
          setTimeout(onJoin, 200);
        }} w="100%" >
          Join the Lobby
        </TheButton>

      </Stack>

    </Panel>
  );
};
