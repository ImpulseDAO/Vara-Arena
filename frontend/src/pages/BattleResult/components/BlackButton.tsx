import { Button, ButtonProps } from "@mantine/core";
import styles from './BlackButton.module.css';
import clsx from "clsx";

export const BlackButton = ({
  children,
  style,
  onClick,
  buttonRef,
  className,
  ...buttonProps
}: {
  onClick?: () => void;
  buttonRef?: React.ForwardedRef<HTMLButtonElement>;
  children: React.ReactNode;
} & ButtonProps) => {
  return <Button
    className={clsx(styles.blackButton, className)}
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

    {...buttonProps}
    onClick={onClick}
  >
    {children}
  </Button>;
};
