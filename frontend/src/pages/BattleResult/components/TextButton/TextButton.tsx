import { Anchor } from "@mantine/core";
import styles from './TextButton.module.css';

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
    className={styles.textButton}
    pl="sm"
    onClick={disabled ? undefined : onClick}
  >
    {children}
  </Anchor>;
};
