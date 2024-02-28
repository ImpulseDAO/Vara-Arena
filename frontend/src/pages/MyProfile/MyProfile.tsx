import { useParams } from "react-router-dom";
//
import "./styles.scss";
//
import LockSvg from "../../assets/svg/lock.svg";
import CharSvg from "../../assets/svg/char.svg";
import GoldCoin from "../../assets/images/goldCoin.png";
//
import { getFullEnergy, getFullHp } from "consts";
import { useStats } from "./hooks/useStats";
import { useCharacterById } from "app/api/characters";
//
import { Flex, Image, Text } from "@mantine/core";
//
import { Alert } from "components/Alert/Alert";
import { StatBar } from "pages/@shared/StatBar";
import { CharInfo } from "pages/@shared/CharInfo";
import { CharStats } from "pages/@shared/CharStats/CharStats";
import { NoCharacterWidget } from "pages/@shared/NoCharacterWidget";
import { UploadStrategyWidget } from "./components/UploadStrategyWidget";
import { useMyCharacterFromContractState } from "app/api/mintState";
import { useMemo } from "react";

export const MyProfile = () => {
  const {
    data: myCharacterFromState,
    refetch: refetchMyCharacterFromStateQuery
  } = useMyCharacterFromContractState();

  if (!myCharacterFromState) {
    return <div className="profile"><NoCharacterWidget /></div>;
  }

  return <Profile character={undefined} myCharacter={myCharacterFromState} onSuccessfulLevelUp={refetchMyCharacterFromStateQuery} />;
};

export const ProfilePage = () => {
  const params = useParams<{
    profileId: string;
  }>();

  if (!params.profileId) {
    throw new Error("No id provided");
  }

  const { data: characterData } = useCharacterById({ id: params.profileId });
  const { data: myCharacterFromState } = useMyCharacterFromContractState();

  const character = characterData?.characterById;

  if (!character || !myCharacterFromState) {
    return null;
  }

  return <Profile character={character} myCharacter={myCharacterFromState} />;

};

export const Profile = ({
  /**
   * Character is the one we are viewing
   * it can be our own character or someone else's
   */
  character,
  myCharacter,
  onSuccessfulLevelUp
}: {
  character?: Character;
  myCharacter: CharacterInContractState;
  onSuccessfulLevelUp?: () => void;
}) => {
  /**
   * myCharacter is our own character
   * we need it to check if we are viewing our own character
   */

  character = useMemo(() => {
    if (character) return character;

    else return {
      id: String(myCharacter.id),
      name: myCharacter.name,
      attributes: myCharacter.attributes,
      level: myCharacter.level,
      experience: myCharacter.experience,
      livesCount: myCharacter.attributes.livesCount,
      balance: myCharacter.attributes.balance,
      owner: '',
      rating: myCharacter.attributes.tierRating,
    };

  }, [character, myCharacter]);
  const isMyCharacter = character?.id === String(myCharacter.id);

  const { accept, alertVisible, cancel, stats, selectAttr, selectedAttr, isStatsMutating } = useStats(
    character
  );

  /**
   * 
   */

  if (!myCharacter) {
    return null;
  }

  return (
    <div className="profile">
      {alertVisible && (
        <Alert
          title={`Please confirm ${selectedAttr} increase`}
          buttonsSlot={[
            {
              className: "profile_alert_cancel",
              children: "Cancel",
              onClick: cancel,
            },
            {
              className: "profile_alert_accept",
              children: "Accept",
              onClick: () => accept({
                onSuccess: onSuccessfulLevelUp,
              }),
            },
          ]}
        />
      )}
      <div className="profile_char">
        <div className="profile_data">

          <CharInfo
            isMyCharacter={isMyCharacter}
            name={character.name}
            idStr={`#${character.id}`}
            //
            exp={character.experience}
            maxExp={stats.maxExp}
            level={character.level}
          />

          <UploadStrategyWidget />

          <CharStats
            character={character}
            /**
             * isReadyForLevelUp is true only if we are viewing our own character
             */
            isReadyForLevelUp={isMyCharacter && stats.points > 0}
            selectAttr={selectAttr}
            isLoading={isStatsMutating}
          />

        </div>

        <div className="profile_equip">
          <StatBar
            lives={character.livesCount}
            health={getFullHp(character.level)}
            energy={getFullEnergy(character.attributes.stamina)}
          />

          <div className={"imgWrapper"}>
            <img className={"lock_img1"} src={LockSvg} alt="LockSvg" />
            <img className={"lock_img2"} src={LockSvg} alt="LockSvg" />
            <img className={"lock_img3"} src={LockSvg} alt="LockSvg" />
            <img className={"lock_img4"} src={LockSvg} alt="LockSvg" />
            <img className={"lock_img5"} src={LockSvg} alt="LockSvg" />
            <img className={"char_svg"} src={CharSvg} alt="CharSvg" />
            <img className={"lock_img6"} src={LockSvg} alt="LockSvg" />
            <img className={"lock_img7"} src={LockSvg} alt="LockSvg" />
            <img className={"lock_img8"} src={LockSvg} alt="LockSvg" />
            <img className={"lock_img9"} src={LockSvg} alt="LockSvg" />
          </div>

          <div className="school_and_gold">
            {/* <div className="one_half school_of_magic">
              <p>School of magic:</p>
              <SchoolOfMagic className="bottom_part" type={character.magicElement} size={48} />
            </div> */}
            <div className="one_half gold">
              <p>Gold:</p>
              <Flex className="bottom_part" gap="md" align="center" style={{ position: 'relative' }} >
                <Image width={40} src={GoldCoin} />
                <Text fw="600" c="white" >{character.balance ?? 0}</Text>
              </Flex>
            </div>
          </div>

        </div>
      </div>
    </div >
  );
};
