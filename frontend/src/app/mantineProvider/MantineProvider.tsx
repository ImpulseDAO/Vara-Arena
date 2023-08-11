import { MantineProvider as MantineProviderInitial } from "@mantine/core";
import { theme } from "./theme";

export const MantineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <MantineProviderInitial theme={theme}>{children}</MantineProviderInitial>
  );
};
