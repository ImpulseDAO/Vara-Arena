import { Stack } from "@mantine/core";
import { getFullHp, getFullEnergy } from "consts";
import { CharInfo } from "pages/@shared/CharInfo";
import { CharStats } from "pages/@shared/CharStats/CharStats";
import { StatBar } from "pages/@shared/StatBar";
import { useRef } from "react";
import { getShortIdString, getXpNeededForLvlUp } from "utils";
import { CharacterState } from "../types";

export const CharPanel = ({
  character,
  charState,
  initialCharState,
}: {
  character: any;
  charState?: CharacterState;
  initialCharState?: CharacterState;
}) => {

  const health = Math.ceil(charState?.hp ?? 0);
  const healthMax = initialCharState?.hp ?? 0;
  const energy = Math.ceil(charState?.energy ?? 0);
  const energyMax = initialCharState?.energy ?? 0;

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
        health={health}
        healthMax={healthMax}
        energy={energy}
        energyMax={energyMax}
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

