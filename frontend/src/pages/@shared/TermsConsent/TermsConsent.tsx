import React from "react";
import { useConsent } from "./components/utils";
import { Center, Checkbox, Flex, Overlay, Stack, Text, Button, Anchor } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { routes } from "app/routes";
import { APP_ROUTER_BASENAME } from "consts";

export const TermsConsent = ({ children }: {
  children?: React.ReactNode;
}) => {
  const [checked, setChecked] = React.useState(false);
  const navigate = useNavigate();
  const handleLogout = () => navigate(routes.logoutScreen);

  const {
    giveConsent,
    dateOfConsent
  } = useConsent();

  if (dateOfConsent) return null;

  return (
    <Overlay
      // bg={'black'}
      blur={15}
      pos={'absolute'}

    >
      <Center h="100%" >
        <Stack w="300px" >
          <Stack gap={2}>
            <Checkbox
              checked={checked}
              onChange={(event) => {
                setChecked(event.currentTarget.checked);
              }}
              styles={{
                label: {
                  transform: 'translateY(-2px)',
                }
              }}
              label={(
                <Text>
                  I agree to the
                  {' '}
                  <Anchor href={`${APP_ROUTER_BASENAME}/Terms of Use - Impulse Labs LLC.pdf`} target="_blank">Terms of Use</Anchor>.
                  <br />
                </Text>
              )}

            />
            <Text size="sm" >
              By clicking “Play” I confirm that I have read it and agree to the terms and conditions.
            </Text>
            <Button
              mt="xs"
              size="lg"
              onClick={giveConsent}
              disabled={!checked}
              style={{
                transition: 'all 0.4s ease',
              }}
            >
              Play
            </Button>
          </Stack>




          <Flex justify={'center'}>
            <Anchor onClick={handleLogout}>
              Go back to the start screen
            </Anchor>
          </Flex>
        </Stack>
      </Center>
    </Overlay>
  );
};
