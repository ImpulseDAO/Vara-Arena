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
  const [usersOnBattle, logs, battleIds, setBattleStartedIndex] = useUnit([
    logsStore.$usersOnBattle,
    logsStore.$logs,
    logsStore.$battleIds,
    logsStore.updateAllBattleIds,
    logsStore.setBattleStartedIndex,
    logsStore.resetBattleStartedIndex,
  ]);
  const user = useUnit(userStore.$user);
  const [curBattle, setCurrentBattle] = useState(0);
  const [ownerBattleIds, setOwnerBattleIds] = useState<string[][]>([]);

  const [user1, user2] = useMemo(() => {
    if (isEmpty(ownerBattleIds)) {
      return [undefined, undefined];
    }
    return [
      usersOnBattle[ownerBattleIds[curBattle][0]],
      usersOnBattle[ownerBattleIds[curBattle][1]],
    ];
  }, [curBattle, ownerBattleIds, usersOnBattle]);

  console.log("logs", logs);
  window.logs = logs;
  console.log("usersOnBattle", usersOnBattle);
  window.usersOnBattle = usersOnBattle;
  console.log("battleIds", battleIds);
  window.battleIds = battleIds;
  console.log("user", user);
  window.user = user;
  console.log("curBattle", curBattle);
  window.curBattle = curBattle;

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
            <StatBar />
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
            <StatBar />
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
        <Button className={"battle_button step_left"} onClick={() => {}}>
          <img src={StepBack} />
        </Button>
        <Button className={"battle_button play"} onClick={() => {}}>
          Play battle
        </Button>
        <Button className={"battle_button step_right"} onClick={() => {}}>
          <img src={StepForward} />
        </Button>
        <Button className={"battle_button next"} onClick={handleOnNextBattle}>
          Next battle
          <img src={Forward} />
        </Button>
      </div>
      <div className="battle_logs">
        <p>Battle #{`${Math.floor(Math.random() * 10000)}`}</p>
        <div className="battle_logs_content">
          {logs.map((player, i) => {
            const message = JSON.parse(player.text);
            const action = Object.keys(message)[0];
            const value = JSON.stringify(message[action]);

            return (
              <div className="battle_log">
                <p className={"battle_player_name"}>
                  №{logs.length - i}: {`${usersOnBattle[player.id].name}`}
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
