import { useEffect, useState } from "react";
import "./styles.scss";
import { StatBar } from "components/StatBar";
//
import LockSvg from "../../assets/svg/lock.svg";
import CharSvg from "../../assets/svg/char.svg";
import AvatarIcon from "../../assets/images/AvatarV2.png";
import GoldCoin from "../../assets/images/goldCoin.png";
//
import { useStats } from "./hooks/useStats";
import { Alert } from "components/Alert/Alert";
import { useCharacterById, useMyCharacter } from "app/api/characters";
import { getShortIdString } from "utils";
import { useParams } from "react-router-dom";
import { getCodeIdsFromLocalStorage } from "hooks/useUploadCode";
import { StrategyInput } from "pages/MintCharacter/components/StrategyInput";
import { Divider, Flex, FlexProps, Image, Text } from "@mantine/core";
import { getFullEnergy, getFullHp } from "consts";
import { SchoolOfMagic } from "components/SchoolOfMagic";

export const MyProfile = () => {
  const { data: myCharacter } = useMyCharacter();
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
          <div className="profile_user">
            <img className={`profile_avatar ${isMyCharacter ? 'my_avatar' : ''}`} src={AvatarIcon} alt="AvatarIcon" />
            <div className="profile_name">
              <p>{character?.name}</p>
              <p>{getShortIdString(character.id)}</p>

              <LevelBar maxXp={stats.maxExp} curXp={stats.experience} level={stats.level} />
            </div>
          </div>

          <StrategyInput
            codeId={codeId}
            setCodeId={setCodeId}
            onUploadCodeChange={onUploadCodeChange}
          />

          <div className="profile_stats">
            <Divider mt="sm" />
            <Attribute attributeName="Rating" value={character.tier_rating ?? 0} my="lg" />
            <Divider mb="xs" />
            <Attribute attributeName="Strength" value={character.attributes.strength} my="sm" />
            <Attribute attributeName="Agility" value={character.attributes.agility} my="sm" />
            <Attribute attributeName="Vitality" value={character.attributes.vitality} my="sm" />
            <Attribute attributeName="Stamina" value={character.attributes.stamina} my="sm" />
            <Attribute attributeName="Intelligence" value={character.attributes.intelligence} my="sm" />
          </div>
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

const LevelBar = ({
  maxXp,
  curXp,
  level,
}: { maxXp: number; curXp: number; level: number; }) => {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    setTimeout(() => setPercent((curXp / maxXp) * 100), 300);
  });

  return (
    <div className="level_bar_wrapper">
      <span className="level_bar_text">Level</span>

      <div className="level_bar">
        <div className="level_bar_progress" style={{ maxWidth: `${percent}%` }} />
      </div>

      <span className="level_bar_level">{level}</span>
    </div>
  );
};

const Attribute = ({ attributeName, value, ...flexProps }: { attributeName: string; value: number; } & FlexProps) => {
  return (
    <Flex justify={'space-between'} {...flexProps}>
      <Text>{attributeName}</Text>
      <Text fw="600">{value}</Text>
    </Flex>
  );
};
