import { FC, useMemo } from "react";
import "./styles.scss";
import { StatBar } from "components/StatBar";
import LockSvg from "../../assets/svg/lock.svg";
import CharSvg from "../../assets/svg/char.svg";
import AvatarIcon from "../../assets/images/AvatarV2.png";
import LogoIcon from "../../assets/images/avatar.png";

import { useParams } from "react-router-dom";
import { useAccount, useReadWasmState } from "@gear-js/react-hooks";
import stateMetaWasm from "../../assets/mint_state.meta.wasm";
import { ProgramMetadata } from "@gear-js/api";
import { MINT_ID, METADATA } from "pages/MintCharacter/constants";
import { TableUI } from "components/Table";
import { TableColumnsType } from "components/Table/types";
import { ExperienceBar } from "components/ExperienceBar/ExperienceBar";
import { ButtonGroup } from "components/ButtonGroup";
import { useStats } from "./hooks/useStats";
import { Alert } from "components/Alert/Alert";
import { useWasmMetadata } from "../MintCharacter/hooks/useWasmMetadata";
import { ENERGY } from "../../app/constants";
import { ButtonGroupNew } from "components/ButtonGroupNew";

const ProfileResultBattleColumns: TableColumnsType[] = [
  {
    field: "id",
    headerName: "Player ID",
    width: 248,
    position: "center",
  },
  {
    field: "result",
    headerName: "Result",
    width: 300,
    position: "center",
  },
  {
    field: "level",
    headerName: "Level",
    width: 212,
    position: "center",
  },
];

export const MyProfile: FC = () => {
  const { buffer } = useWasmMetadata(stateMetaWasm);
  const params = useParams<{ id: string | undefined; }>();
  const { account } = useAccount();
  const meta = useMemo(() => ProgramMetadata.from(METADATA), []);

  /**
   * uses id from params if it exists
   * otherwise uses user's account id
   */
  const id = params.id ?? account?.decodedAddress;

  const metaWasmData: MetaWasmDataType = useMemo(
    () => ({
      programId: MINT_ID,
      programMetadata: meta,
      wasm: buffer,
      functionName: "character_info",
      argument: id,
    }),
    [id, meta, buffer]
  );

  const charInfo = useReadWasmState<{
    id: string;
    attributes: {
      strength: string;
      agility: string;
      vitality: string;
      stamina: string;
      experience: string;
      level: string;
    };
    name: string;
  }>(metaWasmData);

  const { accept, alertVisible, cancel, selectAttr, stats } = useStats(
    charInfo?.state
  );

  console.log("charInfo?.state :>> ", charInfo?.state);

  const rows = useMemo(() => {
    const allBattleLog = JSON.parse(localStorage.getItem("allBattleLog") ?? '[]');
    const usersOnQueue = JSON.parse(localStorage.getItem("usersOnQueue") ?? '[]');

    if (id !== account?.decodedAddress) {
      return [];
    }

    const logs = (allBattleLog ?? []).reduce((acc, cur) => {
      const logs = (cur?.logs ?? []).filter((log) => {
        return log.c1 === charInfo.state?.id || log.c2 === charInfo.state?.id;
      });
      return acc.concat(logs);
    }, []);

    const rowsInfo = logs
      .map((log) => {
        let id;

        if (log.c1 !== charInfo.state?.id) {
          id = log.c1;
        }

        if (log.c2 !== charInfo.state?.id) {
          id = log.c2;
        }

        const name = usersOnQueue[id]?.name;

        return {
          id,
          name,
          isWinner: log.winner === charInfo.state?.id,
        };
      })
      .filter(({ name }) => name != null);

    return rowsInfo.map((row) => {
      return {
        id: (
          <div className="row_player">
            <img src={LogoIcon} alt="LogoIcon" />
            <div>
              <p className="row_name">{row.name}</p>
            </div>
          </div>
        ),
        result: (
          <div>
            {row.isWinner ? (
              <span className="row_win">Win</span>
            ) : (
              <span className="row_lose">Lose</span>
            )}
          </div>
        ),
        level: <p className="row_lvl">0 LVL</p>,
      };
    });
  }, [account?.decodedAddress, charInfo.state?.id, id]);

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
            <img className="profile_avatar" src={AvatarIcon} alt="AvatarIcon" />
            <div className="profile_name">
              <p>{charInfo.state?.name}</p>
              {/* <p>@gladiator1299</p> */}
              {id === account?.decodedAddress && (
                <ExperienceBar curXp={stats.experience} maxXp={stats.maxExp} />
              )}
              <p>
                <span>Level</span>
                <span>{stats.level}</span>
              </p>
            </div>
          </div>
          {/* <div className="profile_armour">
            <span>Armour</span>
            <span>50</span>
          </div> */}
          <div className="profile_stats">
            {id === account?.decodedAddress && (
              <div>
                <span>Available points</span>
                <span>{stats.points}</span>
              </div>
            )}

            <ButtonGroupNew
              leftText={"Strength"}
              value={stats.strength}
              secondButton={"+"}
              onClickSecondButton={
                id === account?.decodedAddress && +stats.points
                  ? () => selectAttr("Strength")
                  : undefined
              }
            />
            <ButtonGroup
              leftText={"Agility"}
              secondButton={stats.agility}
              thirdButton={"+"}
              onClickSecondButton={
                id === account?.decodedAddress && +stats.points
                  ? () => selectAttr("Agility")
                  : undefined
              }
            />
            <ButtonGroup
              leftText={"Vitality"}
              secondButton={stats.vitality}
              thirdButton={"+"}
              onClickSecondButton={
                id === account?.decodedAddress && +stats.points
                  ? () => selectAttr("Vitality")
                  : undefined
              }
            />
            <ButtonGroup
              leftText={"Stamina"}
              secondButton={stats.stamina}
              thirdButton={"+"}
              onClickSecondButton={
                id === account?.decodedAddress && +stats.points
                  ? () => selectAttr("Stamina")
                  : undefined
              }
            />
          </div>
        </div>
        <div className="profile_equip">
          <StatBar
            health={Number(charInfo.state?.attributes.vitality) * 30 + 10}
            energy={ENERGY[Number(charInfo.state?.attributes.stamina ?? 1)]}
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
        </div>
      </div>
      <div className="profile_story">
        {id === account?.decodedAddress && rows.length > 0 ? (
          <TableUI rows={rows} columns={ProfileResultBattleColumns} />
        ) : null}
      </div>
    </div>
  );
};
