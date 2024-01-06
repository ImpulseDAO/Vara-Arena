import { ComponentPropsWithoutRef } from "react";
import { Button, type ButtonProps } from "@mantine/core";

export const TheButton = ({
  children,
  onClick,
  ...buttonProps
}: ButtonProps & ComponentPropsWithoutRef<typeof Button<'button'>>) => {
  return (
    <Button
      onClick={onClick}
      //
      radius="sm"
      bg="primary"
      size="md"
      px="xl"
      sx={{
        boxShadow: 'sm',
      }}
      styles={(theme) => ({
        root: {
          '&:disabled': {
            backgroundColor: theme.colors.gray[5],
            color: theme.colors.gray[6],
          },
        },
      })}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};
