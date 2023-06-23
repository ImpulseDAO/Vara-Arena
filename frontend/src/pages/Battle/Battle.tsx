import { FC, useEffect, useMemo, useState } from "react";
import "./styles.scss";
import { StatBar } from "components/StatBar";
import LockSvg from "../../assets/svg/lock.svg";
import CharSvg from "../../assets/svg/char.svg";
import StepBack from "../../assets/svg/step_back.svg";
import StepForward from "../../assets/svg/step_forward.svg";
import Forward from "../../assets/svg/forward.svg";
import Back from "../../assets/svg/back.svg";
import { Button } from "components/Button";
import { useUnit } from "effector-react";
import { logsStore } from "model/logs";
import { userStore } from "model/user";
import { isEmpty } from "lodash";

export type BattleProps = {};
export const Battle: FC<BattleProps> = () => {
  const [usersOnBattle, logs, battleIds, battleFinishedIndex, playerWon] =
    useUnit([
      logsStore.$usersOnBattle,
      logsStore.$logs,
      logsStore.$battleIds,
      logsStore.$battleFinishedIndex,
      logsStore.$playerWon,
    ]);

  const user = useUnit(userStore.$user);
  const [curBattle, setCurrentBattle] = useState(0);
  const [ownerBattleIds, setOwnerBattleIds] = useState<string[][]>([]);
  const [curLog, setCurLog] = useState(0);
  const [pos, setPos] = useState({ pos1: 0, pos2: 20 });
  const [hp, setHp] = useState({ hp1: "50", hp2: "50", pos: 0 });

  useEffect(() => {
    if (playerWon) {
      alert(`Победил пользователь ${usersOnBattle[playerWon].name}`);
    }
  }, [playerWon, usersOnBattle]);

  const [user1, user2] = useMemo(() => {
    if (isEmpty(ownerBattleIds)) {
      return [undefined, undefined];
    }
    return [
      usersOnBattle[ownerBattleIds[curBattle][0]],
      usersOnBattle[ownerBattleIds[curBattle][1]],
    ];
  }, [curBattle, ownerBattleIds, usersOnBattle]);

  useEffect(() => {
    if (user1 && user2) {
      // stats.vitality * 30 + 10
      setHp({
        hp1: (Number(user1.attributes.vitality) * 30 + 10).toString(),
        hp2: (Number(user2.attributes.vitality) * 30 + 10).toString(),
        pos: 0,
      });
    }
  }, [user1, user2]);

  // console.log("logs", logs);
  // window.logs = logs;
  // console.log("usersOnBattle", usersOnBattle);
  // window.usersOnBattle = usersOnBattle;
  // console.log("battleIds", battleIds);
  // window.battleIds = battleIds;
  // console.log("user", user);
  // window.user = user;
  // console.log("curBattle", curBattle);
  // window.curBattle = curBattle;
  // console.log("battleFinishedIndex", battleFinishedIndex);
  // window.battleFinishedIndex = battleFinishedIndex;
  // console.log("playerWon", playerWon);
  // window.playerWon = playerWon;

  // console.log("curLog", curLog);

  useEffect(() => {
    setOwnerBattleIds(battleIds.filter((ids) => ids.includes(user.id)));
  }, [battleIds, setOwnerBattleIds, user]);

  console.log("ownerBattleIds", ownerBattleIds);

  const handleOnNextBattle = () => {
    setCurrentBattle((prev) => {
      if (prev + 1 === ownerBattleIds.length) {
        return 0;
      }
      return prev + 1;
    });
  };

  const handleOnPrevBattle = () => {
    setCurrentBattle((prev) => {
      if (prev === 0) {
        return ownerBattleIds.length - 1;
      }
      return prev - 1;
    });
  };

  const handleOnNextLog = () => {
    setCurLog((prev) => {
      if (
        prev + 1 + +(battleFinishedIndex[curBattle - 1]?.index ?? "0") ===
        +battleFinishedIndex[curBattle].index
      ) {
        return prev + +(battleFinishedIndex[curBattle - 1]?.index ?? "0");
      }
      return prev + 1 + +(battleFinishedIndex[curBattle - 1]?.index ?? "0");
    });
  };

  const handleOnPrevLog = () => {
    setCurLog((prev) => {
      if (prev + +(battleFinishedIndex[curBattle - 1]?.index ?? "0") === 0) {
        return prev;
      }
      return prev + +(battleFinishedIndex[curBattle - 1]?.index ?? "0") - 1;
    });
  };

  useEffect(() => {
    const log = logs[curLog];
    const action = Object.keys(JSON.parse(log?.text))[0];
    const value = JSON.parse(log?.text)[action];
    if (action === "move") {
      if (user1?.id === log?.id) {
        setPos((prev) => ({
          ...prev,
          pos1: value.position,
        }));
      } else if (user2?.id === log?.id) {
        setPos((prev) => ({
          ...prev,
          pos2: value.position,
        }));
      }
    }

    if (action === "attack") {
      if (user1?.id === log?.id) {
        setHp((prev) => {
          return {
            ...prev,
            hp2: (
              +prev.hp2 -
              +value.damage * (curLog < prev.pos ? -1 : 1)
            ).toString(),
            pos: curLog,
          };
        });
      } else if (user2?.id === log?.id) {
        setHp((prev) => {
          return {
            ...prev,
            hp1: (
              +prev.hp1 -
              +value.damage * (curLog < prev.pos ? -1 : 1)
            ).toString(),
            pos: curLog,
          };
        });
      }
    }
  }, [curLog, logs, user1, user2]);

  return (
    <div className="battle">
      <div className="battle_users">
        <div className="battle_user1">
          <div className="battle_data">
            <div className="battle_user">
              <div className="battle_name">
                <p>{user1?.name}</p>
                <p>
                  <span>Level</span>
                  <span>1</span>
                </p>
              </div>
            </div>
            <div className="battle_armour">
              <span>Armour</span>
              <span>0</span>
            </div>
            <div className="battle_stats">
              <p>
                <span>Strength</span>
                <span>{user1?.attributes.strength}</span>
              </p>

              <p>
                <span>Agility</span>
                <span>{user1?.attributes.agility}</span>
              </p>
              <p>
                <span>Vitality</span>
                <span>{user1?.attributes.vitality}</span>
              </p>
              <p>
                <span>Stamina</span>
                <span>{user1?.attributes.stamina}</span>
              </p>
            </div>
          </div>
          <div className="battle_equip">
            <StatBar health={hp.hp1} />
            <div className={"img_wrapper"}>
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
        <div className="battle_user2">
          <div className="battle_data">
            <div className="battle_user">
              <div className="battle_name">
                <p>{user2?.name}</p>
                <p>
                  <span>Level</span>
                  <span>1</span>
                </p>
              </div>
            </div>
            <div className="battle_armour">
              <span>Armour</span>
              <span>0</span>
            </div>
            <div className="battle_stats">
              <p>
                <span>Strength</span>
                <span>{user2?.attributes.strength}</span>
              </p>

              <p>
                <span>Agility</span>
                <span>{user2?.attributes.agility}</span>
              </p>
              <p>
                <span>Vitality</span>
                <span>{user2?.attributes.vitality}</span>
              </p>
              <p>
                <span>Stamina</span>
                <span>{user2?.attributes.stamina}</span>
              </p>
            </div>
          </div>
          <div className="battle_equip">
            <StatBar health={hp.hp2} />
            <div className={"img_wrapper"}>
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
      </div>
      <div className="battle_actions">
        <Button className={"battle_button prev"} onClick={handleOnPrevBattle}>
          <img src={Back} /> Previous battle
        </Button>
        <Button
          className={"battle_button step_left"}
          disabled
          onClick={handleOnPrevLog}
        >
          <img src={StepBack} />
        </Button>
        <Button className={"battle_button play"} disabled onClick={() => {}}>
          Play battle
        </Button>
        <Button
          className={"battle_button step_right"}
          onClick={handleOnNextLog}
        >
          <img src={StepForward} />
        </Button>
        <Button className={"battle_button next"} onClick={handleOnNextBattle}>
          Next battle
          <img src={Forward} />
        </Button>
      </div>
      <div className="battle_logs">
        <div className="battle_line">
          <div className="battle_area">
            <div
              className="battle_line_user1"
              style={{
                left: `${pos.pos1 * 5 + 1}%`,
              }}
            />
            <div
              className="battle_line_user2"
              style={{ left: `${pos.pos2 * 5 - 1}%` }}
            />
            <div className="battle_axis" />
          </div>
        </div>
        <div className="battle_logs_content">
          {logs.map((player, i) => {
            const message = JSON.parse(player.text);
            const action = Object.keys(message)[0];
            const value = JSON.stringify(message[action]);

            if (
              i + +(battleFinishedIndex[curBattle - 1]?.index ?? "0") >=
              +battleFinishedIndex[curBattle].index
            ) {
              return null;
            }
            return (
              <div
                className={`battle_log ${
                  i + +(battleFinishedIndex[curBattle - 1]?.index ?? "0") ===
                  curLog
                    ? "active"
                    : ""
                }`}
              >
                <p className={"battle_player_name"}>
                  №{i - +(battleFinishedIndex[curBattle - 1]?.index ?? "0")}:{" "}
                  {`${usersOnBattle[player.id].name}`}
                </p>
                <p>
                  action: {action}, value = {value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
