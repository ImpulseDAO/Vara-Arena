import { Box, BoxProps } from "@mantine/core";
import "./styles.scss";
import AvatarIcon from "assets/images/AvatarV2.png";
import { useCallback, useEffect, useReducer, useState } from "react";
import { routes } from "app/routes";
import { useNavigate } from "react-router-dom";
import { Modal } from "components/Modal";
import { CreateCharAlert } from "./components/CreateCharAlert";
import { AccountsModal } from "components/AccountsModal";
import { useAccount } from "@gear-js/react-hooks";

export const CharInfo = ({
  isMyCharacter,
  name,
  idStr,
  //
  exp,
  maxExp,
  level,
  ...boxProps
}: {
  isMyCharacter: boolean;
  name: string;
  idStr: string;
  //
  exp: number;
  maxExp: number;
  level: number;
} & BoxProps) => {
  const [alertVisible, toggleModalVisible] = useReducer(
    (state) => !state,
    false
  );
  const [walletVisible, toggleWalletVisible] = useReducer(
    (state) => !state,
    false
  );
  const navigate = useNavigate();
  const { account } = useAccount();

  const handleClickAccept = useCallback(() => {
    toggleModalVisible();
    navigate(routes.selectClass);
  }, [navigate]);

  const handleClickWallet = useCallback(() => {
    toggleWalletVisible();
    toggleModalVisible();
  }, []);

  return (
    <>
      {account && walletVisible && (
        <AccountsModal close={toggleWalletVisible} account={account} />
      )}
      {alertVisible && (
        <Modal
          showCloseButton={true}
          size="sm"
          onClose={toggleModalVisible}
          title="Create a new character"
          contentSlot={<CreateCharAlert.Content />}
          footerSlot={
            <CreateCharAlert.Footer
              name={name}
              onChangeWallet={handleClickWallet}
              onSubmit={handleClickAccept}
            />
          }
        />
      )}
      <Box className="profile_user" {...boxProps}>
        <div className="profile_photo">
          <img
            className={`profile_avatar ${isMyCharacter ? "my_avatar" : ""}`}
            src={AvatarIcon}
            alt="AvatarIcon"
          />
          <button className="profile_create_new" onClick={toggleModalVisible}>
            create new
          </button>
        </div>
        <div className="profile_name">
          <p>{name}</p>
          <p>{idStr}</p>

          <LevelBar maxXp={maxExp} curXp={exp} level={level} />
        </div>
      </Box>
    </>
  );
};

const LevelBar = ({
  maxXp,
  curXp,
  level,
}: {
  maxXp: number;
  curXp: number;
  level: number;
}) => {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    setTimeout(() => setPercent((curXp / maxXp) * 100), 300);
  });

  return (
    <div className="level_bar_wrapper">
      <span className="level_bar_text">Level</span>

      <div className="level_bar">
        <div
          className="level_bar_progress"
          style={{ maxWidth: `${percent}%` }}
        />
      </div>

      <span className="level_bar_level">{level}</span>
    </div>
  );
};
