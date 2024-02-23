import { Grid, Flex, Checkbox, Box } from "@mantine/core";
import { Filters, GridColumn } from "./components/atoms";
import { CreateLobby } from "./components/molecules/CreateLobby";
import { LobbyList } from "./components/molecules/LobbyList";
import { memo, useCallback, useReducer, useState } from "react";

export const Arena = memo(() => {
  const [filters, setFilters] = useState<string[]>([]);
  const [availableCheck, toggleAvailableCheck] = useReducer(
    (state) => !state,
    false
  );

  const [allOpenLobby, toggleAllOpenLobby] = useReducer(
    (state) => !state,
    false
  );

  const onChangeFilters = useCallback((filters: string[]) => {
    setFilters(filters);
  }, []);

  return (
    <Flex
      mt={20}
      pl={50}
      pr={50}
      style={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <Flex
        style={{
          gap: 10,
        }}
      >
        <Box
          h={36}
          pl={10}
          pr={10}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9px",
            border: "1px solid white",
            gap: 10,
          }}
          bg={"black"}
        >
          <Checkbox
            label="Show all open lobbies"
            checked={allOpenLobby}
            onChange={toggleAllOpenLobby}
          />
          <Checkbox
            label="Show available lobbies"
            checked={availableCheck}
            onChange={toggleAvailableCheck}
          />
        </Box>
        <Filters onChangeFilters={onChangeFilters} />
      </Flex>
      <Flex
        style={{
          flex: 1,
        }}
      >
        <Grid
          mt={20}
          gutter={"md"}
          style={{
            flex: 1,
            maxWidth: "min(1300px, 90%)",
          }}
        >
          <GridColumn>
            <CreateLobby />
          </GridColumn>
          <LobbyList
            filters={filters}
            allOpenLobby={allOpenLobby}
            availableCheck={availableCheck}
          />
        </Grid>
      </Flex>
    </Flex>
  );
});
