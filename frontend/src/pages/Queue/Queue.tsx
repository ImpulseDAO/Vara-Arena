import { FC, useEffect, useMemo, useState } from "react";
import "./styles.scss";
import { TableUI } from "components/Table";
import { TableColumnsType } from "components/Table/types";
import AvatarIcon from "../../assets/images/avatar.png";
import ProgressIcon from "../../assets/svg/progress.svg";
import {
  useAccount,
  useAlert,
  useApi,
  useReadWasmState,
  useSendMessage,
} from "@gear-js/react-hooks";
import { HexString } from "@polkadot/util/types";
import { getProgramMetadata } from "@gear-js/api";
import { ARENA_ID, METADATA } from "pages/StartFight/constants";
import stateMetaWasm from "../../assets/mint_state.meta.wasm";
import { MINT_ID } from "pages/MintCharacter/constants";
import { userStore } from "../../model/user";
import { useStore, useUnit } from "effector-react";
import { useNavigate } from "react-router-dom";
import { logsStore } from "model/logs";
import { isEmpty } from "lodash";

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
  ] = useUnit([
    logsStore.reset,
    logsStore.setLogs,
    logsStore.updateUsersReadyForBattle,
    logsStore.$usersOnBattle,
    logsStore.setBattleIds,
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

  const { account } = useAccount();

  console.log("account", account);
  console.log("usersOnBattle", usersOnBattle);

  const inProgressRows = useMemo(() => getRows(players), [players]);

  useEffect(() => {
    reset();
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setTimer((prev) => prev + 1000);
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  const { api } = useApi();
  // pewepew {"playerRegistered":"0x7c19d3c535a8abefb55ce6c0b4b64788a41986fce8f9b151ff5643e8fbf700ca"}

  useEffect(() => {
    if (api?.gearEvents) {
      api.gearEvents.subscribeToGearEvent(
        "UserMessageSent",
        ({
          data: {
            //@ts-ignore
            message,
          },
        }) => {
          console.log(
            "meta logs",
            meta
              //@ts-ignore
              .createType(meta.types.handle.output, message.payload)
              //@ts-ignore
              .toJSON()
          );
          if (JSON.parse(message.toString()).source === ARENA_ID) {
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

            // console.log(
            //   'hello',
            //   meta
            //     //@ts-ignore
            //     .createType(meta.types.handle.output, message.payload)
            //     //@ts-ignore
            //     .toJSON()?.battleEvent
            // );

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
              navigate("/battle");
            }
          }
        }
      );
    }
  }, [api]);

  return (
    <div className="queue">
      <div className="modal_queue">
        <div className="modal_loader">
          <p className="modal_tille">Tournament participants</p>
          <img className={"modal_progress"} src={ProgressIcon} />
          <p className="modal_info">Waiting players</p>
          <p className="modal_badge">{`${Math.floor(
            timer / (1000 * 60)
          )}:${Math.floor((timer - timer / 60) / 1000)}`}</p>
        </div>
        <div className="modal_table">
          <TableUI rows={inProgressRows} columns={inProgressColumns} />
        </div>
      </div>
    </div>
  );
};
