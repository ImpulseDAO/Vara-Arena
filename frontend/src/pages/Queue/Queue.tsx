import { FC, useEffect, useMemo, useState } from "react";
import "./styles.scss";
import { TableUI } from "components/Table";
import { TableColumnsType } from "components/Table/types";
import AvatarIcon from "../../assets/images/avatar.png";
import ProgressIcon from "../../assets/svg/progress.svg";
import { useAlert, useApi } from "@gear-js/react-hooks";
import { getProgramMetadata } from "@gear-js/api";
import { ARENA_ID, METADATA } from "pages/StartFight/constants";

import { useUnit } from "effector-react";
import { useNavigate } from "react-router-dom";
import { logsStore } from "model/logs";
import { isEmpty } from "lodash";
import { UnsubscribePromise } from "@polkadot/api/types";

export type QueueProps = {};

const inProgressColumns: TableColumnsType[] = [
  {
    field: "id",
    headerName: "Player ID",
    width: 220,
    position: "center",
  },
  {
    field: "NB",
    headerName: "Number of battles",
    width: 144,
    position: "center",
  },
  {
    field: "level",
    headerName: "Level",
    width: 172,
    position: "center",
  },
];

const getRows = (
  players: Array<{
    id: string;
    attributes: {
      strength: string;
      agility: string;
      vitality: string;
      stamina: string;
    };
    name: string;
  }>
) => {
  return players.map((player) => ({
    id: (
      <div className="row_player">
        <img src={AvatarIcon} />
        <div>
          <p className="row_name">{player.name}</p>
        </div>
      </div>
    ),
    NB: "0",
    level: <span className="row_lvl">1LVL</span>,
  }));
};

export const useWasmMetadata = (source: RequestInfo | URL) => {
  const alert = useAlert();
  const [data, setData] = useState<Buffer>();

  useEffect(() => {
    if (source) {
      fetch(source)
        .then((response) => response.arrayBuffer())
        .then((array) => Buffer.from(array))
        .then((buffer) => setData(buffer))
        .catch(({ message }: Error) => alert.error(`Fetch error: ${message}`));
    }
  }, [source]);

  return { buffer: data };
};

export const Queue: FC<QueueProps> = ({}) => {
  // const { buffer } = useWasmMetadata(stateMetaWasm);
  const [
    reset,
    setLogs,
    updateUsersReadyForBattle,
    usersOnBattle,
    setBattleIds,
    resetBattleIds,
    setBattleFinishedIndex,
    setPlayerWon,
  ] = useUnit([
    logsStore.reset,
    logsStore.setLogs,
    logsStore.updateUsersReadyForBattle,
    logsStore.$usersOnBattle,
    logsStore.setBattleIds,
    logsStore.resetBattleIds,
    logsStore.setBattleFinishedIndex,
    logsStore.setPlayerWon,
  ]);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const meta = useMemo(() => getProgramMetadata(METADATA), []);
  // const send = useSendMessage(ARENA_ID, meta);
  const [players, setPlayers] = useState<
    Array<{
      id: string;
      attributes: {
        strength: string;
        agility: string;
        vitality: string;
        stamina: string;
      };
      name: string;
    }>
  >([]);

  console.log("usersOnBattle", usersOnBattle);

  const inProgressRows = useMemo(() => getRows(players), [players]);

  useEffect(() => {
    reset();
    resetBattleIds();
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setTimer((prev) => prev + 1);
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  const { api } = useApi();

  useEffect(() => {
    let index = 0;
    let unsub: UnsubscribePromise | undefined;
    if (api?.gearEvents) {
      unsub = api.gearEvents.subscribeToGearEvent(
        "UserMessageSent",
        ({
          data: {
            //@ts-ignore
            message,
          },
        }) => {
          if (JSON.parse(message.toString()).source === ARENA_ID) {
            // console.log(
            //   "meta logs",
            //   meta
            //     //@ts-ignore
            //     .createType(meta.types.handle.output, message.payload)
            //     //@ts-ignore
            //     .toJSON()
            // );
            if (
              !isEmpty(
                meta
                  //@ts-ignore
                  .createType(meta.types.handle.output, message.payload)
                  //@ts-ignore
                  .toJSON()?.registeredPlayers
              )
            ) {
              setPlayers([
                ...(meta
                  //@ts-ignore
                  .createType(meta.types.handle.output, message.payload)
                  //@ts-ignore
                  .toJSON()?.registeredPlayers || []),
              ]);
              updateUsersReadyForBattle(
                [
                  ...(meta
                    //@ts-ignore
                    .createType(meta.types.handle.output, message.payload)
                    //@ts-ignore
                    .toJSON()?.registeredPlayers || []),
                ].reduce((acc, cur) => {
                  return {
                    ...acc,
                    [`${cur.id}`]: cur,
                  };
                }, {})
              );
            }

            if (
              meta
                //@ts-ignore
                .createType(meta.types.handle.output, message.payload)
                //@ts-ignore
                .toJSON()?.playerWon
            ) {
              setPlayerWon(
                meta
                  //@ts-ignore
                  .createType(meta.types.handle.output, message.payload)
                  //@ts-ignore
                  .toJSON()?.playerWon
              );
              navigate("/battle");
            }

            if (
              //@ts-ignore
              meta
                //@ts-ignore
                .createType(meta.types.handle.output, message.payload)
                //@ts-ignore
                .toJSON()?.battleStarted
            ) {
              setBattleIds(
                meta
                  //@ts-ignore
                  .createType(meta.types.handle.output, message.payload)
                  //@ts-ignore
                  .toJSON()?.battleStarted
              );
            }

            if (
              //@ts-ignore
              meta
                //@ts-ignore
                .createType(meta.types.handle.output, message.payload)
                //@ts-ignore
                .toJSON()?.battleFinished
            ) {
              setBattleFinishedIndex({
                index: index.toString(),
                id: meta
                  //@ts-ignore
                  .createType(meta.types.handle.output, message.payload)
                  //@ts-ignore
                  .toJSON()?.battleFinished,
              });
            }

            if (
              meta
                //@ts-ignore
                .createType(meta.types.handle.output, message.payload)
                //@ts-ignore
                .toJSON()?.battleEvent
            ) {
              const [id, action] = meta
                //@ts-ignore
                .createType(meta.types.handle.output, message.payload)
                //@ts-ignore
                .toJSON()?.battleEvent;
              setLogs({ text: JSON.stringify(action), id: `${id}` });
              index++;
            }
          }
        }
      );
    }

    return () => {
      unsub?.then((res) => console.log("res", res()));
    };
  }, [api]);

  return (
    <div className="queue">
      <div className="modal_queue">
        <div className="modal_loader">
          <p className="modal_tille">Tournament participants</p>
          <img className={"modal_progress"} src={ProgressIcon} />
          <p className="modal_info">Waiting players</p>
          <p className="modal_badge">{`${Math.floor(timer / 60)
            .toString()
            .padStart(2, "0")}:${(timer - Math.floor(timer / 60) * 60)
            .toString()
            .padStart(2, "0")}`}</p>
        </div>
        <div className="modal_table">
          <TableUI rows={inProgressRows} columns={inProgressColumns} />
        </div>
      </div>
    </div>
  );
};
