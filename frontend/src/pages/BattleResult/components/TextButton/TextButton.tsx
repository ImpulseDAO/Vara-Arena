import { Anchor } from "@mantine/core";
import styles from './TextButton.module.css';
import clsx from "clsx";

export const TextButton = ({
  disabled = false,
  onClick,
  children
}: {
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return <Anchor
    className={clsx(styles.textButton, disabled && styles.textButtonDisabled)}
    pl="sm"
    onClick={disabled ? undefined : onClick}
  >
    {children}
  </Anchor>;
};
