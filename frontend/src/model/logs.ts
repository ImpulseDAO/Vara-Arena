import { createEvent, createStore, sample } from "effector";

const $logs = createStore<Array<{ text: string; id: string }>>([]);

const reset = createEvent();

const setLogs = createEvent<{ text: string; id: string }>();

const $usersOnBattle = createStore<null | Record<
  string,
  {
    id: string;
    name: string;
    attributes: {
      strength: string;
      agility: string;
      vitality: string;
      stamina: string;
    };
  }
>>(null);

const updateUsersReadyForBattle = createEvent<
  Record<
    string,
    {
      id: string;
      name: string;
      attributes: {
        strength: string;
        agility: string;
        vitality: string;
        stamina: string;
      };
    }
  >
>();

const $battleStartedIndex = createStore<number[]>([]);
const setBattleStartedIndex = createEvent<number>();
const resetBattleStartedIndex = createEvent();

const updateAllBattleIds = createEvent<Array<Array<string>>>();
const $battleIds = createStore<Array<Array<string>>>([]);
const setBattleIds = createEvent<Array<string>>();
const resetBattleIds = createEvent();

sample({
  clock: setBattleStartedIndex,
  source: $battleStartedIndex,
  target: $battleStartedIndex,
  fn: (allIndex, index) => [...allIndex, index],
});

sample({
  clock: setBattleIds,
  source: $battleIds,
  target: $battleIds,
  fn: (allIds, ids) => [...allIds, ids],
});

sample({
  clock: updateUsersReadyForBattle,
  target: $usersOnBattle,
});

sample({
  clock: updateAllBattleIds,
  target: $battleIds,
});

sample({
  clock: setLogs,
  source: $logs,
  target: $logs,
  fn: (logs, log) => {
    return [...logs, log];
  },
});

$logs.reset(reset);
$battleStartedIndex.reset(resetBattleIds);
$battleIds.reset(resetBattleIds);

export const logsStore = {
  $logs,
  reset,
  setLogs,
  updateUsersReadyForBattle,
  $usersOnBattle,
  $battleIds,
  setBattleIds,
  updateAllBattleIds,
  resetBattleIds,
  $battleStartedIndex,
  setBattleStartedIndex,
  resetBattleStartedIndex,
};
