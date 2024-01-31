import { Stack, Title } from "@mantine/core";
import { routes } from "app/routes";
import { Panel } from "components/Panel";
import { TheButton } from "components/TheButton";
import { useNavigate } from "react-router-dom";

export const NoCharacterWidget = () => {
  const navigate = useNavigate();

  return (
    <Stack justify="center" align="center" w="100%" my="auto">
      <Panel w={375}>
        <Title
          order={3}
          mb="lg"
        >
          You don't have a character yet
        </Title>
        <TheButton onClick={() => navigate(routes.selectClass)} w="100%">
          Create
        </TheButton>
      </Panel>
    </Stack>
  );
};
