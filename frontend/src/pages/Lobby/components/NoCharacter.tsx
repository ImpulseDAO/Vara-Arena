import { Anchor, Box, BoxProps, Text } from "@mantine/core";
import { useMyHeroIsDead } from "app/api/mintState";
import { routes } from "app/routes";
import { Panel } from "components/Panel";
import { useNavigate } from "react-router-dom";

export const NoCharacter = (boxProps: BoxProps) => {
  const navigate = useNavigate();
  const { isDead: isMyHeroDead, isFresh } = useMyHeroIsDead();



  if (isMyHeroDead || isFresh) return (
    <Box {...boxProps}>
      <Panel p="md" maw="20rem" >
        <Text fz={14} fw="500" ta="center">
          {
            isMyHeroDead
              ? <>Unfortunately, you cannot participate in battles, because your character is <Text component="span" c='redHealth' fz={14}>dead</Text>.</>
              : "You cannot participate in battles, because you don't have any character yet."
          }
          <br />
          <Anchor
            fw="500"
            onClick={() => navigate(routes.mintCharacter)}
            fz={14}
          >
            Click here to create a character
          </Anchor>
        </Text>
      </Panel>
    </Box>
  );

  return null;
};
