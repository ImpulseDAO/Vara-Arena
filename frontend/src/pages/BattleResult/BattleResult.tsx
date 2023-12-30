import { BackgroundImage, Flex, Stack } from "@mantine/core";
import { useMyCharacter, useMyCharacters } from "app/api/characters";
import BattleBackground from 'assets/images/battle.png';
import { CharInfo } from "pages/@shared/CharInfo";

import { Panel } from 'components/Panel';
import { StatBar } from "pages/@shared/StatBar";
import { useEffect, useState } from "react";
import { getShortIdString, getXpNeededForLvlUp } from "utils";
import { CharStats } from "pages/@shared/CharStats/CharStats";
import { getFullEnergy, getFullHp } from "consts";
import { useMyAccountId } from "hooks/hooks";

const SIDE_PANEL_WIDTH = 375;
const MID_PANEL_WIDTH = 420;

export const BattleResult = () => {
  const accountId = useMyAccountId();
  const { data: myCharacters } = useMyCharacters({ owner_eq: accountId ?? '' });
  const { data: myCharacter } = useMyCharacter();

  const myOldCharacter = myCharacters?.characters[0];

  const [health, setHealth] = useState(100);

  // sset health to 50 after 2 seconds
  useEffect(() => {
    setTimeout(() => setHealth(50), 2000);
  }, []);

  return (
    <BackgroundImage src={BattleBackground} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'start',

      paddingBlock: '2rem'
    }}>
      <Flex gap='md'>
        <Panel w={SIDE_PANEL_WIDTH} >
          <CharPanel character={myCharacter} />
        </Panel>
        <Panel w={MID_PANEL_WIDTH} >something</Panel>
        <Panel w={SIDE_PANEL_WIDTH} >
          <CharPanel character={myOldCharacter} />
        </Panel>
      </Flex>
    </BackgroundImage>
  );
};

const CharPanel = ({ character }: { character: any; }) => {
  return (
    <Stack spacing={0}>
      <StatBar
        health={Math.ceil(getFullHp(character.attributes.vitality) / 2)} // mock
        healthMax={getFullHp(character.attributes.vitality)}
        energy={Math.ceil(getFullEnergy(character.attributes.stamina) / 3 * 2)} // mock
        energyMax={getFullEnergy(character.attributes.stamina)}
      />

      <CharInfo
        mt="lg"

        isMyCharacter={true}
        name={character.name}
        shortId={getShortIdString(character.id)}
        //
        exp={character.experience}
        maxExp={getXpNeededForLvlUp(character.level)}
        level={character.level}
      />

      <CharStats
        style={{
          justifySelf: 'end'
        }}
        character={character}
      />

    </Stack>
  );
};
