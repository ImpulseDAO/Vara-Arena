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
import { useUnit } from "effector-react";
import { logsStore } from "model/logs";
import { battle } from "model/battleLogs";

export type BattleProps = {};

type TurnTypes = "move" | "attack" | "miss" | "rest";
type TurnGeneric<K extends TurnTypes, T> = { [key in K]: T };
type Turn =
  | TurnGeneric<"move", { position: number }>
  | TurnGeneric<"attack", { damage: number; position: number }>
  | TurnGeneric<"miss", { position: number }>
  | TurnGeneric<"rest", { position: number }>;

type BattleLogs = {
  logs: Array<{
    c1: string;
    c2: string;
    turns: Turn[];
    winner: string;
  }>;
  winner: string;
};

const actions = {
  quickAttack: {
    success: (name: string) =>
      `${name} swiftly strikes the opponent with a quick attack, catching them off guard. The sound of steel meeting flesh echoes through the arena as the opponent staggers backward, momentarily disoriented`,
    fail: (name: string) =>
      `${name} swiftly lunges forward, aiming for a quick strike, but their opponent is as quick as a viper. With uncanny reflexes, the opponent anticipates the attack and gracefully evades it, leaving ${name} momentarily off balance. The crowd gasps in anticipation as the Gladiator readies themselves for the opponent's imminent counterattack`,
  },
  normalAttack: {
    success: (name: string) =>
      `With a calculated swing, ${name} delivers a solid blow with a normal attack. The clash of weapons reverberates in the air as the opponent grunts in pain`,
    fail: (name: string) =>
      `With determination, ${name} delivers a well-measured strike, but their opponent proves to be a formidable adversary. The opponent's defenses hold strong, deflecting the ${name}’s attack with impeccable skill. The clash of weapons echoes through the arena, drawing the attention of the crowd, who watches in anticipation as the ${name} quickly recovers, preparing for their next move`,
  },
  hardAttack: {
    success: (name: string) =>
      `Gathering all their strength, ${name} unleashes a powerful strike with a resounding impact. The force of the blow sends shockwaves through the arena, causing the opponent to stumble backward, clutching their wounds`,
    fail: (name: string) =>
      `Gathering every ounce of strength, ${name} unleashes a mighty swing, aiming to deliver a crushing blow. However, their opponent is no stranger to the art of combat. With an instinctual maneuver, the opponent expertly parries the ${name}’s attack, turning the forceful strike into a mere glancing blow. The arena rumbles with the sound of clashing steel, as the ${name} finds themselves momentarily exposed and on the defensive, forced to react swiftly to the opponent's ensuing assault`,
  },
  moveRight: (name: string) => `${name} steps to the right`,
  moveLeft: (name: string) => `${name} steps to the left`,
  rest: (name: string) =>
    `Sensing the ebb and flow of battle, ${name} takes a moment to catch their breath, seeking respite in the midst of combat. Gladiator’s muscles tense and relax as they regain focus, rejuvenating their stamina for the challenges that lie ahead`,
};

export const Battle: FC<BattleProps> = () => {
  const [
    // usersOnBattle,
    // battleLogs,
    // logs, battleIds, battleFinishedIndex, playerWon
  ] = useUnit([
    logsStore.$usersOnBattle,
    battle.$battleLogs,
    // logsStore.$logs,
    // logsStore.$battleIds,
    // logsStore.$battleFinishedIndex,
    // logsStore.$playerWon,
  ]);
  const usersOnBattle = JSON.parse(localStorage.getItem("usersOnQueue"));
  const battleLogs = JSON.parse(
    localStorage.getItem("battleLog")
  ) as BattleLogs;
  // const gearAlert = useAlert();
  // const user = useUnit(userStore.$user);
  const [curBattleIndex, setCurrentBattleIndex] = useState(0);
  const [curTurnIndex, setCurTurnIndex] = useState(0);

  console.log("battleLogs", battleLogs);

  console.log("usersOnBattle", usersOnBattle);

  const nextBattleLog = () => {
    const count = battleLogs.logs.length;
    setCurrentBattleIndex((prev) => {
      if (prev + 1 === count) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevBattleLog = () => {
    const count = battleLogs.logs.length;
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

    const turns = curBattle.turns.map((turn, i) => {
      const action = Object.keys(turn)[0] as TurnTypes;
      const id = i % 2 === 0 ? curBattle.c1 : curBattle.c2;

      if ("move" in turn) {
        const { position } = turn.move;
        if (i % 2 === 0) {
          plPos1 = position;
        } else {
          plPos2 = position;
        }
      }

      if ("attack" in turn) {
        const { damage } = turn.attack;

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
      <h2 className="battle_winner_info">
        {currentBattleLog.battleWinner === currentBattleLog.plId1
          ? user1?.name
          : user2?.name}{" "}
        won
      </h2>

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
                  <td>{actions[isPl1Turn ? "moveRight" : "moveLeft"](name)}</td>
                ) : isAttack ? (
                  <td>
                    {actions.normalAttack.success(name)}
                    <br />
                    Damage: {"damage" in value ? (value.damage as number) : 0}
                  </td>
                ) : isMiss ? (
                  <td>{actions.normalAttack.fail(name)}</td>
                ) : isRest ? (
                  <td>{actions.rest(name)}</td>
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
