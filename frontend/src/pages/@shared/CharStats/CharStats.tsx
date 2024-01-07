import { Divider, Flex, Text, Box, Button, Tooltip } from "@mantine/core";
import type { FlexProps, BoxProps } from "@mantine/core";

export const CharStats = ({
  character,
  isReadyForLevelUp = false,
  selectAttr,
  ...boxProps
}: {
  character: Character;
  isReadyForLevelUp?: boolean;
  selectAttr?: (capitalizedAttrName: string) => void;
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
      <Attribute attributeName="Strength" value={character.attributes.strength} my="sm" selectAttr={isReadyForLevelUp ? selectAttr : undefined} />
      <Attribute attributeName="Agility" value={character.attributes.agility} my="sm" selectAttr={isReadyForLevelUp ? selectAttr : undefined} />
      <Attribute attributeName="Vitality" value={character.attributes.vitality} my="sm" selectAttr={isReadyForLevelUp ? selectAttr : undefined} />
      <Attribute attributeName="Stamina" value={character.attributes.stamina} my="sm" selectAttr={isReadyForLevelUp ? selectAttr : undefined} />
      <Attribute attributeName="Intelligence" value={character.attributes.intelligence} my="sm" selectAttr={isReadyForLevelUp ? selectAttr : undefined} />
    </Box >
  );
};

const Attribute = ({
  attributeName,
  value,
  selectAttr,
  ...flexProps
}: {
  attributeName: string;
  value: number;
  selectAttr?: (capitalizedAttrName: string) => void;
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
              w="1.3rem"
              onClick={() => selectAttr(attributeName)}
              c="white"
            >
              +
            </Button>
          </Tooltip>
        )}
        <Text>{attributeName}</Text>
      </Flex>

      <Text fw="600">{value}</Text>


      {/* <ButtonGroupNew
        key={attributeName}
        leftText={''}
        firstButton={"-"}
        value={value}
        secondButton={"+"}
        onClickSecondButton={() => selectAttr?.(attributeName)}
        isFirstDisabled={true}
        isSecondDisabled={false}
      /> */}
    </Flex >
  );
};
