import { FlexProps, Flex, Box, Text } from "@mantine/core";

export const GasReserved = ({
  gasNeeded,
  gasReserved,
  ...flexProps
}: {
  gasNeeded: number,
  gasReserved: number,
} & FlexProps) => {
  return (
    <Flex align={"center"} gap="xs" {...flexProps}>
      <Flex gap={2.75}>
        {
          Array.from({ length: gasNeeded }).map((_, index) => (
            <GasPoint filled={index < gasReserved} key={index} />
          ))
        }
      </Flex>

      <Text c="white" fw={600}>Gas Reserved</Text>
    </Flex >
  );
};

const GasPoint = ({ filled }: { filled?: boolean; }) => {
  return <Box bg={filled ? 'primary' : 'white'} w={20} h={8} sx={{
    borderRadius: 4,
  }} />;
};
