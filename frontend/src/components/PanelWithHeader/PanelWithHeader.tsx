import { Stack, StackProps } from "@mantine/core";
import { Header } from "./components/Header";
import styles from "./PanelWithHeader.module.css";

export const PanelWithHeader = ({
  headerTitle,
  children,
  ...boxProps
}: {
  headerTitle: string;
  children: React.ReactNode;
} & StackProps) => (
  <Stack gap={0} {...boxProps}>
    <Header>{headerTitle}</Header>
    <div className={styles.content}> {children}</div>
  </Stack>
);
