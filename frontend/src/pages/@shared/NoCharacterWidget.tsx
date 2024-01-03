import { Button, Stack, Title } from "@mantine/core";
import { routes } from "app/routes";
import { Panel } from "components/Panel";
import { useNavigate } from "react-router-dom";

export const NoCharacterWidget = () => {
  const navigate = useNavigate();

  return (
    <Stack justify="center" align="center" w="100%">
      <Panel w={375}>
        <Title
          order={3}
          mb="lg"
        >
          You don't have a character yet
        </Title>
        <Button onClick={() => navigate(routes.mintCharacter)}>
          Create
        </Button>
      </Panel>
    </Stack>
  );
};
