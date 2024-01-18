import { Anchor, Button, Flex, Stack, Text, Tooltip } from "@mantine/core";
import { StrategyInput } from "components/StrategyInput";
import { getCodeIdsFromLocalStorage } from "hooks/useUploadCode";
import { BlackButton } from "pages/BattleResult/components/BlackButton";
import React from "react";
import { useSendToMintContract } from '../../../app/api/sendMessages';
import { MAX_GAS_LIMIT } from "consts";
import { useShouldUseVoucher } from "hooks/useShouldUseVoucher";

export const UploadStrategyWidget = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  /**
   * Voucher
   */

  const shouldUseVoucher = useShouldUseVoucher();

  /**
   * Upload code 
   */

  const [data, setData] = React.useState({
    codeId: getCodeIdsFromLocalStorage()[0] ?? "",
    name: "",
  });

  const codeId = data.codeId;
  const setCodeId = (codeId) => setData({ ...data, codeId });
  const onUploadCodeChange = (codeId) => setData({ ...data, codeId });

  /**
   * Run contract method UpdateCharacter
   */

  const sendToMintContract = useSendToMintContract();

  /**
   * 
   */

  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdateCharacter = React.useCallback(async () => {
    setIsUpdating(true);

    const payload = {
      UpdateCharacter: {
        code_id: codeId,
      },
    };

    sendToMintContract({
      payload,
      gasLimit: MAX_GAS_LIMIT,
      withVoucher: shouldUseVoucher,
      onSuccess: (result) => {
        console.log("UpdateCharacter message successfully sent", result);
        setIsUpdating(false);
      },
      onError: () => {
        console.log("Error while trying to call UpdateCharacter method ");
        setIsUpdating(false);
      },
    });


  }, [codeId, sendToMintContract, shouldUseVoucher]);


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
        codeId={codeId}
        setCodeId={setCodeId}
        onUploadCodeChange={onUploadCodeChange}
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
