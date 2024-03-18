import { Anchor, Button, Flex, Stack, Text, Tooltip } from "@mantine/core";
import { StrategyInput } from "components/StrategyInput";
import { BlackButton } from "pages/BattleResult/components/BlackButton";
import React from "react";
import { useSendToMintContract } from '../../../app/api/sendMessages';
import { MAX_GAS_LIMIT } from "consts";
import { InputProgramId } from "./InputProgramId";
import { useStableAlert } from "hooks/useWatchMessages/useStableAlert";
import { getCodeIdsFromLocalStorage, useCodeAndProgramIDs } from "hooks/useCodeAndProgramIDs";
import { useFindMyVoucher } from "hooks/useFindMyVoucher";

export const UploadStrategyWidget = () => {
  const alert = useStableAlert();
  const [isVisible, setIsVisible] = React.useState(false);

  /**
   * Code and program ids
   */

  const {
    selectData,
    update: updateCodeAndProgramIds,
    getType
  } = useCodeAndProgramIDs();


  /**
   * Upload code 
   */

  const [value, setValue] = React.useState((getCodeIdsFromLocalStorage()[0] ?? null) as string | null);
  const type = getType(value);
  const codeId = type === 'code' ? value : null;
  const programId = type === 'program' ? value : null;

  /**
   * Run contract method UpdateCharacter
   */

  const { send } = useSendToMintContract();
  const { findVoucher } = useFindMyVoucher();

  /**
   * 
   */

  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdateCharacter = React.useCallback(async () => {
    setIsUpdating(true);

    if (codeId && programId) {
      alert.error("You can't upload both codeId and programId at the same time");
      setIsUpdating(false);
      return;
    }

    const payload = {
      UpdateCharacter: {
        code_id: codeId,
        address: programId
      },
    };

    const { voucherId } = await findVoucher(payload, 'MINT');


    send({
      payload,
      gasLimit: MAX_GAS_LIMIT,
      voucherId,
      onSuccess: (result) => {
        console.log("UpdateCharacter message successfully sent", result);
        setIsUpdating(false);
      },
      onError: () => {
        console.log("Error while trying to call UpdateCharacter method ");
        setIsUpdating(false);
      },
    });

  }, [alert, codeId, findVoucher, programId, send]);


  if (!isVisible) {
    return (
      <Tooltip
        multiline
        label={(
          <Text >
            You can upload your compiled strategy here or change to the previously uploaded.<br />
            <Anchor
              href={'https://impulse-dao.gitbook.io/impulse-dao/games-for-developers/arena/arena-v0.2/creating-a-gladiator'}
              target="_blank"
              rel="noopener noreferrer"
            >
              More info here
            </Anchor>
          </Text>
        )}
        color="black"
        position="bottom-start"
        withArrow
        closeDelay={200}
        p="xs"
        w="350px"
        transitionProps={{
          duration: 600,
          transition: 'pop-top-left'
        }}
        variant="outline"
        style={{ pointerEvents: 'auto' }}

      >
        <div>
          <BlackButton
            w="100%"
            onClick={() => setTimeout(() => setIsVisible(true), 100)}
            disabled={isUpdating}
            loading={isUpdating}
          >
            Change Strategy
          </BlackButton>
        </div>
      </Tooltip>
    );
  }

  return (
    <Stack gap={'sm'} >
      <StrategyInput
        value={value}
        selectData={selectData}
        setValue={(value) => {
          setValue(value);
          updateCodeAndProgramIds();
        }}
      />

      <InputProgramId
        onUpdate={(programId) => {
          updateCodeAndProgramIds();
          setValue(programId);
        }}
      />

      <Flex gap="md">
        <Button
          variant="outline"
          flex={1}
          color="white"
          onClick={() => setIsVisible(false)}
        >
          Cancel
        </Button>
        <Button
          flex={1}
          onClick={() => {
            handleUpdateCharacter();
            setIsVisible(false);
          }}
        >
          Confirm
        </Button>
      </Flex>
    </Stack >
  );
};
