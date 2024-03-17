import { Button, Checkbox, Flex } from "@mantine/core";
import { Styled } from "./styles";
import { FC, useState } from "react";
import { useDevice } from "shared/theme";

export type AlertFooterProps = {
  name: string;
  onSubmit: VoidFunction;
  onChangeWallet: VoidFunction;
};

export const AlertFooter: FC<AlertFooterProps> = ({
  name,
  onChangeWallet,
  onSubmit,
}) => {
  const [checked, setChecked] = useState(false);
  const device = useDevice();

  return (
    <Styled.Footer>
      <Checkbox
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
        label={
          <>
            <div style={{ fontSize: 16, display: "flex", gap: 8 }}>
              Ovewrite: <Styled.Name>{name}</Styled.Name>
            </div>
          </>
        }
      />
      <Styled.ButtonGroup device={device}>
        <Button
          onClick={onSubmit}
          radius="sm"
          bg={checked ? "primary" : "gray"}
          size="sm"
          disabled={!checked}
          style={{ width: "100%" }}
        >
          Create new
        </Button>
        <Button
          onClick={onChangeWallet}
          radius="sm"
          bg="#c77410"
          size="sm"
          style={{ width: "100%" }}
        >
          Switch wallet
        </Button>
      </Styled.ButtonGroup>
    </Styled.Footer>
  );
};
