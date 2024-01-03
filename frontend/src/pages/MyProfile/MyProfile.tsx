import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//
import "./styles.scss";
//
import LockSvg from "../../assets/svg/lock.svg";
import CharSvg from "../../assets/svg/char.svg";
import GoldCoin from "../../assets/images/goldCoin.png";
//
import { getShortIdString } from "utils";
import { getFullEnergy, getFullHp } from "consts";
import { useStats } from "./hooks/useStats";
import { useCharacterById, useMyCharacter } from "app/api/characters";
//
import { Flex, Image, Text } from "@mantine/core";
//
import { Alert } from "components/Alert/Alert";
import { StatBar } from "pages/@shared/StatBar";
import { CharInfo } from "pages/@shared/CharInfo";
import { CharStats } from "pages/@shared/CharStats/CharStats";
import { StrategyInput } from "components/StrategyInput";
import { getCodeIdsFromLocalStorage } from "hooks/useUploadCode";
import { SchoolOfMagic } from "components/SchoolOfMagic";
import { NoCharacterWidget } from "pages/@shared/NoCharacterWidget";


export const MyProfile = () => {
  const { data: myCharacter } = useMyCharacter();

  if (!myCharacter) {
    return <NoCharacterWidget />;
  }

  return <Profile character={myCharacter} />;
};

export const ProfilePage = () => {
  const params = useParams();

  if (!params.id) {
    throw new Error("No id provided");
  }

  const { data: character } = useCharacterById({ id: params.id });

  if (!character) {
    return null;
  }

  return <Profile character={character} />;

};

export const Profile = ({
  character
}: {
  character: Character;
}) => {
  const { data: myCharacter } = useMyCharacter();
  const { accept, alertVisible, cancel, selectAttr, stats } = useStats(
    character
  );

  /**
   * Upload code 
   */

  const [data, setData] = useState({
    codeId: getCodeIdsFromLocalStorage()[0] ?? "",
    name: "",
  });

  const codeId = data.codeId;
  const setCodeId = (codeId) => setData({ ...data, codeId });
  const onUploadCodeChange = (codeId) => setData({ ...data, codeId });

  /**
   * 
   */

  if (!myCharacter) {
    return null;
  }

  const isMyCharacter = character.id === myCharacter.id;

  return (
    <div className="profile">
      {alertVisible && (
        <Alert
          title="Confirm changes?"
          buttonsSlot={[
            {
              className: "profile_alert_cancel",
              children: "Cancel",
              onClick: cancel,
            },
            {
              className: "profile_alert_accept",
              children: "Accept",
              onClick: accept,
            },
          ]}
        />
      )}
      <div className="profile_char">
        <div className="profile_data">

          <CharInfo
            isMyCharacter={isMyCharacter}
            name={character.name}
            shortId={getShortIdString(character.id)}
            //
            exp={stats.experience}
            maxExp={stats.maxExp}
            level={stats.level}
          />

          <StrategyInput
            codeId={codeId}
            setCodeId={setCodeId}
            onUploadCodeChange={onUploadCodeChange}
          />

          <CharStats character={character} />

        </div>

        <div className="profile_equip">
          <StatBar
            lives={character.lives_count ?? 5}
            health={getFullHp(character.attributes.vitality)}
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
            <div className="one_half school_of_magic">
              <p>School of magic:</p>
              <SchoolOfMagic className="bottom_part" type={character.magicElement} size={48} />
            </div>
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
