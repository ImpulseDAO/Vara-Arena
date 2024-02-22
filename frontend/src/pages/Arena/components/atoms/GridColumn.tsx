import { Grid } from "@mantine/core";

export const GridColumn = ({ children }) => {
  return (
    <Grid.Col
      span={{
        xs: 12,
        sm: 6,
        md: 4,
      }}
    >
      {children}
    </Grid.Col>
  );
};
