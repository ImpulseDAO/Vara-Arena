import { Divider, Flex, Text, Box, Button, Tooltip } from "@mantine/core";
import type { FlexProps, BoxProps } from "@mantine/core";
import { capitalize } from "lodash";

export const CharStats = ({
  character,
  isReadyForLevelUp = false,
  selectAttr,
  isLoading,
  ...boxProps
}: {
  character: Character;
  isReadyForLevelUp?: boolean;
  selectAttr?: (capitalizedAttrName: string) => void;
  isLoading?: boolean;
} & BoxProps) => {
  return (
    <Box {...boxProps}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <Divider mt="sm" />
      <Attribute attributeName="Rating" value={character.tier_rating ?? 0} my="lg" />
      <Divider mb="xs" />
      {[
        'strength',
        'agility',
        'vitality',
        'stamina',
        'intelligence',
      ].map((attrName) => (
        <Attribute
          key={attrName}
          attributeName={capitalize(attrName)}
          value={character.attributes[attrName]}
          my="sm"
          selectAttr={isReadyForLevelUp ? selectAttr : undefined}
          isLoading={isLoading}
        />
      ))}
    </Box >
  );
};

const Attribute = ({
  attributeName,
  value,
  selectAttr,
  isLoading,
  ...flexProps
}: {
  attributeName: string;
  value: number;
  selectAttr?: (capitalizedAttrName: string) => void;
  isLoading?: boolean;
} & FlexProps) => {
  return (
    <Flex justify={'space-between'} align="center" {...flexProps}>

      <Flex align='center' gap="sm">
        {selectAttr && (
          <Tooltip
            multiline
            label={"You have points to spend after leveling up.\nClick on the attribute to increase it."}
            position="top-start"
            transitionProps={{ duration: 400 }}
          >
            <Button
              variant="outline"
              onClick={() => selectAttr(attributeName)}
              c="white"
              style={{ paddingInline: ".8rem" }}
              loading={isLoading}
            >
              +
            </Button>
          </Tooltip>
        )}
        <Text>{attributeName}</Text>
      </Flex>

      <Text fw="600">{value}</Text>

    </Flex >
  );
};
