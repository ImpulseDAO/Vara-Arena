import { Stack } from "@mantine/core";
import { getFullHp, getFullEnergy } from "consts";
import { CharInfo } from "pages/@shared/CharInfo";
import { CharStats } from "pages/@shared/CharStats/CharStats";
import { StatBar } from "pages/@shared/StatBar";
import { useRef } from "react";
import { getShortIdString, getXpNeededForLvlUp } from "utils";
import { CharacterState } from "../types";

export const CharPanel = ({ character, charState }: { character: any; charState?: CharacterState; }) => {

  const health = Math.ceil(charState?.hp ?? 0);
  const healthMax = getFullHp(character.attributes.vitality);
  const energy = Math.ceil(charState?.energy ?? 0);
  const energyMax = getFullEnergy(character.attributes.stamina);

  /**
   *  This is done to force rerender the component when the health/energy is full
   */
  const keyRef = useRef(Math.random());
  if (health === healthMax && energy === energyMax) keyRef.current = Math.random();

  return (
    <Stack gap={0} >
      <StatBar
        /**
         * Key is here to force rerender (see above)
         */
        key={keyRef.current}
        health={Math.ceil(charState?.hp ?? 0)}
        healthMax={getFullHp(character.attributes.vitality)}
        energy={Math.ceil(charState?.energy ?? 0)}
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

