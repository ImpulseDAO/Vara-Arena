import { Grid, Flex } from "@mantine/core";
import { GridColumn } from "./componets/atoms";
import { CreateLobby } from "./componets/molecules/CreateLobby";
import { LobbyList } from "./componets/molecules/LobbyList";
import { memo } from "react";

export const Arena = memo(() => {
  return (
    <Flex
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Grid
        m={"lg"}
        gutter={"md"}
        pb={150}
        style={{
          flex: 1,
          maxWidth: "min(1300px, 90%)",
        }}
      >
        {/* Отображение карточки создания лобби */}
        <GridColumn>
          <CreateLobby />
        </GridColumn>
        {/* Отображение списка лобби */}
        <LobbyList />
      </Grid>
    </Flex>
  );
});
