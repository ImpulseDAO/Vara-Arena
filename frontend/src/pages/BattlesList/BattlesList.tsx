import { Title, Box, BackgroundImage, Flex, Grid, Image, Select, Stack, Badge, TitleProps, Text, FlexProps } from "@mantine/core";
import ArenaPng from "assets/images/arena.png";
import StartFightPng from "assets/images/startFightScreen.png";
import { TheButton } from "components/new/TheButton";
import { Panel } from "components/new/Panel";;

const cards = [
  {
    tier: 1,
    battleId: "#55465",
    playersSize: 4,
    playersJoined: 2,
    gasNeeded: 2,
    gasReserved: 1
  },
  {
    tier: 2,
    battleId: "#55466",
    playersSize: 2,
    playersJoined: 2,
    gasNeeded: 2,
    gasReserved: 2
  },
];

export const BattlesList = () => {
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
                <TheButton onClick={() => null}  >
                  Create
                </TheButton>
              </Stack>
            </Stack>
          </Panel>
        </GridColumn>

        {cards.map((card, index) => (
          <GridColumn key={`${index} - ${card.battleId}`}>
            <Card
              tier={card.tier}
              battleId={card.battleId}
              playersSize={card.playersSize}
              playersJoined={card.playersJoined}
              gasNeeded={card.gasNeeded}
              gasReserved={card.gasReserved}
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

const GasPoint = ({ filled }: { filled?: boolean; }) => {
  return <Box bg={filled ? 'primary' : 'white'} w={20} h={8} sx={{
    borderRadius: 4,
  }} />;
};

const GasReserved = ({
  gasNeeded,
  gasReserved,
  ...flexProps
}: {
  gasNeeded: number,
  gasReserved: number,
} & FlexProps) => {
  return (
    <Flex align={"center"} gap="xs" {...flexProps}>
      <Flex gap={2.75}>
        {
          Array.from({ length: gasNeeded }).map((_, index) => (
            <GasPoint filled={index < gasReserved} key={index} />
          ))
        }
      </Flex>

      <Text c="white" fw={600}>Gas Reserved</Text>
    </Flex >
  );
};

const Card = ({
  tier,
  battleId,
  playersSize,
  playersJoined,
  gasNeeded,
  gasReserved
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
        >Battle ID {battleId}</Text>
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

        <TheButton onClick={() => null} w="100%" >
          Join the Lobby
        </TheButton>

      </Stack>

    </Panel>
  );
};
