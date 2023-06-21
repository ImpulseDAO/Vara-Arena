import { createEvent, createStore, sample } from 'effector';

const $user = createStore('');

const $registerUsers = createStore<
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

// const updateRegisterUsers = createEvent<
//   Array<{
//     id: string;
//     attributes: {
//       strength: string;
//       agility: string;
//       vitality: string;
//       stamina: string;
//     };
//     name: string;
//   }>
// >();

const setName = createEvent<string>();

// sample({ clock: updateRegisterUsers, target: $registerUsers });

sample({ clock: setName, target: $user });

export const userStore = {
  $user,
  setName,
  // $registerUsers,
  // updateRegisterUsers,
};
