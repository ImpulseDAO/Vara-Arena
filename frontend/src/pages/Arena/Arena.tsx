import { Grid, Flex, Checkbox, Box } from "@mantine/core";
import { Filters, GridColumn } from "./components/atoms";
import { CreateLobby } from "./components/molecules/CreateLobby";
import { LobbyList } from "./components/molecules/LobbyList";
import { memo, useCallback, useReducer, useState } from "react";

import styles from "./Arena.module.scss";


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
      className={styles.wrapper}
    >
      <Flex
        style={{
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Box
          // h={36}
          p={10}
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: "9px",
            border: "1px solid white",
            gap: 12,
            flexWrap: "wrap",
            width: "fitContent",
            height: "fitContent",
            minHeight: "36px",
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
      <Flex className={styles.gridWrapper}>
        <Grid
          mt={20}
          gutter={"md"}
        >
          <GridColumn >
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
