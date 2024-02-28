import { FC, memo, useState } from "react";
import { MintCharacterView } from "./components/MintCharacterView";
import { useOnSubmit } from "./hooks/useOnSubmit";
import { useStats } from "./hooks/useStats";
import { useCodeAndProgramIDs } from "hooks/useCodeAndProgramIDs";
import { StrategyInput } from '../../components/StrategyInput/StrategyInput';
import { useSearchParams } from "react-router-dom";
import { Specialization, getSpecializationOptions } from "consts";

export type MintCharacterProps = {};

export const MintCharacter: FC<MintCharacterProps> = memo(() => {
  /**
   * Stats state
   */
  const [searchParams] = useSearchParams();
  const speciatlization = searchParams.get('specialization') as Specialization | undefined;
  const { codeId: initialCodeId, initialStats } = getSpecializationOptions(speciatlization);
  const { decrease, increase, stats } = useStats(initialStats);

  /**
   * Inputs state
   */

  const [codeId, setCodeId] = useState(initialCodeId as string | null);
  const [name, setName] = useState("");

  /**
   * Submit and update handlers
   */
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
          label="Strategy"
          labelProps={{ mb: '0.3rem' }}
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
