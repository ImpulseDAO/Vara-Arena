import { Paper, PaperProps } from "@mantine/core";

export const Panel = ({ children, turnOffPadding = false, ...paperProps }: PaperProps & {
  children: React.ReactNode,
  turnOffPadding?: boolean;
}) => {
  return (
    <Paper
      {...(turnOffPadding ? {} : { p: "lg" })}
      bg={"rgba(0, 0, 0, 0.7)"}
      withBorder
      radius={12}
      style={{
        border: "2px solid #eaecf0",
        color: 'white'
      }}
      {...paperProps}
    >
      {children}
    </Paper>
  );
};
