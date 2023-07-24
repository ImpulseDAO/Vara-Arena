import { FC, useCallback, useMemo } from "react";
import "./styles.scss";
import { StatBar } from "components/StatBar";
import LockSvg from "../../assets/svg/lock.svg";
import CharSvg from "../../assets/svg/char.svg";
import AvatarIcon from "../../assets/images/AvatarV2.png";
import LogoIcon from "../../assets/images/avatar.png";

import { useNavigate, useParams } from "react-router-dom";
import { useAccount, useReadWasmState } from "@gear-js/react-hooks";
import stateMetaWasm from "../../assets/mint_state.meta.wasm";
import { useWasmMetadata } from "pages/Queue";
import { MINT_ID } from "pages/MintCharacter/constants";
import { TableUI } from "components/Table";
import { TableColumnsType } from "components/Table/types";

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

// 142

export const Profile: FC = () => {
  const navigate = useNavigate();
  const { buffer } = useWasmMetadata(stateMetaWasm);
  const { id } = useParams<{ id: string }>();
  const { account } = useAccount();
  const goBack = useCallback(() => {
    navigate("/arena");
  }, [navigate]);

  const charInfo = useReadWasmState<{
    id: string;
    attributes: {
      strength: string;
      agility: string;
      vitality: string;
      stamina: string;
    };
    name: string;
  }>(MINT_ID, buffer, "character_info", id);

  const rows = useMemo(() => {
    const allBattleLog = JSON.parse(localStorage.getItem("allBattleLog"));
    const usersOnQueue = JSON.parse(localStorage.getItem("usersOnQueue"));

    if (id !== account?.decodedAddress) {
      return [];
    }

    const logs = allBattleLog.reduce((acc, cur) => {
      const logs = (cur?.logs ?? []).filter((log) => {
        return log.c1 === charInfo.state?.id || log.c2 === charInfo.state?.id;
      });
      return acc.concat(logs);
    }, []);

    const rowsInfo = logs.map((log) => {
      let id;

      if (log.c1 !== charInfo.state?.id) {
        id = log.c1;
      }

      if (log.c2 !== charInfo.state?.id) {
        id = log.c2;
      }

      const name = usersOnQueue[id].name;

      return {
        id,
        name,
        isWinner: log.winner === charInfo.state?.id,
      };
    });

    return rowsInfo.map((row) => {
      return {
        id: (
          <div className="row_player">
            <img src={LogoIcon} />
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
  }, [charInfo.state]);

  return (
    <div className="profile">
      <div className="profile_char">
        <div className="profile_data">
          <div className="profile_user">
            <img className="profile_avatar" src={AvatarIcon} />
            <div className="profile_name">
              <p>{charInfo.state?.name}</p>
              {/* <p>@gladiator1299</p> */}
              <p>
                <span>Level</span>
                <span>0</span>
              </p>
            </div>
          </div>
          {/* <div className="profile_armour">
            <span>Armour</span>
            <span>50</span>
          </div> */}
          <div className="profile_stats">
            <p>
              <span>Strength</span>
              <span>{charInfo.state?.attributes.strength}</span>
            </p>
            <p>
              <span>Agility</span>
              <span>{charInfo.state?.attributes.agility}</span>
            </p>
            <p>
              <span>Vitality</span>
              <span>{charInfo.state?.attributes.vitality}</span>
            </p>
            <p>
              <span>Stamina</span>
              <span>{charInfo.state?.attributes.stamina}</span>
            </p>
          </div>
        </div>
        <div className="profile_equip">
          <StatBar
            health={Number(charInfo.state?.attributes.vitality) * 30 + 10}
          />
          <div className={"imgWrapper"}>
            <img className={"lock_img1"} src={LockSvg} />
            <img className={"lock_img2"} src={LockSvg} />
            <img className={"lock_img3"} src={LockSvg} />
            <img className={"lock_img4"} src={LockSvg} />
            <img className={"lock_img5"} src={LockSvg} />
            <img className={"char_svg"} src={CharSvg} />
            <img className={"lock_img6"} src={LockSvg} />
            <img className={"lock_img7"} src={LockSvg} />
            <img className={"lock_img8"} src={LockSvg} />
            <img className={"lock_img9"} src={LockSvg} />
          </div>
        </div>
      </div>
      <div className="profile_story">
        {id === account?.decodedAddress ? (
          <TableUI rows={rows} columns={ProfileResultBattleColumns} />
        ) : null}
      </div>
    </div>
  );
};
