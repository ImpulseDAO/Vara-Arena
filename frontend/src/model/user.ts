import { createEvent, createStore, sample } from "effector";

const $user = createStore<null | {
  id: string;
  attributes: {
    strength: string;
    agility: string;
    vitality: string;
    stamina: string;
  };
  name: string;
}>(null);

$user.watch((state) => {
  console.log("state", state);
});

// const $registerUsers = createStore<
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
// >([]);

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

const setName = createEvent<{
  id: string;
  attributes: {
    strength: string;
    agility: string;
    vitality: string;
    stamina: string;
  };
  name: string;
}>();

// sample({ clock: updateRegisterUsers, target: $registerUsers });

sample({ clock: setName, target: $user });

export const userStore = {
  $user,
  setName,
  // $registerUsers,
  // updateRegisterUsers,
};
