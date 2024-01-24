import { FC, memo, useState } from "react";
import { MintCharacterView } from "./components/MintCharacterView";
import { useOnSubmit } from "./hooks/useOnSubmit";
import { useStats } from "./hooks/useStats";
import { getCodeIdsFromLocalStorage, useCodeAndProgramIDs } from "hooks/useCodeAndProgramIDs";
import { StrategyInput } from '../../components/StrategyInput/StrategyInput';

export type MintCharacterProps = {};

export const MintCharacter: FC<MintCharacterProps> = memo(() => {
  const [codeId, setCodeId] = useState(getCodeIdsFromLocalStorage()[0] as string | null);

  const [name, setName] = useState("");

  const { decrease, increase, stats } = useStats();
  const onSubmit = useOnSubmit({ codeId, name, stats });

  const {
    selectData,
    update: updateCodeAndProgramIds,
  } = useCodeAndProgramIDs();

  return (
    <MintCharacterView
      name={name}
      disabled={!!stats.points || !name}
      decrease={decrease}
      increase={increase}
      onChange={({ target }) => setName(target.value)}
      onSubmit={onSubmit}
      stats={stats}
      strategyInput={
        <StrategyInput
          value={codeId}
          selectData={selectData}
          setValue={(value) => {
            setCodeId(value);
            updateCodeAndProgramIds();
          }}
        />
      }
    />
  );
});
