import { FC, useMemo, useState } from "react";
import "./styles.scss";
import { StatBar } from "components/StatBar";
import LockSvg from "../../assets/svg/lock.svg";
import CharSvg from "../../assets/svg/char.svg";
import StepBack from "../../assets/svg/step_back.svg";
import StepForward from "../../assets/svg/step_forward.svg";
import Forward from "../../assets/svg/forward.svg";
import Back from "../../assets/svg/back.svg";
import { Button } from "components/Button";

export type BattleProps = {};
export const Battle: FC<BattleProps> = () => {
  const usersOnBattle = JSON.parse(localStorage.getItem("usersOnQueue"));
  const battleLogs = JSON.parse(localStorage.getItem("battleLog"));
  const [curBattleIndex, setCurrentBattleIndex] = useState(0);
  const [curTurnIndex, setCurTurnIndex] = useState(0);

  const nextBattleLog = () => {
    //@ts-ignore
    const count = battleLogs.logs.length;
    setCurrentBattleIndex((prev) => {
      if (prev + 1 === count) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevBattleLog = () => {
    //@ts-ignore
    const count = battleLogs.logs.length;
    setCurrentBattleIndex((prev) => {
      if (prev === 0) {
        return count - 1;
      }
      return prev - 1;
    });
  };

  const currentBattleLog = useMemo(() => {
    //@ts-ignore
    const curBattle = battleLogs.logs[curBattleIndex];
    let plPos1 = 0,
      plPos2 = curBattle.turns[1].move.position;
    let pl1SumAttacked = 0,
      pl2SumAttacked = 0;

    const turns = curBattle.turns.map((turn, i) => {
      const action = Object.keys(turn)[0];
      const id = i % 2 === 0 ? curBattle.c1 : curBattle.c2;

      if (action === "move") {
        //@ts-ignore
        const position = Object.values(turn)[0].position;
        if (i % 2 === 0) {
          plPos1 = position;
        } else {
          plPos2 = position;
        }
      }

      if (action === "attack") {
        //@ts-ignore
        const damage = Object.values(turn)[0].damage;
        if (i % 2 === 0) {
          pl1SumAttacked += damage;
        } else {
          pl2SumAttacked += damage;
        }
      }

      return {
        action,
        pl1SumAttacked,
        pl2SumAttacked,
        pl2Pos:
          action === "move" && i % 2 !== 0
            ? //@ts-ignore
              Object.values(turn)[0].position
            : plPos2,
        pl1Pos:
          action === "move" && i % 2 === 0
            ? //@ts-ignore
              Object.values(turn)[0].position
            : plPos1,
        isPl1Turn: i % 2 === 0,
        isAttack: action === "attack",
        isMove: action === "move",
        isRest: action === "rest",
        value: Object.values(turn)[0],
        id,
      };
    });

    return {
      plId1: curBattle.c1,
      plId2: curBattle.c2,
      battleWinner: curBattle.winner,
      turns,
    };
  }, [battleLogs, curBattleIndex]);

  console.log("currentBattleLog", currentBattleLog);

  // useEffect(() => {
  //   if (playerWon) {
  //     alert(`Победил пользователь ${usersOnBattle[playerWon].name}`);
  //     gearAlert.success(
  //       `Победил пользователь ${usersOnBattle[playerWon].name}`
  //     );
  //   }
  // }, [playerWon, usersOnBattle]);

  const [user1, user2] = useMemo(() => {
    const curBattle = battleLogs.logs[curBattleIndex];
    if (usersOnBattle && curBattle) {
      return [usersOnBattle[curBattle.c1], usersOnBattle[curBattle.c2]];
    }
  }, [battleLogs.logs, curBattleIndex, usersOnBattle]);

  const nextBattleTurn = () => {
    setCurTurnIndex((prev) => {
      if (prev + 1 === currentBattleLog.turns.length) {
        return prev;
      }
      return prev + 1;
    });
  };

  const prevBattleTurn = () => {
    setCurTurnIndex((prev) => {
      if (prev === 0) {
        return prev;
      }
      return prev - 1;
    });
  };

  const pl1Health =
    usersOnBattle[currentBattleLog.plId1].attributes.vitality * 30 +
      10 -
      currentBattleLog.turns[curTurnIndex].pl2SumAttacked >
    0
      ? usersOnBattle[currentBattleLog.plId1].attributes.vitality * 30 +
        10 -
        currentBattleLog.turns[curTurnIndex].pl2SumAttacked
      : 0;

  const pl2Health =
    usersOnBattle[currentBattleLog.plId2].attributes.vitality * 30 +
      10 -
      currentBattleLog.turns[curTurnIndex].pl1SumAttacked >
    0
      ? usersOnBattle[currentBattleLog.plId2].attributes.vitality * 30 +
        10 -
        currentBattleLog.turns[curTurnIndex].pl1SumAttacked
      : 0;

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
            <StatBar health={pl1Health} />
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
            <StatBar health={pl2Health} />
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
        <Button
          disabled={battleLogs.logs.length <= 1}
          className={"battle_button prev"}
          onClick={prevBattleLog}
        >
          <img src={Back} /> Previous battle
        </Button>
        <Button className={"battle_button step_left"} onClick={prevBattleTurn}>
          <img src={StepBack} />
        </Button>
        <Button disabled className={"battle_button play"} onClick={() => {}}>
          Play battle
        </Button>
        <Button className={"battle_button step_right"} onClick={nextBattleTurn}>
          <img src={StepForward} />
        </Button>
        <Button
          disabled={battleLogs.logs.length <= 1}
          className={"battle_button next"}
          onClick={nextBattleLog}
        >
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
                left: `${currentBattleLog.turns[curTurnIndex].pl1Pos * 5 + 1}%`,
              }}
            />
            <div
              className="battle_line_user2"
              style={{
                left: `${currentBattleLog.turns[curTurnIndex].pl2Pos * 5 + 1}%`,
              }}
            />
            <div className="battle_axis" />
          </div>
        </div>
        <div className="battle_logs_content">
          {(currentBattleLog.turns ?? []).map((turn, i) => {
            return (
              <div
                className={`battle_log ${i === curTurnIndex ? "active" : ""}`}
              >
                <p className={"battle_player_name"}>
                  №{i + 1}:{` ${usersOnBattle[turn.id].name}`}
                </p>
                <p>
                  action: {turn.action}, value = {JSON.stringify(turn.value)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
