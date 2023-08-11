import { FC, useMemo, useState } from "react";
import "./styles.scss";
import StepBack from "../../assets/svg/step_back.svg";
import StepForward from "../../assets/svg/step_forward.svg";
import Forward from "../../assets/svg/forward.svg";
import Back from "../../assets/svg/back.svg";
import { Button } from "components/Button";
import { textMap } from "./components/textMap";
import { BattleUser } from "./components/BattleUser";
import { getTypeAttack } from "./utils/getTypeAttack";
import { ENERGY } from "../../app/constants";

export type BattleProps = {};

type TurnTypes = "move" | "attack" | "miss" | "rest";
type TurnGeneric<K extends TurnTypes, T> = { [key in K]: T };
type Turn =
  | TurnGeneric<"move", { position: number }>
  | TurnGeneric<"attack", { damage: number; position: number }>
  | TurnGeneric<"miss", { position: number }>
  | TurnGeneric<"rest", { position: number }>;

export type BattleLogs = {
  logs: Array<{
    c1: string;
    c2: string;
    turns: Turn[];
    winner: string;
  }>;
  winner: string;
};

export const Battle: FC<BattleProps> = () => {
  const usersOnBattle = JSON.parse(localStorage.getItem("usersOnQueue"));
  const battleLogs = JSON.parse(
    localStorage.getItem("battleLog")
  ) as BattleLogs;
  const [curBattleIndex, setCurrentBattleIndex] = useState(0);
  const [curTurnIndex, setCurTurnIndex] = useState(0);

  const nextBattleLog = () => {
    const count = battleLogs.logs.length;
    setCurTurnIndex(0);
    setCurrentBattleIndex((prev) => {
      if (prev + 1 === count) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevBattleLog = () => {
    const count = battleLogs.logs.length;
    setCurTurnIndex(0);
    setCurrentBattleIndex((prev) => {
      if (prev === 0) {
        return count - 1;
      }
      return prev - 1;
    });
  };

  const currentBattleLog = useMemo(() => {
    const curBattle = battleLogs.logs[curBattleIndex];
    let plPos1 = 0,
      plPos2 =
        "move" in curBattle.turns[1] ? curBattle.turns[1].move.position : 0;
    let pl1SumAttacked = 0,
      pl2SumAttacked = 0;

    // let pl1EnegryCost = 0,
    //   pl2EnegryCost = 0;

    const turns = curBattle.turns.map((turn, i) => {
      const action = Object.keys(turn)[0] as TurnTypes;
      const id = i % 2 === 0 ? curBattle.c1 : curBattle.c2;

      if ("move" in turn) {
        const { position } = turn.move;
        if (i % 2 === 0) {
          plPos1 = position;
          // pl1EnegryCost += 3;
        } else {
          plPos2 = position;
          // pl2EnegryCost += 3;
        }
      }

      if ("attack" in turn) {
        const { damage } = turn.attack;

        if (i % 2 === 0) {
          pl1SumAttacked += damage;
          // pl1EnegryCost += getTypeAttack(
          //   usersOnBattle[id].attributes.stamina,
          //   damage
          // ).costEnergy;
        } else {
          pl2SumAttacked += damage;
          // pl2EnegryCost += getTypeAttack(
          //   usersOnBattle[id].attributes.stamina,
          //   damage
          // ).costEnergy;
        }
      }

      // if ("rest" in turn) {
      //   if (i % 2 === 0) {
      //     pl1SumAttacked += damage;
      //     pl1EnegryCost += getTypeAttack(
      //       usersOnBattle[id].attributes.stamina,
      //       damage
      //     ).costEnergy;
      //   } else {
      //     pl2SumAttacked += damage;
      //     pl2EnegryCost += getTypeAttack(
      //       usersOnBattle[id].attributes.stamina,
      //       damage
      //     ).costEnergy;
      //   }
      // }

      return {
        action,
        pl1SumAttacked,
        pl2SumAttacked,
        pl2Pos:
          action === "move" && i % 2 !== 0
            ? Object.values(turn)[0].position
            : plPos2,
        pl1Pos:
          action === "move" && i % 2 === 0
            ? Object.values(turn)[0].position
            : plPos1,
        isPl1Turn: i % 2 === 0,
        isAttack: action === "attack",
        isMiss: action === "miss",
        isMove: action === "move",
        isRest: action === "rest",
        value: Object.values(turn)[0],
        // pl2EnegryCost,
        // pl1EnegryCost,
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
      <h2 className="battle_winner_info">
        №{curBattleIndex + 1}{" "}
        {currentBattleLog.battleWinner === currentBattleLog.plId1
          ? user1?.name
          : user2?.name}{" "}
        won
      </h2>

      <div className="battle_users">
        git
        <BattleUser
          user={user1}
          userIndex={1}
          health={pl1Health}
          energy={ENERGY[user1.attributes.stamina]}
        />
        <BattleUser
          user={user2}
          userIndex={2}
          health={pl2Health}
          energy={ENERGY[user2.attributes.stamina]}
        />
      </div>
      <div className="battle_actions">
        <Button
          disabled={battleLogs.logs.length <= 1}
          className={"battle_button prev"}
          onClick={prevBattleLog}
        >
          <img src={Back} alt=" Previous battle" /> Previous battle
        </Button>
        <Button className={"battle_button step_left"} onClick={prevBattleTurn}>
          <img src={StepBack} alt="Step back" />
        </Button>
        <Button disabled className={"battle_button play"} onClick={() => {}}>
          Play battle
        </Button>
        <Button className={"battle_button step_right"} onClick={nextBattleTurn}>
          <img src={StepForward} alt="Step forward" />
        </Button>
        <Button
          disabled={battleLogs.logs.length <= 1}
          className={"battle_button next"}
          onClick={nextBattleLog}
        >
          Next battle
          <img src={Forward} alt="Next battle" />
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
        <table className="battle_logs_content">
          {(currentBattleLog.turns ?? []).map((currentTurn, i, arr) => {
            const { isPl1Turn, isMove, isAttack, isMiss, isRest, value } =
              currentTurn;

            const name = usersOnBattle[currentTurn.id].name;

            return (
              <tr
                className={`battle_log ${i === curTurnIndex ? "active" : ""}`}
              >
                {/* Turn number */}
                <td>
                  <center>{i + 1}</center>
                </td>

                {/* Player Name */}
                <td className={"battle_player_name"}>{` ${name}`}</td>

                {/* Type */}
                <td className={"battle_turn_type"}>
                  <center>
                    {isMove
                      ? "Move"
                      : isAttack
                      ? "Attack"
                      : isMiss
                      ? "Miss"
                      : ""}
                  </center>
                </td>

                {/* Description */}
                {isMove ? (
                  <td>{textMap[isPl1Turn ? "moveRight" : "moveLeft"](name)}</td>
                ) : isAttack ? (
                  <td>
                    {textMap.normalAttack.success(name)}
                    <br />
                    Damage: {"damage" in value ? (value.damage as number) : 0}
                  </td>
                ) : isMiss ? (
                  <td>{textMap.normalAttack.fail(name)}</td>
                ) : isRest ? (
                  <td>{textMap.rest(name)}</td>
                ) : (
                  <td></td>
                )}
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};
