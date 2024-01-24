import { MantineProvider as MantineProviderInitial } from "@mantine/core";
import { cssVariablesResolver, theme } from "./theme";
import { ModalsProvider } from "./ModalsProvider";

export const MantineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <MantineProviderInitial theme={theme} cssVariablesResolver={cssVariablesResolver}>
      <ModalsProvider >
        {children}
      </ModalsProvider>
    </MantineProviderInitial>
  );
};
