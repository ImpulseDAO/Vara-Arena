import { createEvent, createStore, sample } from "effector";

const $battleLogs = createStore<any>(null);

const setBattleLog = createEvent<any>();

$battleLogs.watch((data) => {
  console.log("logs", data);
});

sample({ clock: setBattleLog, target: $battleLogs });

export const battleLogs = {
  $battleLogs,
  setBattleLog,
};
