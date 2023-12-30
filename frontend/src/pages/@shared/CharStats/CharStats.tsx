import { Divider, Flex, Text, Box } from "@mantine/core";
import type { FlexProps, BoxProps } from "@mantine/core";

export const CharStats = ({
  character,
  ...boxProps
}: {
  character: Character;
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
      <Attribute attributeName="Strength" value={character.attributes.strength} my="sm" />
      <Attribute attributeName="Agility" value={character.attributes.agility} my="sm" />
      <Attribute attributeName="Vitality" value={character.attributes.vitality} my="sm" />
      <Attribute attributeName="Stamina" value={character.attributes.stamina} my="sm" />
      <Attribute attributeName="Intelligence" value={character.attributes.intelligence} my="sm" />
    </Box >
  );
};

const Attribute = ({ attributeName, value, ...flexProps }: { attributeName: string; value: number; } & FlexProps) => {
  return (
    <Flex justify={'space-between'} {...flexProps}>
      <Text>{attributeName}</Text>
      <Text fw="600">{value}</Text>
    </Flex>
  );
};
