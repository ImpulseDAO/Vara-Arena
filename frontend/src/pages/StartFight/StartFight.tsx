import { memo, useState } from "react";
import { useStore } from "effector-react";
import { userStore } from "model/user";
import { useOnSubmit } from "./hooks/useOnSubmit";
import { StartFightView } from "./components/StartFightView";
export const colourOptions = [
  { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
];

export const StartFight = memo(() => {
  const [user, setUser] = useState(undefined);
  const { name } = useStore(userStore.$user) ?? { name: "" };
  const handleSubmit = useOnSubmit();

  return (
    <StartFightView
      name={name}
      setUser={setUser}
      user={user}
      handleSubmit={handleSubmit}
    />
  );
});
