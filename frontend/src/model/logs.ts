import { createEvent, createStore, sample } from 'effector';

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

const $battleIds = createStore<Array<Array<string>>>([]);
const setBattleIds = createEvent<Array<string>>();

sample({
  clock: setBattleIds,
  source: $battleIds,
  target: $battleIds,
  fn: (allIds, ids) => {
    console.log('allIds, ids', allIds, ids);

    return [...allIds, ids];
  },
});

sample({
  clock: updateUsersReadyForBattle,
  target: $usersOnBattle,
});

sample({
  clock: setLogs,
  source: $logs,
  target: $logs,
  fn: (logs, log) => {
    return [log, ...logs];
  },
});

$logs.reset(reset);

export const logsStore = {
  $logs,
  reset,
  setLogs,
  updateUsersReadyForBattle,
  $usersOnBattle,
  $battleIds,
  setBattleIds,
};
