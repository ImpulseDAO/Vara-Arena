import { Button, ButtonProps, DefaultProps } from "@mantine/core";

export const BlackButton = ({
  children,
  style,
  onClick,
  buttonRef,
  ...buttonProps
}: {
  onClick?: () => void;
  buttonRef?: React.ForwardedRef<HTMLButtonElement>;
  children: React.ReactNode;
} & ButtonProps & DefaultProps) => {
  return <Button
    ref={buttonRef}
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
      transition: 'background .1s ease-in-out',
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
