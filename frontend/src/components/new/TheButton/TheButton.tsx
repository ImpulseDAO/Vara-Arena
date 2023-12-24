import { ComponentPropsWithoutRef } from "react";
import { Button, type ButtonProps } from "@mantine/core";

export const TheButton = ({
  children,
  onClick,
  ...buttonProps
}: ButtonProps & ComponentPropsWithoutRef<typeof Button<'button'>>) => {
  return (
    <Button
      radius="sm"
      h={44}
      bg="primary"
      sx={{
        boxShadow: 'sm',
      }}
      styles={(theme) => ({
        root: {
          '&:disabled': {
            backgroundColor: theme.colors.gray[5],
          },
        },
      })}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};
