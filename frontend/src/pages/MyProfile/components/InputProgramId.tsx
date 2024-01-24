import { useApi } from "@gear-js/react-hooks";
import { Button, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { addProgramIdToLocalStorage } from "hooks/useCodeAndProgramIDs";
import { useStableAlert } from "hooks/useWatchMessages/useStableAlert";
import React from "react";

export const InputProgramId = ({
  onUpdate
}: {
  onUpdate?: (value: string) => void;
}) => {
  const { api } = useApi();
  const alert = useStableAlert();
  const valueRef = React.useRef("");

  /**
   * Input Program Id
   */

  const handleInputProgramIdClick = async () => {
    modals.openConfirmModal({
      title: 'Please enter program ID',
      centered: true,
      children: (
        <Text size="sm">
          This is the program ID of the program you want to use to update your
          character.

          <TextInput
            onChange={(event) => {
              valueRef.current = event.currentTarget.value;
            }}
            mt="sm"
            label="Program ID"
            placeholder="Program ID"
            labelProps={{
              mb: 3,
            }}
          />
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        if (!api) {
          return alert.error("Api is not initialized");
        }

        const value = valueRef.current;

        api?.program.exists(value as `0x${string}`)
          .then(isValid => {
            if (!isValid) {
              alert.error("Invalid program ID");
              throw new Error("Invalid program ID");
            }
            addProgramIdToLocalStorage(value);
            onUpdate?.(value);
          })
          .catch((error) => {
            console.error(error);
          });
      },
    });
  };

  return (
    <Button
      variant="outline"
      color="white"
      onClick={handleInputProgramIdClick}
    >
      Input Program ID
    </Button>
  );
};
