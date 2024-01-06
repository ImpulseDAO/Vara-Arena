import { Button, ButtonProps, DefaultProps } from "@mantine/core";

export const BlackButton = ({
  children,
  style,
  onClick,
  ...buttonProps
}: {
  onClick?: () => void;
} & ButtonProps & DefaultProps) => {
  return <Button
    h={44}
    bg="black"
    style={{
      display: "inline-flex",
      padding: "10px 16px",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      //
      borderRadius: "8px",
      ...(style ?? {})
    }}
    sx={theme => ({
      '&:disabled': {
        background: theme.colors.gray90[0],
        color: theme.colors.gray50[1],
        cursor: 'not-allowed',
      }
    })}
    {...buttonProps}
    onClick={onClick}
  >
    {children}
  </Button>;
};
